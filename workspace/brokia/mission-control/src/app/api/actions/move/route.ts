import { NextRequest, NextResponse } from 'next/server';
import { executeActionWithExport } from '@/server/actionsApi';
import { validateWorkItemId } from '@/server/validate';
import { fixtureMutationBlocked, StandardApiResponse } from '@/server/workitems';
import { WorkItemsData } from '@/types/workitem';
import { isRunning } from '@/server/runs';

interface MoveBody { id?: string; to?: string; }
const VALID_STATES = ['NEW', 'RESEARCHING', 'RESEARCHED', 'DECIDED', 'PLANNED', 'BUILDING', 'DONE', 'DROPPED'];

export async function POST(request: NextRequest): Promise<NextResponse<StandardApiResponse<WorkItemsData | null>>> {
  if (process.env.USE_FIXTURES === 'true') return NextResponse.json(fixtureMutationBlocked('move'), { status: 403 });

  try {
    const body = (await request.json()) as MoveBody;
    const rawId = body.id?.trim();
    const to = body.to?.trim().toUpperCase();

    if (!rawId || !to) return NextResponse.json({ success: false, action: 'move', id: rawId || 'SYSTEM', message: 'Missing required fields: id, to', stdout: '', stderr: 'Validation error', blocked_by_guardrail: false, data: null }, { status: 400 });

    const validation = validateWorkItemId(rawId);
    if (!validation.ok) return NextResponse.json({ success: false, action: 'move', id: rawId, message: `Invalid id: ${validation.reason}`, stdout: '', stderr: validation.reason, blocked_by_guardrail: true, data: null }, { status: 400 });

    const runCheck = await isRunning(validation.id);
    if (runCheck.running) {
      return NextResponse.json({ success: false, action: 'move', id: validation.id, message: `Blocked: item is currently being processed (${runCheck.runState?.action})`, stdout: '', stderr: 'Guardrail: item running', blocked_by_guardrail: true, data: null }, { status: 200 });
    }

    if (!VALID_STATES.includes(to)) return NextResponse.json({ success: false, action: 'move', id: validation.id, message: `Invalid target state '${to}'`, stdout: '', stderr: `Valid states: ${VALID_STATES.join(', ')}`, blocked_by_guardrail: false, data: null }, { status: 400 });

    const response = await executeActionWithExport({
      action: 'move', fallbackId: validation.id,
      calls: [{ scriptName: 'wi-move.sh', args: ['--id', validation.id, '--to', to], action: 'move', id: validation.id }],
      successMessage: `Workitem ${validation.id} moved to ${to}`,
    });

    if (response.data) response.data = { ...(response.data as object), id_validation: validation.mode } as WorkItemsData;
    return NextResponse.json(response, { status: response.success ? 200 : response.blocked_by_guardrail ? 200 : 500 });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ success: false, action: 'move', id: 'SYSTEM', message: `Move failed: ${errorMessage}`, stdout: '', stderr: errorMessage, blocked_by_guardrail: false, data: null }, { status: 500 });
  }
}
