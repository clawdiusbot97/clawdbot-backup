import { NextRequest, NextResponse } from 'next/server';
import { executeActionWithExport } from '@/server/actionsApi';
import { validateWorkItemId } from '@/server/validate';
import { fixtureMutationBlocked, StandardApiResponse } from '@/server/workitems';
import { WorkItemsData } from '@/types/workitem';
import { isRunning } from '@/server/runs';

interface ConfirmBody { id?: string; plan?: 'A' | 'B' | 'C' | string; }
const VALID_PLANS = ['A', 'B', 'C'];

export async function POST(request: NextRequest): Promise<NextResponse<StandardApiResponse<WorkItemsData | null>>> {
  if (process.env.USE_FIXTURES === 'true') return NextResponse.json(fixtureMutationBlocked('confirm'), { status: 403 });

  try {
    const body = (await request.json()) as ConfirmBody;
    const rawId = body.id?.trim();
    const plan = body.plan?.trim().toUpperCase();

    if (!rawId || !plan) return NextResponse.json({ success: false, action: 'confirm', id: rawId || 'SYSTEM', message: 'Missing required fields: id, plan', stdout: '', stderr: 'Validation error', blocked_by_guardrail: false, data: null }, { status: 400 });

    const validation = validateWorkItemId(rawId);
    if (!validation.ok) return NextResponse.json({ success: false, action: 'confirm', id: rawId, message: `Invalid id: ${validation.reason}`, stdout: '', stderr: validation.reason, blocked_by_guardrail: true, data: null }, { status: 400 });

    const runCheck = await isRunning(validation.id);
    if (runCheck.running) {
      return NextResponse.json({ success: false, action: 'confirm', id: validation.id, message: `Blocked: item is currently being processed (${runCheck.runState?.action})`, stdout: '', stderr: 'Guardrail: item running', blocked_by_guardrail: true, data: null }, { status: 200 });
    }

    if (!VALID_PLANS.includes(plan)) return NextResponse.json({ success: false, action: 'confirm', id: validation.id, message: `Invalid plan '${plan}'`, stdout: '', stderr: `Valid plans: ${VALID_PLANS.join(', ')}`, blocked_by_guardrail: false, data: null }, { status: 400 });

    const response = await executeActionWithExport({
      action: 'confirm', fallbackId: validation.id,
      calls: [{ scriptName: 'wi-confirm.sh', args: ['--id', validation.id, '--plan', plan], action: 'confirm', id: validation.id }],
      successMessage: `Plan ${plan} confirmed for ${validation.id}`,
    });

    if (response.data) response.data = { ...(response.data as object), id_validation: validation.mode } as WorkItemsData;
    return NextResponse.json(response, { status: response.success ? 200 : response.blocked_by_guardrail ? 200 : 500 });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ success: false, action: 'confirm', id: 'SYSTEM', message: `Confirm failed: ${errorMessage}`, stdout: '', stderr: errorMessage, blocked_by_guardrail: false, data: null }, { status: 500 });
  }
}
