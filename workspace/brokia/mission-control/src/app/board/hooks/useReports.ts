'use client';

import { useCallback, useState } from 'react';
import { StandardResponse } from '@/types/workitem';

export interface ReportFile {
  name: string;
  exists: boolean;
  size: number;
  modified_at: string;
}

export interface ReportsData {
  id: string;
  reports_dir: string;
  files: ReportFile[];
  id_validation?: 'strict' | 'fallback';
}

type ReportsResponse = StandardResponse<ReportsData | null>;
type ReportViewData = { id: string; name: string; content: string; path: string; id_validation?: 'strict' | 'fallback' };
type ReportViewResponse = StandardResponse<ReportViewData | null>;

function parseApiError(error: unknown): string {
  return error instanceof Error ? error.message : 'Unknown error';
}

interface UseReportsResult {
  reports: ReportFile[];
  reportsLoading: boolean;
  reportLoadingName: string | null;
  openReport: { name: string; content: string; path: string } | null;
  fetchReports: (id: string) => Promise<void>;
  loadReport: (id: string, name: string) => Promise<ReportViewData | null>;
  clearReports: () => void;
  closeReport: () => void;
}

export function useReports(): UseReportsResult {
  const [reports, setReports] = useState<ReportFile[]>([]);
  const [reportsLoading, setReportsLoading] = useState(false);
  const [reportLoadingName, setReportLoadingName] = useState<string | null>(null);
  const [openReport, setOpenReport] = useState<{ name: string; content: string; path: string } | null>(null);

  const fetchReports = useCallback(async (id: string) => {
    setReportsLoading(true);
    try {
      const response = await fetch(`/api/reports?id=${encodeURIComponent(id)}`);
      const result: ReportsResponse = await response.json();
      if (result.success && result.data) {
        setReports(result.data.files.filter((file) => file.exists));
      } else {
        setReports([]);
      }
    } catch {
      setReports([]);
    } finally {
      setReportsLoading(false);
    }
  }, []);

  const loadReport = useCallback(async (id: string, name: string): Promise<ReportViewData | null> => {
    setReportLoadingName(name);
    try {
      const response = await fetch(
        `/api/reports/view?id=${encodeURIComponent(id)}&name=${encodeURIComponent(name)}`
      );
      const result: ReportViewResponse = await response.json();
      if (result.success && result.data) {
        setOpenReport({ name: result.data.name, content: result.data.content, path: result.data.path });
        return result.data;
      }
      return null;
    } catch (error) {
      throw new Error(parseApiError(error));
    } finally {
      setReportLoadingName(null);
    }
  }, []);

  const clearReports = useCallback(() => {
    setReports([]);
    setOpenReport(null);
  }, []);

  const closeReport = useCallback(() => {
    setOpenReport(null);
  }, []);

  return {
    reports,
    reportsLoading,
    reportLoadingName,
    openReport,
    fetchReports,
    loadReport,
    clearReports,
    closeReport,
  };
}
