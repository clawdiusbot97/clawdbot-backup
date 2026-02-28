import { NextRequest, NextResponse } from 'next/server';
import { executeActionWithExport } from '@/server/actionsApi';
import { validateWorkItemId } from '@/server/validate';
import { fixtureMutationBlocked, StandardApiResponse } from '@/server/workitems';
import { WorkItemsData } from '@/types/workitem';
import { isRunning } from '@/server/runs';

interface UpdatePatch { owner?: string; priority?: string; impact?: string; effort?: string; cost_estimate_usd_month?: number | string; add_tag?: string; remove_tag?: string; append_link?: string; }
interface UpdateBody { id?: string; patch?: UpdatePatch; }

const VALID_PRIORITIES = ['p0', 'p1', 'p2', 'p3'];
const VALID_IMPACT = ['low', 'medium', 'high', 'critical'];
const VALID_EFFORT = ['xs', 's', 'm', 'l', 'xl'];

export async function POST(request: NextRequest): Promise<NextResponse<StandardApiResponse<WorkItemsData | null>>> {
  if (process.env.USE_FIXTURES === 'true') return NextResponse.json(fixtureMutationBlocked('update'), { status: 403 });

  try {
    const body = (await request.json()) as UpdateBody;
    const rawId = body.id?.trim();
    const patch = body.patch;

    if (!rawId || !patch) return NextResponse.json({ success: false, action: 'update', id: rawId || 'SYSTEM', message: 'Missing required fields: id, patch', stdout: '', stderr: 'Validation error', blocked_by_guardrail: false, data: null }, { status: 400 });

    const validation = validateWorkItemId(rawId);
    if (!validation.ok) return NextResponse.json({ success: false, action: 'update', id: rawId, message: `Invalid id: ${validation.reason}`, stdout: '', stderr: validation.reason, blocked_by_guardrail: true, data: null }, { status: 400 });

    const runCheck = await isRunning(validation.id);
    if (runCheck.running) {
      return NextResponse.json({ success: false, action: 'update', id: validation.id, message: `Blocked: item is currently being processed (${runCheck.runState?.action})`, stdout: '', stderr: 'Guardrail: item running', blocked_by_guardrail: true, data: null }, { status: 200 });
    }

    const args: string[] = ['--id', validation.id];

    if (patch.owner?.trim()) args.push('--set-owner', patch.owner.trim());
    if (patch.priority?.trim()) {
      const priority = patch.priority.trim();
      if (!VALID_PRIORITIES.includes(priority)) return NextResponse.json({ success: false, action: 'update', id: validation.id, message: `Invalid priority '${priority}'`, stdout: '', stderr: `Valid priorities: ${VALID_PRIORITIES.join(', ')}`, blocked_by_guardrail: false, data: null }, { status: 400 });
      args.push('--set-priority', priority);
    }
    if (patch.impact?.trim()) {
      const impact = patch.impact.trim();
      if (!VALID_IMPACT.includes(impact)) return NextResponse.json({ success: false, action: 'update', id: validation.id, message: `Invalid impact '${impact}'`, stdout: '', stderr: `Valid impact values: ${VALID_IMPACT.join(', ')}`, blocked_by_guardrail: false, data: null }, { status: 400 });
      args.push('--set-impact', impact);
    }
    if (patch.effort?.trim()) {
      const effort = patch.effort.trim();
      if (!VALID_EFFORT.includes(effort)) return NextResponse.json({ success: false, action: 'update', id: validation.id, message: `Invalid effort '${effort}'`, stdout: '', stderr: `Valid effort values: ${VALID_EFFORT.join(', ')}`, blocked_by_guardrail: false, data: null }, { status: 400 });
      args.push('--set-effort', effort);
    }

    if (patch.cost_estimate_usd_month !== undefined && patch.cost_estimate_usd_month !== null && patch.cost_estimate_usd_month !== '') {
      const costAsString = String(patch.cost_estimate_usd_month).trim();
      if (!/^\d+(\.\d+)?$/.test(costAsString)) return NextResponse.json({ success: false, action: 'update', id: validation.id, message: 'Invalid cost_estimate_usd_month', stdout: '', stderr: 'Cost must be a positive number', blocked_by_guardrail: false, data: null }, { status: 400 });
      args.push('--set-cost', costAsString);
    }

    if (patch.add_tag?.trim()) args.push('--add-tag', patch.add_tag.trim());
    if (patch.remove_tag?.trim()) args.push('--remove-tag', patch.remove_tag.trim());
    if (patch.append_link?.trim()) args.push('--append-link', patch.append_link.trim());

    if (args.length === 2) return NextResponse.json({ success: false, action: 'update', id: validation.id, message: 'Patch is empty; no update flags were provided', stdout: '', stderr: 'No-op update', blocked_by_guardrail: false, data: null }, { status: 400 });

    const response = await executeActionWithExport({
      action: 'update', fallbackId: validation.id,
      calls: [{ scriptName: 'wi-update.sh', args, action: 'update', id: validation.id }],
      successMessage: `Workitem ${validation.id} updated successfully`,
    });

    if (response.data) response.data = { ...(response.data as object), id_validation: validation.mode } as WorkItemsData;
    return NextResponse.json(response, { status: response.success ? 200 : response.blocked_by_guardrail ? 200 : 500 });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ success: false, action: 'update', id: 'SYSTEM', message: `Update failed: ${errorMessage}`, stdout: '', stderr: errorMessage, blocked_by_guardrail: false, data: null }, { status: 500 });
  }
}
