import { NextRequest, NextResponse } from 'next/server';
import { executeActionWithExport, ScriptCall } from '@/server/actionsApi';
import { validateWorkItemId } from '@/server/validate';
import { fixtureMutationBlocked, StandardApiResponse } from '@/server/workitems';
import { WorkItemsData } from '@/types/workitem';
import { isRunning } from '@/server/runs';

interface DropBody { id?: string; reason?: string; }

function buildDropReasonNote(reason: string): string {
  const timestamp = new Date().toISOString();
  const singleLineReason = reason.replace(/\s+/g, ' ').trim();
  return `Dropped at ${timestamp}: ${singleLineReason}`;
}

export async function POST(request: NextRequest): Promise<NextResponse<StandardApiResponse<WorkItemsData | null>>> {
  if (process.env.USE_FIXTURES === 'true') return NextResponse.json(fixtureMutationBlocked('drop'), { status: 403 });

  try {
    const body = (await request.json()) as DropBody;
    const rawId = body.id?.trim();
    const reason = body.reason?.trim();

    if (!rawId) return NextResponse.json({ success: false, action: 'drop', id: 'SYSTEM', message: 'Missing required field: id', stdout: '', stderr: 'Validation error', blocked_by_guardrail: false, data: null }, { status: 400 });

    const validation = validateWorkItemId(rawId);
    if (!validation.ok) return NextResponse.json({ success: false, action: 'drop', id: rawId, message: `Invalid id: ${validation.reason}`, stdout: '', stderr: validation.reason, blocked_by_guardrail: true, data: null }, { status: 400 });

    const runCheck = await isRunning(validation.id);
    if (runCheck.running) {
      return NextResponse.json({ success: false, action: 'drop', id: validation.id, message: `Blocked: item is currently being processed (${runCheck.runState?.action})`, stdout: '', stderr: 'Guardrail: item running', blocked_by_guardrail: true, data: null }, { status: 200 });
    }

    const calls: ScriptCall[] = [{ scriptName: 'wi-move.sh', args: ['--id', validation.id, '--to', 'DROPPED'], action: 'drop_move', id: validation.id }];
    if (reason) calls.push({ scriptName: 'wi-update.sh', args: ['--id', validation.id, '--append-link', buildDropReasonNote(reason)], action: 'drop_note', id: validation.id });

    const response = await executeActionWithExport({ action: 'drop', fallbackId: validation.id, calls, successMessage: `Workitem ${validation.id} dropped successfully` });

    if (response.data) response.data = { ...(response.data as object), id_validation: validation.mode } as WorkItemsData;
    return NextResponse.json(response, { status: response.success ? 200 : response.blocked_by_guardrail ? 200 : 500 });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ success: false, action: 'drop', id: 'SYSTEM', message: `Drop failed: ${errorMessage}`, stdout: '', stderr: errorMessage, blocked_by_guardrail: false, data: null }, { status: 500 });
  }
}
