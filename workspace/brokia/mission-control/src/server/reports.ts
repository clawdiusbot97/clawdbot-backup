import { readdir } from 'fs/promises';
import { safeResolve, validateWorkItemId } from './validate';

const DEFAULT_REPORTS_DIR = 'brokia/mission-control/reports';

function getReportsDir(): string {
  return process.env.REPORTS_DIR || DEFAULT_REPORTS_DIR;
}

export async function checkReportExists(id: string, reportType: string): Promise<boolean> {
  const validation = validateWorkItemId(id);
  if (!validation.ok) return false;

  const itemDir = safeResolve(getReportsDir(), validation.id);
  try {
    const files = await readdir(itemDir);
    return files.some((file) => file.toLowerCase().includes(reportType.toLowerCase()));
  } catch {
    return false;
  }
}
