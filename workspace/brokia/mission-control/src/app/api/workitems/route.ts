import { NextRequest, NextResponse } from 'next/server';
import { readFile, writeFile, rm } from 'fs/promises';
import { join } from 'path';
import { runScript, ScriptResult, writeLog } from '@/server/runScript';
import { validateWorkItemId, safeResolve } from '@/server/validate';
import { fixtureMutationBlocked, StandardApiResponse, getBrokiaRoot, resolveFromBrokiaRoot } from '@/server/workitems';
import { WorkItem, WorkItemsData } from '@/types/workitem';

/**
 * GET /api/workitems
 * 
 * Returns the full workitems index.
 * In real mode: executes wi-export.sh, then reads the exported JSON.
 * In fixture mode: reads from fixtures/workitems.json directly.
 */
export async function GET(): Promise<NextResponse> {
  const useFixtures = process.env.USE_FIXTURES === 'true';
  
  try {
    let workitemsData: unknown;
    let scriptResult: ScriptResult | null = null;

    if (useFixtures) {
      // Fixture mode: read from fixtures directory
      const fixturePath = join(process.cwd(), 'fixtures/workitems.json');
      const fixtureContent = await readFile(fixturePath, 'utf-8');
      workitemsData = JSON.parse(fixtureContent);
    } else {
      // Real mode: execute export script, then read the exported JSON
      const brokiaRoot = process.env.BROKIA_ROOT || '.';
      const exportPath = process.env.EXPORT_PATH || 'brokia/workitems/index/workitems.json';
      
      // Execute wi-export.sh to regenerate the index
      scriptResult = await runScript(
        'wi-export.sh',
        ['--out', exportPath],
        {
          cwd: brokiaRoot,
          action: 'workitems_get',
          id: 'N/A',
        }
      );

      if (!scriptResult.success) {
        return NextResponse.json(
          {
            success: false,
            action: 'workitems_get',
            id: 'N/A',
            message: 'Failed to export workitems',
            stdout: scriptResult.stdout,
            stderr: scriptResult.stderr,
            blocked_by_guardrail: scriptResult.blocked_by_guardrail,
            data: null,
          },
          { status: 500 }
        );
      }

      // Read the exported JSON
      const fullExportPath = join(brokiaRoot, exportPath);
      const jsonContent = await readFile(fullExportPath, 'utf-8');
      workitemsData = JSON.parse(jsonContent);
    }

    // Build response
    const response = {
      success: true,
      action: 'workitems_get',
      id: 'N/A',
      message: useFixtures 
        ? 'Workitems loaded from fixtures' 
        : 'Workitems exported and loaded successfully',
      stdout: scriptResult?.stdout || '',
      stderr: scriptResult?.stderr || '',
      blocked_by_guardrail: false,
      data: workitemsData,
    };

    // Write log for audit trail
    await writeLog('SYSTEM', 'workitems_get', {
      success: response.success,
      action: response.action,
      id: response.id,
      message: response.message,
      stdout: response.stdout,
      stderr: response.stderr,
      blocked_by_guardrail: response.blocked_by_guardrail,
    });

    return NextResponse.json(response);

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    
    return NextResponse.json(
      {
        success: false,
        action: 'workitems_get',
        id: 'N/A',
        message: `Failed to load workitems: ${errorMessage}`,
        stdout: '',
        stderr: errorMessage,
        blocked_by_guardrail: false,
        data: null,
      },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/workitems?id=<ID>
 * 
 * Hard-deletes a workitem. Only allowed if status === 'DROPPED'.
 * Removes: index entry, workitem folder, logs folder, reports folder.
 */
export async function DELETE(request: NextRequest): Promise<NextResponse<StandardApiResponse<null>>> {
  if (process.env.USE_FIXTURES === 'true') {
    return NextResponse.json(fixtureMutationBlocked('workitem_delete'), { status: 403 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const rawId = searchParams.get('id')?.trim();

    if (!rawId) {
      return NextResponse.json(
        {
          success: false,
          action: 'workitem_delete',
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
          action: 'workitem_delete',
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

    const id = validation.id;

    // Read the index to find the workitem and check its status
    const exportPath = process.env.EXPORT_PATH || 'brokia/workitems/index/workitems.json';
    const indexPath = resolveFromBrokiaRoot(exportPath);
    const indexContent = await readFile(indexPath, 'utf-8');
    const indexData = JSON.parse(indexContent) as WorkItemsData;

    const itemIndex = indexData.items.findIndex((item: WorkItem) => item.id === id);
    if (itemIndex === -1) {
      return NextResponse.json(
        {
          success: false,
          action: 'workitem_delete',
          id,
          message: `Workitem ${id} not found`,
          stdout: '',
          stderr: 'Not found',
          blocked_by_guardrail: false,
          data: null,
        },
        { status: 404 }
      );
    }

    const item = indexData.items[itemIndex];

    // Safety guardrail: only allow deletion if status is DROPPED
    if (item.status !== 'DROPPED') {
      return NextResponse.json(
        {
          success: false,
          action: 'workitem_delete',
          id,
          message: `Cannot delete workitem ${id}: status is '${item.status}', must be 'DROPPED'`,
          stdout: '',
          stderr: 'Deletion blocked by guardrail: status !== DROPPED',
          blocked_by_guardrail: true,
          data: null,
        },
        { status: 403 }
      );
    }

    // Remove from index
    indexData.items.splice(itemIndex, 1);
    indexData.total_items = indexData.items.length;
    indexData.generated_at = new Date().toISOString();

    // Recalculate counts
    indexData.counts_by_status = {};
    indexData.counts_by_type = {};
    for (const wi of indexData.items) {
      indexData.counts_by_status[wi.status] = (indexData.counts_by_status[wi.status] || 0) + 1;
      indexData.counts_by_type[wi.type] = (indexData.counts_by_type[wi.type] || 0) + 1;
    }

    // Remove workitem folder (using safeResolve for security)
    const brokiaRoot = getBrokiaRoot();
    const workitemsDir = process.env.WORKITEMS_DIR || 'brokia/workitems';
    if (item.path) {
      try {
        const workitemPath = safeResolve(resolveFromBrokiaRoot(workitemsDir), item.path);
        await rm(workitemPath, { force: true });
      } catch {
        // Ignore errors if file doesn't exist
      }
    }

    // Remove logs folder
    const logsDir = process.env.LOGS_DIR || 'brokia/mission-control/logs';
    try {
      const logsPath = safeResolve(brokiaRoot, logsDir, id);
      await rm(logsPath, { recursive: true, force: true });
    } catch {
      // Ignore errors if folder doesn't exist
    }

    // Remove reports folder
    try {
      const reportsPath = safeResolve(brokiaRoot, 'brokia/workitems/reports', id);
      await rm(reportsPath, { recursive: true, force: true });
    } catch {
      // Ignore errors if folder doesn't exist
    }

    // Write updated index
    await writeFile(indexPath, JSON.stringify(indexData, null, 2));

    return NextResponse.json(
      {
        success: true,
        action: 'workitem_delete',
        id,
        message: `Workitem ${id} deleted successfully`,
        stdout: '',
        stderr: '',
        blocked_by_guardrail: false,
        data: null,
      },
      { status: 200 }
    );
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';

    return NextResponse.json(
      {
        success: false,
        action: 'workitem_delete',
        id: 'SYSTEM',
        message: `Delete failed: ${errorMessage}`,
        stdout: '',
        stderr: errorMessage,
        blocked_by_guardrail: false,
        data: null,
      },
      { status: 500 }
    );
  }
}
