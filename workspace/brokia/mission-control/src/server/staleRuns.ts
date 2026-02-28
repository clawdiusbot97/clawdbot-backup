import { mkdir, readdir, readFile, writeFile } from 'fs/promises';
import { join } from 'path';
import type { RunningState, StaleDetectedEntry } from '@/types/workitem';
import { safeResolve, validateWorkItemId } from '@/server/validate';

const DEFAULT_LOGS_DIR = 'brokia/mission-control/logs';
const STALE_EVENT = 'run_stale_detected';
const STALE_DEDUPE_WINDOW_MS = 5 * 60 * 1000;

function getLogsDir(): string {
  return process.env.LOGS_DIR || DEFAULT_LOGS_DIR;
}

function getTimestampForFilename(date: Date): string {
  return date.toISOString().replace(/[:.]/g, '-');
}

async function hasRecentStaleEvent(logsDir: string, id: string, nowMs: number): Promise<boolean> {
  try {
    const itemDir = safeResolve(logsDir, id);
    const files = await readdir(itemDir);
    const staleFiles = files
      .filter((file) => file.endsWith(`_${STALE_EVENT}.json`))
      .sort((a, b) => b.localeCompare(a));

    if (staleFiles.length === 0) {
      return false;
    }

    const latestPath = safeResolve(itemDir, staleFiles[0]);
    const content = await readFile(latestPath, 'utf-8');
    const parsed = JSON.parse(content) as Partial<StaleDetectedEntry>;
    if (!parsed.detectedAt) {
      return false;
    }

    const detectedMs = new Date(parsed.detectedAt).getTime();
    return Number.isFinite(detectedMs) && nowMs - detectedMs < STALE_DEDUPE_WINDOW_MS;
  } catch {
    return false;
  }
}

export async function writeStaleDetectedLog(id: string, runState: RunningState, ttlMinutes: number): Promise<void> {
  const validation = validateWorkItemId(id);
  if (!validation.ok) {
    return;
  }

  const logsDir = getLogsDir();
  const now = new Date();
  const nowMs = now.getTime();

  if (await hasRecentStaleEvent(logsDir, validation.id, nowMs)) {
    return;
  }

  const normalizedRunState: RunningState = {
    ...runState,
    id: validation.id,
    started_at: runState.startedAt || runState.started_at,
    startedAt: runState.startedAt || runState.started_at,
    heartbeat_at: runState.lastHeartbeatAt || runState.heartbeat_at,
    lastHeartbeatAt: runState.lastHeartbeatAt || runState.heartbeat_at,
  };

  const entry: StaleDetectedEntry = {
    event: STALE_EVENT,
    id: validation.id,
    detectedAt: now.toISOString(),
    ttlMinutes,
    lastHeartbeatAt: normalizedRunState.lastHeartbeatAt,
    startedAt: normalizedRunState.startedAt,
    agent: normalizedRunState.agent,
  };

  try {
    const itemDir = safeResolve(logsDir, validation.id);
    await mkdir(itemDir, { recursive: true });

    const filename = `${getTimestampForFilename(now)}_${STALE_EVENT}.json`;
    const path = join(itemDir, filename);
    await writeFile(path, JSON.stringify(entry, null, 2), 'utf-8');
  } catch (error) {
    console.error('[staleRuns] failed to write stale detected log', {
      id: validation.id,
      error,
    });
  }
}
