'use client';

import { useCallback, useState } from 'react';
import { ApiResponse, WorkItemsData } from '@/types/workitem';

function parseApiError(error: unknown): string {
  return error instanceof Error ? error.message : 'Unknown error';
}

interface UseWorkitemsResult {
  data: WorkItemsData | null;
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  replaceData: (nextData: WorkItemsData | null) => void;
}

export function useWorkitems(): UseWorkitemsResult {
  const [data, setData] = useState<WorkItemsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/workitems');
      const result: ApiResponse = await response.json();

      if (result.success && result.data) {
        setData(result.data);
      } else {
        setError(result.message || 'Failed to load workitems');
      }
    } catch (err) {
      setError(parseApiError(err));
    } finally {
      setLoading(false);
    }
  }, []);

  const replaceData = useCallback((nextData: WorkItemsData | null) => {
    setData(nextData);
  }, []);

  return {
    data,
    loading,
    error,
    refresh,
    replaceData,
  };
}

