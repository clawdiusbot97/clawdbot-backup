import { access, mkdir, readFile, rm, writeFile } from 'fs/promises';
import { constants } from 'fs';
import { join } from 'path';
import { safeResolve, validateWorkItemId } from '@/server/validate';
import { writeStaleDetectedLog } from '@/server/staleRuns';

export interface RunningState {
  id: string;
  action: string;
  agent: string;
  started_at: string;
  startedAt?: string;
  status_target?: string;
  pid?: number;
  heartbeat_at?: string;
  lastHeartbeatAt?: string;
  stale?: boolean;
}

interface FinishRunParams {
  id: string;
  action: string;
  agent: string;
  success: boolean;
  stdout: string;
  stderr: string;
  duration_ms: number;
  blocked_by_guardrail: boolean;
}

const DEFAULT_LOGS_DIR = 'brokia/mission-control/logs';

function getLogsDir(): string {
  return process.env.LOGS_DIR || DEFAULT_LOGS_DIR;
}

function getTimestampForFilename(date: Date): string {
  return date.toISOString().replace(/[:.]/g, '-');
}

function assertValidId(id: string): { id: string; mode: 'strict' | 'fallback' } {
  const validation = validateWorkItemId(id);
  if (!validation.ok) {
    throw new Error(`Invalid workitem id: ${validation.reason}`);
  }
  return validation;
}

function getItemDir(id: string): string {
  const { id: normalizedId } = assertValidId(id);
  return safeResolve(getLogsDir(), normalizedId);
}

function getRunningPath(id: string): string {
  return safeResolve(getItemDir(id), 'RUNNING.json');
}

function normalizeRunState(runState: RunningState): RunningState {
  const startedAt = runState.startedAt || runState.started_at;
  const lastHeartbeatAt = runState.lastHeartbeatAt || runState.heartbeat_at;

  return {
    ...runState,
    started_at: startedAt,
    heartbeat_at: lastHeartbeatAt,
    startedAt,
    lastHeartbeatAt,
  };
}

function getTtlMs(): number {
  const parsed = Number.parseInt(process.env.RUN_TTL_MINUTES || '10', 10);
  const ttlMinutes = Number.isFinite(parsed) && parsed > 0 ? parsed : 10;
  return ttlMinutes * 60 * 1000;
}

export async function startRun(params: {
  id: string;
  action: string;
  agent: string;
  status_target?: string;
  pid?: number;
}): Promise<void> {
  const validation = assertValidId(params.id);
  const nowIso = new Date().toISOString();

  const running: RunningState = {
    id: validation.id,
    action: params.action,
    agent: params.agent,
    started_at: nowIso,
    startedAt: nowIso,
    status_target: params.status_target,
    pid: params.pid,
    heartbeat_at: nowIso,
    lastHeartbeatAt: nowIso,
  };

  const existing = await getRunState(validation.id);
  if (existing) {
    running.started_at = existing.startedAt || existing.started_at;
    running.startedAt = running.started_at;
    running.heartbeat_at = nowIso;
    running.lastHeartbeatAt = nowIso;
    if (existing.status_target && !running.status_target) {
      running.status_target = existing.status_target;
    }
    if (existing.pid && !running.pid) {
      running.pid = existing.pid;
    }
  }

  await mkdir(getItemDir(validation.id), { recursive: true });
  await writeFile(getRunningPath(validation.id), JSON.stringify(running, null, 2));
}

export async function finishRun(params: FinishRunParams): Promise<void> {
  const validation = assertValidId(params.id);
  const finishedAt = new Date();
  const runState = await getRunState(validation.id);
  const startedAt =
    runState?.startedAt ||
    runState?.started_at ||
    new Date(finishedAt.getTime() - params.duration_ms).toISOString();

  const entry = {
    action: params.action,
    id: validation.id,
    success: params.success,
    blocked_by_guardrail: params.blocked_by_guardrail,
    stdout: params.stdout,
    stderr: params.stderr,
    duration_ms: params.duration_ms,
    provider: process.env.OPENCLAW_RESOLVED_PROVIDER || process.env.RESOLVED_PROVIDER || 'openai-codex',
    model: process.env.OPENCLAW_MODEL || process.env.MODEL || process.env.DEFAULT_MODEL || 'openai-codex/gpt-5.3-codex',
    started_at: startedAt,
    finished_at: finishedAt.toISOString(),
    agent: params.agent,
    id_validation: validation.mode,
  };

  await mkdir(getItemDir(validation.id), { recursive: true });
  await rm(getRunningPath(validation.id), { force: true });

  const filename = `${getTimestampForFilename(finishedAt)}_${params.action}.json`;
  await writeFile(join(getItemDir(validation.id), filename), JSON.stringify(entry, null, 2));
}

export async function getRunState(id: string): Promise<RunningState | null> {
  const validation = validateWorkItemId(id);
  if (!validation.ok) {
    return null;
  }

  try {
    const content = await readFile(getRunningPath(validation.id), 'utf-8');
    const parsed = JSON.parse(content) as RunningState;
    return normalizeRunState(parsed);
  } catch {
    return null;
  }
}

export async function isRunning(id: string): Promise<{ running: boolean; stale?: boolean; runState?: RunningState }> {
  const validation = validateWorkItemId(id);
  if (!validation.ok) {
    return { running: false };
  }

  try {
    await access(getRunningPath(validation.id), constants.F_OK);
  } catch {
    return { running: false };
  }

  const runState = await getRunState(validation.id);
  if (!runState) {
    return { running: true };
  }

  const lastHeartbeatAt = runState.lastHeartbeatAt || runState.heartbeat_at;
  if (lastHeartbeatAt) {
    const heartbeatMs = new Date(lastHeartbeatAt).getTime();
    if (Number.isFinite(heartbeatMs) && Date.now() - heartbeatMs > getTtlMs()) {
      const ttlMinutes = Math.round(getTtlMs() / 60000);
      await writeStaleDetectedLog(validation.id, runState, ttlMinutes);
      return {
        running: false,
        stale: true,
        runState: { ...runState, stale: true },
      };
    }
  }

  return {
    running: true,
    runState,
  };
}
