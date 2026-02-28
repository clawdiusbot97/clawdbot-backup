import { NextRequest, NextResponse } from 'next/server';
import { stat } from 'fs/promises';
import { safeResolve, validateWorkItemId } from '@/server/validate';

interface ReportFile {
  name: string;
  exists: boolean;
  size: number;
  modified_at: string;
}

interface ReportsData {
  id: string;
  reports_dir: string;
  files: ReportFile[];
  id_validation?: 'strict' | 'fallback';
}

interface ApiResponse {
  success: boolean;
  action: string;
  id: string;
  message: string;
  stdout: string;
  stderr: string;
  blocked_by_guardrail: boolean;
  data?: ReportsData;
}

const REPORT_NAMES = ['clarification.md', 'tech.md', 'cost.md', 'product.md', 'arch.md'];

/**
 * GET /api/reports?id=<ID>
 * Returns list of report files for a workitem if they exist
 */
export async function GET(request: NextRequest): Promise<NextResponse> {
  const { searchParams } = new URL(request.url);
  const rawId = searchParams.get('id');

  if (!rawId) {
    return NextResponse.json(
      {
        success: false,
        action: 'reports_get',
        id: 'N/A',
        message: 'Missing required parameter: id',
        stdout: '',
        stderr: 'Missing required parameter: id',
        blocked_by_guardrail: false,
      } as ApiResponse,
      { status: 400 }
    );
  }

  const validation = validateWorkItemId(rawId);
  if (!validation.ok) {
    return NextResponse.json(
      {
        success: false,
        action: 'reports_get',
        id: rawId,
        message: `Invalid id: ${validation.reason}`,
        stdout: '',
        stderr: validation.reason,
        blocked_by_guardrail: true,
      } as ApiResponse,
      { status: 400 }
    );
  }

  try {
    const brokiaRoot = process.env.BROKIA_ROOT || '.';
    const reportsRoot = safeResolve(brokiaRoot, 'brokia', 'workitems', 'reports');
    const reportsDir = safeResolve(reportsRoot, validation.id);

    const files: ReportFile[] = [];

    for (const name of REPORT_NAMES) {
      const filePath = safeResolve(reportsDir, name);
      try {
        const fileStat = await stat(filePath);
        files.push({
          name,
          exists: true,
          size: fileStat.size,
          modified_at: fileStat.mtime.toISOString(),
        });
      } catch {
        files.push({
          name,
          exists: false,
          size: 0,
          modified_at: '',
        });
      }
    }

    const response: ApiResponse = {
      success: true,
      action: 'reports_get',
      id: validation.id,
      message: `Reports listed for ${validation.id}`,
      stdout: '',
      stderr: '',
      blocked_by_guardrail: false,
      data: {
        id: validation.id,
        reports_dir: reportsDir,
        files,
        id_validation: validation.mode,
      },
    };

    return NextResponse.json(response);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      {
        success: false,
        action: 'reports_get',
        id: validation.id,
        message: `Failed to list reports: ${errorMessage}`,
        stdout: '',
        stderr: errorMessage,
        blocked_by_guardrail: false,
      } as ApiResponse,
      { status: 500 }
    );
  }
}
