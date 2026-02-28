'use client';

import { useCallback, useState } from 'react';
import { StandardResponse, WorkItemsData } from '@/types/workitem';

export type ActionResponse = StandardResponse<WorkItemsData | null>;

type Notice = {
  kind: 'success' | 'error';
  text: string;
} | null;

interface UseActionsOptions {
  selectedItemId: string | null;
  onSuccess?: (data: WorkItemsData, action: string, response: ActionResponse) => void | Promise<void>;
}

function parseApiError(error: unknown): string {
  return error instanceof Error ? error.message : 'Unknown error';
}

export function useActions({ selectedItemId, onSuccess }: UseActionsOptions) {
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [notice, setNotice] = useState<Notice>(null);

  const performAction = useCallback(
    async (label: string, endpoint: string, payload: Record<string, unknown>): Promise<ActionResponse | null> => {
      setActionLoading(label);
      setNotice(null);

      try {
        const response = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });

        const result: ActionResponse = await response.json();

        if (result.success && result.data) {
          setNotice({ kind: 'success', text: result.message || `${label} completed` });
          if (onSuccess) {
            await onSuccess(result.data, label, result);
          }
        } else {
          const blocked = result?.blocked_by_guardrail ? ' (blocked by guardrail)' : '';
          setNotice({ kind: 'error', text: `${result.message || `${label} failed`}${blocked}` });
        }

        return result;
      } catch (error) {
        setNotice({ kind: 'error', text: parseApiError(error) });
        return null;
      } finally {
        setActionLoading(null);
      }
    },
    [onSuccess]
  );

  const create = useCallback(
    (payload: { type: string; title: string; priority: string }) =>
      performAction('create', '/api/actions/create', payload),
    [performAction]
  );

  const clarify = useCallback(
    (id: string) => performAction('clarify', '/api/actions/clarify', { id }),
    [performAction]
  );

  const research = useCallback(
    (id: string) => performAction('research', '/api/actions/research', { id }),
    [performAction]
  );

  const confirm = useCallback(
    (id: string, plan: 'A' | 'B' | 'C') => performAction('confirm', '/api/actions/confirm', { id, plan }),
    [performAction]
  );

  const move = useCallback(
    (id: string, to: string) => performAction('move', '/api/actions/move', { id, to }),
    [performAction]
  );

  const drop = useCallback(
    (id: string, reason?: string) => performAction('drop', '/api/actions/drop', { id, reason }),
    [performAction]
  );

  const update = useCallback(
    (id: string, patch: Record<string, string | number>) =>
      performAction('update', '/api/actions/update', { id, patch }),
    [performAction]
  );

  const refresh = useCallback(() => performAction('refresh', '/api/actions/refresh', {}), [performAction]);

  const refreshBoard = useCallback(() => refresh(), [refresh]);

  return {
    actionLoading,
    notice,
    setNotice,
    selectedItemId,
    performAction,
    refreshBoard,
    create,
    clarify,
    research,
    confirm,
    move,
    drop,
    update,
    refresh,
  };
}
