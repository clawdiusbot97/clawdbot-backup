import { NextRequest, NextResponse } from 'next/server';
import { executeActionWithExport } from '@/server/actionsApi';
import { fixtureMutationBlocked, StandardApiResponse } from '@/server/workitems';
import { WorkItemsData } from '@/types/workitem';

interface CreateBody { type?: string; title?: string; priority?: string; }

const VALID_TYPES = ['idea', 'requirement', 'feature', 'blocker', 'decision', 'risk', 'research', 'solution'];
const VALID_PRIORITIES = ['p0', 'p1', 'p2', 'p3'];

export async function POST(request: NextRequest): Promise<NextResponse<StandardApiResponse<WorkItemsData | null>>> {
  if (process.env.USE_FIXTURES === 'true') return NextResponse.json(fixtureMutationBlocked('create'), { status: 403 });

  try {
    const body = (await request.json()) as CreateBody;
    const type = body.type?.trim();
    const title = body.title?.trim();
    const priority = body.priority?.trim();

    if (!type || !title || !priority) return NextResponse.json({ success: false, action: 'create', id: 'SYSTEM', message: 'Missing required fields: type, title, priority', stdout: '', stderr: 'Validation error', blocked_by_guardrail: false, data: null }, { status: 400 });

    if (!VALID_TYPES.includes(type)) return NextResponse.json({ success: false, action: 'create', id: 'SYSTEM', message: `Invalid type '${type}'`, stdout: '', stderr: `Valid types: ${VALID_TYPES.join(', ')}`, blocked_by_guardrail: false, data: null }, { status: 400 });

    if (!VALID_PRIORITIES.includes(priority)) return NextResponse.json({ success: false, action: 'create', id: 'SYSTEM', message: `Invalid priority '${priority}'`, stdout: '', stderr: `Valid priorities: ${VALID_PRIORITIES.join(', ')}`, blocked_by_guardrail: false, data: null }, { status: 400 });

    const response = await executeActionWithExport({
      action: 'create', fallbackId: 'SYSTEM',
      calls: [{ scriptName: 'wi-create.sh', args: ['--type', type, '--title', title, '--priority', priority], action: 'create', id: 'SYSTEM' }],
      successMessage: 'Workitem created successfully',
    });

    return NextResponse.json(response, { status: response.success ? 200 : response.blocked_by_guardrail ? 200 : 500 });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ success: false, action: 'create', id: 'SYSTEM', message: `Create failed: ${errorMessage}`, stdout: '', stderr: errorMessage, blocked_by_guardrail: false, data: null }, { status: 500 });
  }
}
