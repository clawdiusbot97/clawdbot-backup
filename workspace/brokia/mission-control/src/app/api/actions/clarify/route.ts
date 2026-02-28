import { NextRequest, NextResponse } from 'next/server';
import { executeActionWithExport } from '@/server/actionsApi';
import { validateWorkItemId } from '@/server/validate';
import { fixtureMutationBlocked, StandardApiResponse } from '@/server/workitems';
import { WorkItemsData } from '@/types/workitem';
import { isRunning } from '@/server/runs';
import { checkReportExists } from '@/server/reports';

interface ClarifyBody {
  id?: string;
}

export async function POST(request: NextRequest): Promise<NextResponse<StandardApiResponse<WorkItemsData | null>>> {
  if (process.env.USE_FIXTURES === 'true') {
    return NextResponse.json(fixtureMutationBlocked('clarify'), { status: 403 });
  }

  try {
    const body = (await request.json()) as ClarifyBody;
    const rawId = body.id?.trim();

    if (!rawId) {
      return NextResponse.json({ success: false, action: 'clarify', id: 'SYSTEM', message: 'Missing required field: id', stdout: '', stderr: 'Validation error', blocked_by_guardrail: false, data: null }, { status: 400 });
    }

    const validation = validateWorkItemId(rawId);
    if (!validation.ok) {
      return NextResponse.json({ success: false, action: 'clarify', id: rawId, message: `Invalid id: ${validation.reason}`, stdout: '', stderr: validation.reason, blocked_by_guardrail: true, data: null }, { status: 400 });
    }

    const runCheck = await isRunning(validation.id);
    if (runCheck.running) {
      return NextResponse.json({
        success: false,
        action: 'clarify',
        id: validation.id,
        message: `Blocked: item is currently being processed (${runCheck.runState?.action})`,
        stdout: '',
        stderr: 'Guardrail: item running',
        blocked_by_guardrail: true,
        data: null,
      }, { status: 200 });
    }

    const alreadyClarified =
      (await checkReportExists(validation.id, 'clarification')) ||
      (await checkReportExists(validation.id, 'clarify'));
    if (alreadyClarified) {
      return NextResponse.json({
        success: false,
        action: 'clarify',
        id: validation.id,
        message: 'Item already clarified',
        stdout: '',
        stderr: 'Guardrail: clarification report already exists',
        blocked_by_guardrail: true,
        data: null,
      }, { status: 200 });
    }

    const response = await executeActionWithExport({
      action: 'clarify',
      fallbackId: validation.id,
      calls: [{ scriptName: 'wi-pipeline.sh', args: ['--id', validation.id, '--step', 'clarify'], action: 'clarify', id: validation.id }],
      successMessage: `Clarification step executed for ${validation.id}`,
    });

    if (response.data) {
      response.data = { ...(response.data as object), id_validation: validation.mode } as WorkItemsData;
    }

    return NextResponse.json(response, { status: response.success ? 200 : response.blocked_by_guardrail ? 200 : 500 });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';

    return NextResponse.json({ success: false, action: 'clarify', id: 'SYSTEM', message: `Clarify failed: ${errorMessage}`, stdout: '', stderr: errorMessage, blocked_by_guardrail: false, data: null }, { status: 500 });
  }
}
