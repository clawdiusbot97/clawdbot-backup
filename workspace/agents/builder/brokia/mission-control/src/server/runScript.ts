import { exec, ExecOptions } from 'child_process';
import { promisify } from 'util';

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

/**
 * Regex pattern to detect guardrail blocks in script output
 * Matches: BLOCKED:, awaiting clarification, PROHIBIDA en triggers
 */
const GUARDRAIL_PATTERNS = /BLOCKED:|awaiting clarification|PROHIBIDA en triggers/i;

/**
 * Checks if output indicates the script was blocked by a guardrail
 */
function isBlockedByGuardrail(stdout: string, stderr: string): boolean {
  return GUARDRAIL_PATTERNS.test(stdout) || GUARDRAIL_PATTERNS.test(stderr);
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

/**
 * Validates that a command is whitelisted
 */
function validateCommand(scriptName: string): { valid: boolean; reason?: string } {
  // Only allow scripts from workitems directory
  if (!WHITELISTED_COMMANDS.includes(scriptName)) {
    return { valid: false, reason: `Command '${scriptName}' is not whitelisted` };
  }
  return { valid: true };
}

/**
 * Default execution options
 */
const DEFAULT_TIMEOUT_MS = 30000; // 30 seconds

/**
 * Runs a whitelisted workitems script with proper isolation and logging
 * 
 * @param scriptName - Name of the whitelisted script to run
 * @param args - Arguments to pass to the script
 * @param options - Execution options (timeout, cwd, env)
 * @returns ScriptResult matching the API response contract
 */
export async function runScript(
  scriptName: string,
  args: string[] = [],
  options: {
    timeoutMs?: number;
    cwd?: string;
    env?: Record<string, string>;
    action?: string;
    id?: string;
  } = {}
): Promise<ScriptResult> {
  const {
    timeoutMs = DEFAULT_TIMEOUT_MS,
    cwd = process.env.BROKIA_ROOT || '.',
    env = process.env,
    action = scriptName.replace('.sh', ''),
    id,
  } = options;

  // Validate command is whitelisted
  const validation = validateCommand(scriptName);
  if (!validation.valid) {
    return {
      success: false,
      action,
      id,
      message: `Blocked by guardrail: ${validation.reason}`,
      stdout: '',
      stderr: validation.reason || 'Unknown validation error',
      blocked_by_guardrail: true,
    };
  }

  // Build command with WORKITEMS_DIR prefix
  const workitemsDir = env.WORKITEMS_DIR || 'brokia/workitems';
  const command = `${workitemsDir}/${scriptName} ${args.join(' ')}`;

  const execOptions: ExecOptions = {
    timeout: timeoutMs,
    cwd,
    env: { ...env, BROKIA_ROOT: cwd } as NodeJS.ProcessEnv,
  };

  try {
    const { stdout, stderr } = await execAsync(command, execOptions);
    const stdoutStr = typeof stdout === 'string' ? stdout : String(stdout);
    const stderrStr = typeof stderr === 'string' ? stderr : String(stderr);
    const blocked = isBlockedByGuardrail(stdoutStr, stderrStr);

    return {
      success: !blocked,
      action,
      id,
      message: blocked
        ? `Script '${scriptName}' was blocked by guardrail`
        : `Script '${scriptName}' executed successfully`,
      stdout: stdoutStr,
      stderr: stderrStr,
      blocked_by_guardrail: blocked,
    };
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    const blocked = isBlockedByGuardrail('', errorMessage);

    return {
      success: false,
      action,
      id,
      message: blocked
        ? `Script '${scriptName}' was blocked by guardrail`
        : `Script execution failed: ${errorMessage}`,
      stdout: '',
      stderr: errorMessage,
      blocked_by_guardrail: blocked,
    };
  }
}

/**
 * Generates a log file path for a script execution
 * Format: logs/<WORKITEM_ID>/<timestamp>_<action>.log
 */
export function generateLogPath(workitemId: string, action: string): string {
  const logsDir = process.env.LOGS_DIR || 'brokia/mission-control/logs';
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  return `${logsDir}/${workitemId}/${timestamp}_${action}.log`;
}

/**
 * Writes execution result to a log file
 * This is a placeholder - actual logging would be implemented separately
 */
export async function writeLog(
  workitemId: string,
  action: string,
  result: ScriptResult
): Promise<void> {
  const logsDir = process.env.LOGS_DIR || 'brokia/mission-control/logs';
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const logPath = `${logsDir}/${workitemId}/${timestamp}_${action}.log`;
  
  // Placeholder for log writing logic
  // In production, this would write to the actual file
  console.log(`[LOG] Would write to: ${logPath}`);
}