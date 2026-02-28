import { NextRequest, NextResponse } from 'next/server';
import { getRecentLogs } from '@/server/logs';
import { StandardApiResponse } from '@/server/workitems';

interface RecentLogsData {
  logs: Awaited<ReturnType<typeof getRecentLogs>>;
}

export async function GET(request: NextRequest): Promise<NextResponse<StandardApiResponse<RecentLogsData | null>>> {
  try {
    const limitParam = request.nextUrl.searchParams.get('limit');
    const parsedLimit = limitParam ? Number.parseInt(limitParam, 10) : 50;
    const limit = Number.isFinite(parsedLimit) ? Math.max(1, parsedLimit) : 50;

    const logs = await getRecentLogs(limit);

    return NextResponse.json({
      success: true,
      action: 'logs_recent',
      id: 'SYSTEM',
      message: `Loaded ${logs.length} recent log entries`,
      stdout: '',
      stderr: '',
      blocked_by_guardrail: false,
      data: { logs },
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';

    return NextResponse.json(
      {
        success: false,
        action: 'logs_recent',
        id: 'SYSTEM',
        message: `Failed to load recent logs: ${errorMessage}`,
        stdout: '',
        stderr: errorMessage,
        blocked_by_guardrail: false,
        data: null,
      },
      { status: 500 }
    );
  }
}
