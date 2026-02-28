import { readFile } from 'fs/promises';
import { resolve } from 'path';
import { runScript, ScriptResult } from '@/server/runScript';
import { WorkItemsData } from '@/types/workitem';

export interface StandardApiResponse<T = unknown> {
  success: boolean;
  action: string;
  id?: string;
  message: string;
  stdout: string;
  stderr: string;
  blocked_by_guardrail: boolean;
  data?: T;
}

const DEFAULT_BROKIA_ROOT = '.';
const DEFAULT_EXPORT_PATH = 'brokia/workitems/index/workitems.json';

export function getBrokiaRoot(): string {
  return process.env.BROKIA_ROOT || DEFAULT_BROKIA_ROOT;
}

export function getExportPath(): string {
  return process.env.EXPORT_PATH || DEFAULT_EXPORT_PATH;
}

export function resolveFromBrokiaRoot(...segments: string[]): string {
  return resolve(process.cwd(), getBrokiaRoot(), ...segments);
}

export async function readExportData(): Promise<WorkItemsData> {
  const exportFilePath = resolveFromBrokiaRoot(getExportPath());
  const content = await readFile(exportFilePath, 'utf-8');
  return JSON.parse(content) as WorkItemsData;
}

export async function runExport(action = 'refresh', id = 'SYSTEM'): Promise<ScriptResult> {
  return runScript('wi-export.sh', ['--out', getExportPath()], {
    cwd: getBrokiaRoot(),
    action,
    id,
  });
}

export async function runExportAndRead(action = 'refresh', id = 'SYSTEM'): Promise<{
  exportResult: ScriptResult;
  data: WorkItemsData | null;
}> {
  const exportResult = await runExport(action, id);

  if (!exportResult.success) {
    return {
      exportResult,
      data: null,
    };
  }

  const data = await readExportData();

  return {
    exportResult,
    data,
  };
}

export function combineStdStreams(results: ScriptResult[]): { stdout: string; stderr: string } {
  return {
    stdout: results
      .map((result) => result.stdout)
      .filter(Boolean)
      .join('\n'),
    stderr: results
      .map((result) => result.stderr)
      .filter(Boolean)
      .join('\n'),
  };
}

export function extractWorkitemIdFromText(text: string): string | null {
  const match = text.match(/\b([A-Z]+-\d{8}-\d{3})\b/);
  return match?.[1] || null;
}

export function fixtureMutationBlocked(action: string): StandardApiResponse<null> {
  return {
    success: false,
    action,
    id: 'SYSTEM',
    message: `Mutation '${action}' is disabled while USE_FIXTURES=true`,
    stdout: '',
    stderr: 'USE_FIXTURES=true',
    blocked_by_guardrail: true,
    data: null,
  };
}
