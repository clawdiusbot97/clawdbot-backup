import { access, readdir, readFile } from 'fs/promises';
import { constants } from 'fs';
import { join } from 'path';
import { isRunning } from '@/server/runs';
import { safeResolve, validateWorkItemId } from '@/server/validate';
import { readRecentIndex, rebuildRecentIndexFromLogs, type RecentIndexEntry } from '@/server/recentIndex';
import type { RunningState } from '@/types/workitem';

export interface MissionLogEntry {
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
  file?: string;
}

const DEFAULT_LOGS_DIR = 'brokia/mission-control/logs';
const DEFAULT_RECENT_INDEX_MAX = 100;

function getLogsDir(): string {
  return process.env.LOGS_DIR || DEFAULT_LOGS_DIR;
}

function getRecentIndexMax(): number {
  const raw = process.env.RECENT_INDEX_MAX;
  const parsed = raw ? Number.parseInt(raw, 10) : DEFAULT_RECENT_INDEX_MAX;
  return Number.isFinite(parsed) ? Math.max(1, parsed) : DEFAULT_RECENT_INDEX_MAX;
}

async function fileExists(path: string): Promise<boolean> {
  try {
    await access(path, constants.F_OK);
    return true;
  } catch {
    return false;
  }
}

function toMissionLogEntry(raw: Record<string, unknown>, file?: string, fallbackId?: string): MissionLogEntry {
  const id =
    (typeof raw.id === 'string' && raw.id) ||
    (typeof raw.workitemId === 'string' && raw.workitemId) ||
    fallbackId ||
    'SYSTEM';

  return {
    action:
      typeof raw.action === 'string'
        ? raw.action
        : typeof raw.event === 'string'
          ? raw.event
          : String(raw.actionContext || 'unknown'),
    id,
    success: typeof raw.success === 'boolean' ? raw.success : raw.event === 'run_stale_detected',
    blocked_by_guardrail: Boolean(raw.blocked_by_guardrail),
    stdout: typeof raw.stdout === 'string' ? raw.stdout : '',
    stderr: typeof raw.stderr === 'string' ? raw.stderr : '',
    duration_ms: typeof raw.duration_ms === 'number' ? raw.duration_ms : 0,
    provider: typeof raw.provider === 'string' ? raw.provider : 'mission-control',
    model: typeof raw.model === 'string' ? raw.model : 'structured-log',
    started_at:
      typeof raw.started_at === 'string'
        ? raw.started_at
        : typeof raw.detectedAt === 'string'
          ? raw.detectedAt
          : typeof raw.timestamp === 'string'
            ? raw.timestamp
            : '',
    finished_at:
      typeof raw.finished_at === 'string'
        ? raw.finished_at
        : typeof raw.detectedAt === 'string'
          ? raw.detectedAt
          : typeof raw.timestamp === 'string'
            ? raw.timestamp
            : '',
    id_validation:
      raw.id_validation === 'strict' || raw.id_validation === 'fallback' ? raw.id_validation : undefined,
    file,
  };
}

function recentEntryToMissionLogEntry(entry: RecentIndexEntry): MissionLogEntry {
  return {
    action: entry.action,
    id: entry.id,
    success: Boolean(entry.success),
    blocked_by_guardrail: Boolean(entry.blocked_by_guardrail),
    stdout: '',
    stderr: '',
    duration_ms: typeof entry.duration_ms === 'number' ? entry.duration_ms : 0,
    provider: entry.agent || 'mission-control',
    model: 'recent-index',
    started_at: entry.timestamp,
    finished_at: entry.timestamp,
    id_validation: entry.id_validation,
  };
}

async function readLogJson(path: string, fallbackId?: string): Promise<MissionLogEntry | null> {
  try {
    const content = await readFile(path, 'utf-8');
    const parsed = JSON.parse(content) as Record<string, unknown>;
    return toMissionLogEntry(parsed, path, fallbackId);
  } catch {
    return null;
  }
}

async function scanRecentLogs(limit = 50): Promise<MissionLogEntry[]> {
  const logsRoot = getLogsDir();

  let idDirs: string[] = [];
  try {
    const dirEntries = await readdir(logsRoot, { withFileTypes: true });
    idDirs = dirEntries.filter((entry) => entry.isDirectory()).map((entry) => entry.name);
  } catch {
    return [];
  }

  const filesById = await Promise.all(
    idDirs.map(async (id) => {
      const validation = validateWorkItemId(id);
      if (!validation.ok) {
        return [] as { id: string; file: string }[];
      }

      try {
        const itemDir = safeResolve(logsRoot, validation.id);
        const files = await readdir(itemDir);
        return files
          .filter((file) => file.endsWith('.json') && file !== 'RUNNING.json')
          .map((file) => ({ id: validation.id, file }));
      } catch {
        return [] as { id: string; file: string }[];
      }
    })
  );

  const allFiles = filesById
    .flat()
    .sort((a, b) => b.file.localeCompare(a.file))
    .slice(0, Math.max(1, limit));

  return (
    await Promise.all(allFiles.map(({ id, file }) => readLogJson(safeResolve(logsRoot, id, file), id)))
  ).filter((entry): entry is MissionLogEntry => Boolean(entry));
}

export async function getWorkitemLogs(id: string, limit = 20): Promise<{
  running: boolean;
  runState?: RunningState;
  logs: MissionLogEntry[];
}> {
  const validation = validateWorkItemId(id);
  if (!validation.ok) {
    return { running: false, logs: [] };
  }

  const logsRoot = getLogsDir();
  const itemDir = safeResolve(logsRoot, validation.id);
  const runningPath = safeResolve(itemDir, 'RUNNING.json');

  const runningCheck = await isRunning(validation.id);
  const running = runningCheck.running;
  const runState = runningCheck.runState as RunningState | undefined;

  if (!running && !(await fileExists(runningPath))) {
    return { running, runState, logs: [] };
  }

  let files: string[] = [];
  try {
    files = await readdir(itemDir);
  } catch {
    return { running, runState, logs: [] };
  }

  const logFiles = files
    .filter((file) => file.endsWith('.json') && file !== 'RUNNING.json')
    .sort((a, b) => b.localeCompare(a))
    .slice(0, Math.max(1, limit));

  const logs = (await Promise.all(logFiles.map((file) => readLogJson(join(itemDir, file), validation.id)))).filter(
    (entry): entry is MissionLogEntry => Boolean(entry)
  );

  return {
    running,
    runState,
    logs,
  };
}

export async function getRecentLogs(limit = 50): Promise<MissionLogEntry[]> {
  const normalizedLimit = Math.max(1, limit);
  const indexed = await readRecentIndex(normalizedLimit);

  if (indexed.length > 0) {
    return indexed.map(recentEntryToMissionLogEntry);
  }

  const scanned = await scanRecentLogs(normalizedLimit);

  if (scanned.length > 0) {
    void rebuildRecentIndexFromLogs({ maxItems: getRecentIndexMax() }).catch((error) => {
      console.error('[logs] failed to rebuild recent index', error);
    });
  }

  return scanned;
}
