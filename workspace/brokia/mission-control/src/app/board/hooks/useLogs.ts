'use client';

import { useCallback, useState } from 'react';
import { ItemLogsData, RunningState, StandardResponse, WorkItem } from '@/types/workitem';

type LogsResponse = StandardResponse<ItemLogsData | null>;
type RecentLogsResponse = StandardResponse<{ logs: RecentLogEntry[] } | null>;

interface RecentLogEntry {
  id: string;
  running?: boolean;
  stale?: boolean;
  runState?: Partial<RunningState> | null;
  action?: string;
  agent?: string;
  started_at?: string;
  status_target?: string;
  pid?: number;
  heartbeat_at?: string;
}

interface UseLogsResult {
  itemLogs: ItemLogsData | null;
  runningById: Record<string, RunningState | undefined>;
  logsLoading: boolean;
  logsError: string | null;
  fetchItemLogs: (id: string) => Promise<void>;
  fetchRunningStates: (items: WorkItem[]) => Promise<void>;
  clearSelectedItemLogs: () => void;
}

function parseApiError(error: unknown): string {
  return error instanceof Error ? error.message : 'Unknown error';
}

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function parseRunState(entry: RecentLogEntry | undefined): RunningState | undefined {
  if (!entry || entry.stale) return undefined;

  if (isObject(entry.runState)) {
    const runState = entry.runState as Partial<RunningState>;
    const id = typeof runState.id === 'string' && runState.id ? runState.id : entry.id;
    const action =
      typeof runState.action === 'string' && runState.action
        ? runState.action
        : typeof entry.action === 'string' && entry.action
          ? entry.action
          : 'unknown';
    const agent =
      typeof runState.agent === 'string' && runState.agent
        ? runState.agent
        : typeof entry.agent === 'string' && entry.agent
          ? entry.agent
          : 'mission-control';
    const startedAt =
      typeof runState.started_at === 'string' && runState.started_at
        ? runState.started_at
        : typeof entry.started_at === 'string' && entry.started_at
          ? entry.started_at
          : '';

    if (!startedAt) return undefined;

    return {
      id,
      action,
      agent,
      started_at: startedAt,
      status_target:
        typeof runState.status_target === 'string' ? runState.status_target : entry.status_target,
      pid: typeof runState.pid === 'number' ? runState.pid : entry.pid,
      heartbeat_at:
        typeof runState.heartbeat_at === 'string' ? runState.heartbeat_at : entry.heartbeat_at,
    };
  }

  if (entry.running === true) {
    if (!entry.started_at) return undefined;
    return {
      id: entry.id,
      action: entry.action || 'unknown',
      agent: entry.agent || 'mission-control',
      started_at: entry.started_at,
      status_target: entry.status_target,
      pid: entry.pid,
      heartbeat_at: entry.heartbeat_at,
    };
  }

  return undefined;
}

export function useLogs(): UseLogsResult {
  const [itemLogs, setItemLogs] = useState<ItemLogsData | null>(null);
  const [runningById, setRunningById] = useState<Record<string, RunningState | undefined>>({});
  const [logsLoading, setLogsLoading] = useState(false);
  const [logsError, setLogsError] = useState<string | null>(null);

  const fetchItemLogs = useCallback(async (id: string) => {
    setLogsLoading(true);
    setLogsError(null);

    try {
      const response = await fetch(`/api/logs?id=${encodeURIComponent(id)}&limit=30`);
      const result: LogsResponse = await response.json();

      const logsData = result.data;
      if (result.success && logsData) {
        setItemLogs(logsData);
        setRunningById((prev) => {
          const next = { ...prev };
          if (logsData.runState) next[id] = logsData.runState;
          else delete next[id];
          return next;
        });
      } else {
        setItemLogs({ running: false, runState: undefined, logs: [] });
        setRunningById((prev) => {
          const next = { ...prev };
          delete next[id];
          return next;
        });
      }
    } catch (error) {
      setLogsError(parseApiError(error));
      setItemLogs({ running: false, runState: undefined, logs: [] });
      setRunningById((prev) => {
        const next = { ...prev };
        delete next[id];
        return next;
      });
    } finally {
      setLogsLoading(false);
    }
  }, []);

  const fetchRunningStates = useCallback(async (items: WorkItem[]) => {
    if (!items.length) {
      setRunningById({});
      return;
    }

    const fallbackNPlusOne = async () => {
      const responses = await Promise.all(
        items.map(async (item) => {
          const response = await fetch(`/api/logs?id=${encodeURIComponent(item.id)}&limit=1`);
          const result: LogsResponse = await response.json();
          return {
            id: item.id,
            runState: result.success && result.data?.running ? result.data.runState : undefined,
          };
        })
      );

      const nextState: Record<string, RunningState | undefined> = {};
      for (const entry of responses) {
        nextState[entry.id] = entry.runState;
      }
      setRunningById(nextState);
    };

    try {
      const response = await fetch('/api/logs/recent?limit=100');
      const result: RecentLogsResponse = await response.json();

      if (!result.success || !result.data?.logs) {
        await fallbackNPlusOne();
        return;
      }

      const itemIds = new Set(items.map((item) => item.id));
      const latestById = new Map<string, RecentLogEntry>();

      for (const entry of result.data.logs) {
        if (!itemIds.has(entry.id) || latestById.has(entry.id)) continue;
        latestById.set(entry.id, entry);
      }

      const nextState: Record<string, RunningState | undefined> = {};
      for (const item of items) {
        nextState[item.id] = parseRunState(latestById.get(item.id));
      }
      setRunningById(nextState);
    } catch (error) {
      setLogsError(parseApiError(error));
      try {
        await fallbackNPlusOne();
      } catch {
        setRunningById({});
      }
    }
  }, []);

  const clearSelectedItemLogs = useCallback(() => {
    setItemLogs(null);
  }, []);

  return {
    itemLogs,
    runningById,
    logsLoading,
    logsError,
    fetchItemLogs,
    fetchRunningStates,
    clearSelectedItemLogs,
  };
}

