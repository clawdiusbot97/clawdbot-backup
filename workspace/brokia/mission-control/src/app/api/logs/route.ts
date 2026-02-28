import { NextRequest, NextResponse } from 'next/server';
import { getWorkitemLogs } from '@/server/logs';
import { validateWorkItemId } from '@/server/validate';
import { StandardApiResponse } from '@/server/workitems';

interface LogsData {
  running: boolean;
  runState?: Awaited<ReturnType<typeof getWorkitemLogs>>['runState'];
  logs: Awaited<ReturnType<typeof getWorkitemLogs>>['logs'];
  id_validation?: 'strict' | 'fallback';
}

export async function GET(request: NextRequest): Promise<NextResponse<StandardApiResponse<LogsData | null>>> {
  try {
    const rawId = request.nextUrl.searchParams.get('id')?.trim();
    const limitParam = request.nextUrl.searchParams.get('limit');
    const limit = limitParam ? Number.parseInt(limitParam, 10) : 20;

    if (!rawId) {
      return NextResponse.json(
        {
          success: false,
          action: 'logs_get',
          id: 'SYSTEM',
          message: 'Missing required query parameter: id',
          stdout: '',
          stderr: 'Validation error',
          blocked_by_guardrail: false,
          data: null,
        },
        { status: 400 }
      );
    }

    const validation = validateWorkItemId(rawId);
    if (!validation.ok) {
      return NextResponse.json(
        {
          success: false,
          action: 'logs_get',
          id: rawId,
          message: `Invalid id: ${validation.reason}`,
          stdout: '',
          stderr: validation.reason,
          blocked_by_guardrail: true,
          data: null,
        },
        { status: 400 }
      );
    }

    const { running, runState, logs } = await getWorkitemLogs(validation.id, Number.isFinite(limit) ? Math.max(1, limit) : 20);

    return NextResponse.json({
      success: true,
      action: 'logs_get',
      id: validation.id,
      message: `Logs loaded for ${validation.id}`,
      stdout: '',
      stderr: '',
      blocked_by_guardrail: false,
      data: {
        running,
        runState,
        logs,
        id_validation: validation.mode,
      },
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';

    return NextResponse.json(
      {
        success: false,
        action: 'logs_get',
        id: 'SYSTEM',
        message: `Failed to load logs: ${errorMessage}`,
        stdout: '',
        stderr: errorMessage,
        blocked_by_guardrail: false,
        data: null,
      },
      { status: 500 }
    );
  }
}
