import { NextRequest, NextResponse } from 'next/server';
import { validateWorkItemId } from '@/server/validate';
import type { StandardApiResponse } from '@/server/workitems';
import type { WorkItemsData } from '@/types/workitem';
import { isRunning } from '@/server/runs';

interface ResearchBody { id?: string; }

export async function POST(
  request: NextRequest
): Promise<NextResponse<StandardApiResponse<WorkItemsData | { id_validation: 'strict' | 'fallback' } | null>>> {
  let id = 'SYSTEM';
  let idValidationMode: 'strict' | 'fallback' | undefined;

  try {
    const body = (await request.json()) as ResearchBody;
    const rawId = body.id?.trim();

    if (rawId) {
      const validation = validateWorkItemId(rawId);
      if (!validation.ok) {
        return NextResponse.json({ success: false, action: 'workitem_research', id: rawId, message: `Invalid id: ${validation.reason}`, stdout: '', stderr: validation.reason, blocked_by_guardrail: true, data: null }, { status: 400 });
      }

      id = validation.id;
      idValidationMode = validation.mode;

      const runCheck = await isRunning(validation.id);
      if (runCheck.running) {
        return NextResponse.json({
          success: false,
          action: 'workitem_research',
          id: validation.id,
          message: `Blocked: item is currently being processed (${runCheck.runState?.action})`,
          stdout: '',
          stderr: 'Guardrail: item running',
          blocked_by_guardrail: true,
          data: null,
        }, { status: 200 });
      }
    }
  } catch {
    // ignore parse error, use default id
  }

  return NextResponse.json({
    success: true,
    action: 'workitem_research',
    id,
    message: 'OUT OF SCOPE (v1): research endpoint disabled. Use engine CLI for now.',
    stdout: '',
    stderr: 'Research automation from UI is planned for v1.4. Use: brokia/workitems/scripts/wi-pipeline.sh --step research --id <ID>',
    blocked_by_guardrail: true,
    ...(idValidationMode ? { data: { id_validation: idValidationMode } } : { data: null }),
  }, { status: 200 });
}
