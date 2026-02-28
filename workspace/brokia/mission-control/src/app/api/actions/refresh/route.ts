import { NextResponse } from 'next/server';
import { runExportAndRead, StandardApiResponse } from '@/server/workitems';
import { WorkItemsData } from '@/types/workitem';

export async function POST(): Promise<NextResponse<StandardApiResponse<WorkItemsData | null>>> {
  try {
    const { exportResult, data } = await runExportAndRead('refresh', 'SYSTEM');

    if (!exportResult.success) {
      return NextResponse.json(
        {
          success: false,
          action: 'refresh',
          id: exportResult.id || 'SYSTEM',
          message: exportResult.message,
          stdout: exportResult.stdout,
          stderr: exportResult.stderr,
          blocked_by_guardrail: exportResult.blocked_by_guardrail,
          data: null,
        },
        { status: exportResult.blocked_by_guardrail ? 200 : 500 }
      );
    }

    return NextResponse.json({
      success: true,
      action: 'refresh',
      id: exportResult.id || 'SYSTEM',
      message: 'Workitems export refreshed successfully',
      stdout: exportResult.stdout,
      stderr: exportResult.stderr,
      blocked_by_guardrail: false,
      data,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      {
        success: false,
        action: 'refresh',
        id: 'SYSTEM',
        message: `Refresh failed: ${errorMessage}`,
        stdout: '',
        stderr: errorMessage,
        blocked_by_guardrail: false,
        data: null,
      },
      { status: 500 }
    );
  }
}
