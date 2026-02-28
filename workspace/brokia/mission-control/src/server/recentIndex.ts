import { mkdir, readdir, readFile, rename, writeFile } from 'fs/promises';
import { join } from 'path';
import { safeResolve, validateWorkItemId } from '@/server/validate';

export interface RecentIndexEntry {
  id: string;
  action: string;
  timestamp: string;
  duration_ms?: number;
  success?: boolean;
  blocked_by_guardrail?: boolean;
  agent?: string;
  stale?: boolean;
  id_validation?: 'strict' | 'fallback';
}

const DEFAULT_LOGS_DIR = 'brokia/mission-control/logs';
const INDEX_DIRNAME = 'index';
const INDEX_FILENAME = 'recent.json';
const DEFAULT_RECENT_INDEX_MAX = 100;

function getLogsDir(): string {
  return process.env.LOGS_DIR || DEFAULT_LOGS_DIR;
}

function getMaxItemsFromEnv(): number {
  const raw = process.env.RECENT_INDEX_MAX;
  const parsed = raw ? Number.parseInt(raw, 10) : DEFAULT_RECENT_INDEX_MAX;
  return Number.isFinite(parsed) ? Math.max(1, parsed) : DEFAULT_RECENT_INDEX_MAX;
}

function getIndexPath(): string {
  const logsRoot = getLogsDir();
  return safeResolve(logsRoot, INDEX_DIRNAME, INDEX_FILENAME);
}

async function ensureIndexDir(): Promise<void> {
  await mkdir(safeResolve(getLogsDir(), INDEX_DIRNAME), { recursive: true });
}

async function atomicWriteJson(path: string, data: unknown): Promise<void> {
  const tmpPath = `${path}.tmp.${Math.random().toString(36).slice(2)}.json`;
  await writeFile(tmpPath, JSON.stringify(data, null, 2), 'utf-8');
  await rename(tmpPath, path);
}

async function readIndexFile(): Promise<RecentIndexEntry[] | null> {
  try {
    const content = await readFile(getIndexPath(), 'utf-8');
    const parsed = JSON.parse(content);
    if (!Array.isArray(parsed)) {
      return null;
    }

    return parsed
      .filter((item): item is RecentIndexEntry => Boolean(item && typeof item === 'object'))
      .map((item) => ({
        id: typeof item.id === 'string' ? item.id : 'SYSTEM',
        action: typeof item.action === 'string' ? item.action : 'unknown',
        timestamp: typeof item.timestamp === 'string' ? item.timestamp : new Date(0).toISOString(),
        duration_ms: typeof item.duration_ms === 'number' ? item.duration_ms : undefined,
        success: typeof item.success === 'boolean' ? item.success : undefined,
        blocked_by_guardrail:
          typeof item.blocked_by_guardrail === 'boolean' ? item.blocked_by_guardrail : undefined,
        agent: typeof item.agent === 'string' ? item.agent : undefined,
        stale: typeof item.stale === 'boolean' ? item.stale : undefined,
        id_validation: item.id_validation === 'strict' || item.id_validation === 'fallback' ? item.id_validation : undefined,
      }));
  } catch {
    return null;
  }
}

function byTimestampDesc(a: RecentIndexEntry, b: RecentIndexEntry): number {
  return b.timestamp.localeCompare(a.timestamp);
}

export async function appendToRecentIndex(entry: RecentIndexEntry): Promise<void> {
  await ensureIndexDir();

  const current = (await readIndexFile()) || [];
  const maxItems = getMaxItemsFromEnv();

  const next = [entry, ...current].sort(byTimestampDesc).slice(0, maxItems);
  await atomicWriteJson(getIndexPath(), next);
}

export async function readRecentIndex(limit: number): Promise<RecentIndexEntry[]> {
  const entries = await readIndexFile();
  if (!entries) {
    return [];
  }

  return entries.sort(byTimestampDesc).slice(0, Math.max(1, limit));
}

export async function rebuildRecentIndexFromLogs(options: { maxItems: number }): Promise<void> {
  const logsRoot = getLogsDir();
  const maxItems = Math.max(1, options.maxItems || getMaxItemsFromEnv());

  let idDirs: string[] = [];
  try {
    const dirEntries = await readdir(logsRoot, { withFileTypes: true });
    idDirs = dirEntries.filter((entry) => entry.isDirectory()).map((entry) => entry.name);
  } catch {
    return;
  }

  const filesById = await Promise.all(
    idDirs.map(async (id) => {
      const validation = validateWorkItemId(id);
      if (!validation.ok) return [] as { id: string; file: string }[];

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

  const allFiles = filesById.flat().sort((a, b) => b.file.localeCompare(a.file)).slice(0, maxItems);

  const collected = await Promise.all(
    allFiles.map(async ({ id, file }): Promise<RecentIndexEntry | null> => {
      try {
        const content = await readFile(safeResolve(logsRoot, id, file), 'utf-8');
        const parsed = JSON.parse(content) as Record<string, unknown>;
        const timestamp =
          (typeof parsed.finished_at === 'string' && parsed.finished_at) ||
          (typeof parsed.timestamp === 'string' && parsed.timestamp) ||
          (typeof parsed.started_at === 'string' && parsed.started_at) ||
          '';
        if (!timestamp) return null;

        const idValidation = validateWorkItemId(id);

        return {
          id,
          action: typeof parsed.action === 'string' ? parsed.action : 'unknown',
          timestamp,
          duration_ms: typeof parsed.duration_ms === 'number' ? parsed.duration_ms : undefined,
          success: typeof parsed.success === 'boolean' ? parsed.success : undefined,
          blocked_by_guardrail:
            typeof parsed.blocked_by_guardrail === 'boolean' ? parsed.blocked_by_guardrail : undefined,
          agent: typeof parsed.agent === 'string' ? parsed.agent : 'mission-control',
          stale: typeof parsed.stale === 'boolean' ? parsed.stale : false,
          id_validation:
            parsed.id_validation === 'strict' || parsed.id_validation === 'fallback'
              ? parsed.id_validation
              : idValidation.ok
                ? idValidation.mode
                : undefined,
        };
      } catch {
        return null;
      }
    })
  );

  const entries = collected.filter((entry): entry is RecentIndexEntry => Boolean(entry)).sort(byTimestampDesc).slice(0, maxItems);

  await ensureIndexDir();
  await atomicWriteJson(getIndexPath(), entries);
}
