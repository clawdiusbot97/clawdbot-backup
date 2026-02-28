import { NextRequest, NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import { safeResolve, validateWorkItemId } from '@/server/validate';

interface ApiResponse {
  success: boolean;
  action: string;
  id: string;
  message: string;
  stdout: string;
  stderr: string;
  blocked_by_guardrail: boolean;
  data?: {
    id: string;
    name: string;
    content: string;
    path: string;
    id_validation?: 'strict' | 'fallback';
  };
}

const ALLOWED_REPORT_NAMES = ['clarification.md', 'tech.md', 'cost.md', 'product.md', 'arch.md'];

/**
 * GET /api/reports/view?id=<ID>&name=<file>
 * Returns the raw content of a report file
 */
export async function GET(request: NextRequest): Promise<NextResponse> {
  const { searchParams } = new URL(request.url);
  const rawId = searchParams.get('id');
  const name = searchParams.get('name');

  if (!rawId) {
    return NextResponse.json(
      {
        success: false,
        action: 'reports_view',
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
        action: 'reports_view',
        id: rawId,
        message: `Invalid id: ${validation.reason}`,
        stdout: '',
        stderr: validation.reason,
        blocked_by_guardrail: true,
      } as ApiResponse,
      { status: 400 }
    );
  }

  if (!name) {
    return NextResponse.json(
      {
        success: false,
        action: 'reports_view',
        id: validation.id,
        message: 'Missing required parameter: name',
        stdout: '',
        stderr: 'Missing required parameter: name',
        blocked_by_guardrail: false,
      } as ApiResponse,
      { status: 400 }
    );
  }

  if (!ALLOWED_REPORT_NAMES.includes(name)) {
    return NextResponse.json(
      {
        success: false,
        action: 'reports_view',
        id: validation.id,
        message: `Invalid report name: ${name}`,
        stdout: '',
        stderr: `Allowed names: ${ALLOWED_REPORT_NAMES.join(', ')}`,
        blocked_by_guardrail: false,
      } as ApiResponse,
      { status: 400 }
    );
  }

  try {
    const brokiaRoot = process.env.BROKIA_ROOT || '.';
    const reportsRoot = safeResolve(brokiaRoot, 'brokia', 'workitems', 'reports');
    const filePath = safeResolve(reportsRoot, validation.id, name);
    const content = await readFile(filePath, 'utf-8');

    const response: ApiResponse = {
      success: true,
      action: 'reports_view',
      id: validation.id,
      message: `Report ${name} loaded for ${validation.id}`,
      stdout: '',
      stderr: '',
      blocked_by_guardrail: false,
      data: {
        id: validation.id,
        name,
        content,
        path: filePath,
        id_validation: validation.mode,
      },
    };

    return NextResponse.json(response);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      {
        success: false,
        action: 'reports_view',
        id: validation.id,
        message: `Failed to load report: ${errorMessage}`,
        stdout: '',
        stderr: errorMessage,
        blocked_by_guardrail: false,
      } as ApiResponse,
      { status: 500 }
    );
  }
}
