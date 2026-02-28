import { exec, ExecOptions } from 'child_process';
import { promisify } from 'util';
import { mkdir, rm, writeFile } from 'fs/promises';
import { join } from 'path';
import { appendToRecentIndex } from '@/server/recentIndex';
import { validateWorkItemId } from '@/server/validate';

const execAsync = promisify(exec);

/**
 * Standard script execution response contract
 */
export interface ScriptResult {
  success: boolean;
  action: string;
  id?: string;
  message: string;
  stdout: string;
  stderr: string;
  blocked_by_guardrail: boolean;
}

interface RunScriptOptions {
  timeoutMs?: number;
  cwd?: string;
  env?: Record<string, string>;
  action?: string;
  id?: string;
  provider?: string;
  model?: string;
}

interface ScriptLogEntry {
  action: string;
  id: string;
  success: boolean;
  blocked_by_guardrail: boolean;
  stdout: string;
  stderr: string;
  duration_ms: number;
  provider: string;
  model: string;
  started_at: string;
  finished_at: string;
  id_validation?: 'strict' | 'fallback';
}

interface RunningEntry {
  action: string;
  started_at: string;
  script: string;
  args: string[];
  agent: 'mission-control';
}

/**
 * Whitelisted commands that can be executed by Mission Control
 * Only scripts in the workitems engine directory are allowed
 */
const WHITELISTED_COMMANDS = [
  'wi-create.sh',
  'wi-update.sh',
  'wi-move.sh',
  'wi-pipeline.sh',
  'wi-approve.sh',
  'wi-confirm.sh',
  'wi-clarify.sh',
  'wi-export.sh',
  'wi-watch.sh',
];

const DEFAULT_TIMEOUT_MS = 30000;
const DEFAULT_LOGS_DIR = 'brokia/mission-control/logs';

function normalizeId(id?: string): string {
  if (!id || !id.trim() || id === 'N/A') {
    return 'SYSTEM';
  }
  return id.trim();
}

function getLogsDir(): string {
  return process.env.LOGS_DIR || DEFAULT_LOGS_DIR;
}

function getTimestampForFilename(date: Date): string {
  return date.toISOString().replace(/[:.]/g, '-');
}

function shellEscapeArg(arg: string): string {
  if (arg.length === 0) return "''";
  return `'${arg.replace(/'/g, `'\\''`)}'`;
}

function resolveProvider(options: RunScriptOptions): string {
  return (
    options.provider ||
    process.env.OPENCLAW_RESOLVED_PROVIDER ||
    process.env.RESOLVED_PROVIDER ||
    process.env.LLM_PROVIDER ||
    'openai-codex'
  );
}

function resolveModel(options: RunScriptOptions): string {
  return (
    options.model ||
    process.env.OPENCLAW_MODEL ||
    process.env.MODEL ||
    process.env.DEFAULT_MODEL ||
    'openai-codex/gpt-5.3-codex'
  );
}

function validateCommand(scriptName: string): { valid: boolean; reason?: string } {
  if (!WHITELISTED_COMMANDS.includes(scriptName)) {
    return { valid: false, reason: `Command '${scriptName}' is not whitelisted` };
  }
  return { valid: true };
}

function extractIdFromArgs(args: string[]): string | undefined {
  const idIndex = args.findIndex((arg) => arg === '--id');
  if (idIndex >= 0 && args[idIndex + 1]) {
    return args[idIndex + 1];
  }
  return undefined;
}

function extractIdFromStdout(stdout: string): string | undefined {
  const match = stdout.match(/\b([A-Z]+-\d{8}-\d{3})\b/);
  return match?.[1];
}

function isGuardrailBlock(...parts: string[]): boolean {
  const text = parts.join('\n').toLowerCase();
  if (!text) return false;

  return (
    text.includes('guardrail') ||
    text.includes('blocked') ||
    text.includes('awaiting clarification') ||
    text.includes('no puede pasar a building sin aprobación') ||
    text.includes('🛑')
  );
}

async function writeRunningFile(logsDir: string, workitemId: string, entry: RunningEntry): Promise<void> {
  const dirPath = join(logsDir, workitemId);
  await mkdir(dirPath, { recursive: true });
  await writeFile(join(dirPath, 'RUNNING.json'), JSON.stringify(entry, null, 2));
}

async function removeRunningFile(logsDir: string, workitemId: string): Promise<void> {
  await rm(join(logsDir, workitemId, 'RUNNING.json'), { force: true });
}

async function writeStructuredLog(logsDir: string, workitemId: string, action: string, entry: ScriptLogEntry): Promise<string> {
  const timestamp = getTimestampForFilename(new Date(entry.finished_at));
  const dirPath = join(logsDir, workitemId);
  const logPath = join(dirPath, `${timestamp}_${action}.json`);

  await mkdir(dirPath, { recursive: true });
  await writeFile(logPath, JSON.stringify(entry, null, 2));

  return logPath;
}

/**
 * Runs a whitelisted workitems script with proper isolation and observability.
 */
export async function runScript(
  scriptName: string,
  args: string[] = [],
  options: RunScriptOptions = {}
): Promise<ScriptResult> {
  const {
    timeoutMs = DEFAULT_TIMEOUT_MS,
    cwd = process.env.BROKIA_ROOT || '.',
    env = process.env as Record<string, string>,
    action = scriptName.replace('.sh', ''),
    id,
  } = options;

  const startedAt = new Date();
  const logsDir = getLogsDir();
  const initialId = normalizeId(id || extractIdFromArgs(args));
  const provider = resolveProvider(options);
  const model = resolveModel(options);

  let stdout = '';
  let stderr = '';
  let success = false;
  let blockedByGuardrail = false;
  let message = '';
  let runningFileWritten = false;

  const validation = validateCommand(scriptName);

  try {
    if (!validation.valid) {
      blockedByGuardrail = true;
      message = `Blocked by guardrail: ${validation.reason}`;
      stderr = validation.reason || 'Unknown validation error';
      return {
        success: false,
        action,
        id: initialId,
        message,
        stdout,
        stderr,
        blocked_by_guardrail: blockedByGuardrail,
      };
    }

    const workitemsDir = env.WORKITEMS_DIR || 'brokia/workitems';
    const command = `${workitemsDir}/scripts/${scriptName}${args.length > 0 ? ` ${args.map(shellEscapeArg).join(' ')}` : ''}`;

    const execOptions: ExecOptions = {
      timeout: timeoutMs,
      cwd,
      env: {
        ...process.env,
        ...env,
        BROKIA_ROOT: cwd,
      },
    };

    await writeRunningFile(logsDir, initialId, {
      action,
      started_at: startedAt.toISOString(),
      script: scriptName,
      args,
      agent: 'mission-control',
    });
    runningFileWritten = true;

    const execResult = await execAsync(command, execOptions);
    success = true;
    stdout = execResult.stdout?.toString() || '';
    stderr = execResult.stderr?.toString() || '';
    message = `Script '${scriptName}' executed successfully`;

    return {
      success,
      action,
      id: normalizeId(id || extractIdFromArgs(args) || extractIdFromStdout(stdout)),
      message,
      stdout,
      stderr,
      blocked_by_guardrail: false,
    };
  } catch (error: unknown) {
    const execError = error as Error & { stdout?: string | Buffer; stderr?: string | Buffer };
    const errorMessage = execError?.message || 'Unknown error';

    stdout = execError.stdout?.toString() || '';
    stderr = execError.stderr?.toString() || errorMessage;
    blockedByGuardrail = isGuardrailBlock(errorMessage, stdout, stderr);
    message = blockedByGuardrail
      ? `Script blocked by guardrail: ${errorMessage}`
      : `Script execution failed: ${errorMessage}`;

    return {
      success: false,
      action,
      id: normalizeId(id || extractIdFromArgs(args) || extractIdFromStdout(stdout)),
      message,
      stdout,
      stderr,
      blocked_by_guardrail: blockedByGuardrail,
    };
  } finally {
    const finishedAt = new Date();
    const durationMs = finishedAt.getTime() - startedAt.getTime();
    const resolvedId = normalizeId(id || extractIdFromArgs(args) || extractIdFromStdout(stdout) || initialId);

    try {
      if (runningFileWritten) {
        await removeRunningFile(logsDir, initialId);
      }

      const idValidation = validateWorkItemId(resolvedId);
      const logEntry: ScriptLogEntry = {
        action,
        id: resolvedId,
        success,
        blocked_by_guardrail: blockedByGuardrail,
        stdout,
        stderr,
        duration_ms: durationMs,
        provider,
        model,
        started_at: startedAt.toISOString(),
        finished_at: finishedAt.toISOString(),
        id_validation: idValidation.ok ? idValidation.mode : undefined,
      };

      await writeStructuredLog(logsDir, resolvedId, action, logEntry);

      try {
        await appendToRecentIndex({
          id: resolvedId,
          action,
          timestamp: finishedAt.toISOString(),
          duration_ms: durationMs,
          success,
          blocked_by_guardrail: blockedByGuardrail,
          agent: 'mission-control',
          stale: false,
          id_validation: idValidation.ok ? idValidation.mode : undefined,
        });
      } catch (indexError) {
        console.error('[runScript] failed to append recent index', indexError);
      }
    } catch (logError) {
      console.error('[runScript] failed to persist observability logs', logError);
    }
  }
}

/**
 * Generates the log file path for a script execution.
 * Format: logs/<WORKITEM_ID>/<timestamp>_<action>.json
 */
export function generateLogPath(workitemId: string, action: string): string {
  const logsDir = getLogsDir();
  const timestamp = getTimestampForFilename(new Date());
  return `${logsDir}/${normalizeId(workitemId)}/${timestamp}_${action}.json`;
}

/**
 * Manual log writer (for non-script events).
 * Uses the same observability schema as runScript.
 */
export async function writeLog(workitemId: string, action: string, result: ScriptResult): Promise<string> {
  const now = new Date();
  const logsDir = getLogsDir();
  const normalizedId = normalizeId(workitemId || result.id);

  const idValidation = validateWorkItemId(normalizedId);

  return writeStructuredLog(logsDir, normalizedId, action, {
    action,
    id: normalizedId,
    success: result.success,
    blocked_by_guardrail: result.blocked_by_guardrail,
    stdout: result.stdout,
    stderr: result.stderr,
    duration_ms: 0,
    provider: process.env.OPENCLAW_RESOLVED_PROVIDER || 'mission-control',
    model: process.env.OPENCLAW_MODEL || 'manual-log',
    started_at: now.toISOString(),
    finished_at: now.toISOString(),
    id_validation: idValidation.ok ? idValidation.mode : undefined,
  });
}
