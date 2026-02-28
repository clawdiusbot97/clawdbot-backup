import { NextResponse } from 'next/server';
import { runScript } from '@/server/runScript';
import { readFile } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';

// Import types from parent directory or define inline
interface Workitem {
  id: string;
  title: string;
  status: string;
  type: string;
  allowed_actions: string[];
  [key: string]: unknown;
}

interface WorkitemsResponse {
  workitems: Workitem[];
  total_items: number;
  counts_by_status: Record<string, number>;
  counts_by_type: Record<string, number>;
}

interface ScriptResult {
  success: boolean;
  action: string;
  id?: string;
  message: string;
  stdout: string;
  stderr: string;
  blocked_by_guardrail: boolean;
  data?: unknown;
}

interface ApiResponse {
  success: boolean;
  action: string;
  id: string;
  message: string;
  stdout: string;
  stderr: string;
  blocked_by_guardrail: boolean;
  data?: WorkitemsResponse;
}

// Real path to the workitems engine script (NOT in brokia/workitems/, it's in mission-control)
const WORKITEMS_ENGINE_PATH = 'brokia/mission-control/brokia/workitems';

/**
 * GET /api/workitems
 * Fetches work items from the canonical JSON file via wi-export.sh
 * 
 * Supports fixtures mode via USE_FIXTURES=true in .env.local
 * When USE_FIXTURES=true, returns fixtures/workitems.json instead of running scripts
 */
export async function GET(): Promise<NextResponse<ApiResponse>> {
  const timestamp = new Date().toISOString();
  const action = 'workitems_get';
  const useFixtures = process.env.USE_FIXTURES === 'true';

  try {
    // Fixture mode: return mock data without running scripts
    if (useFixtures) {
      const fixturePath = path.join(process.cwd(), 'fixtures', 'workitems.json');
      
      if (!existsSync(fixturePath)) {
        const response: ApiResponse = {
          success: false,
          action,
          id: 'N/A',
          message: 'Fixture mode enabled but fixtures/workitems.json not found',
          stdout: '',
          stderr: 'Fixture file not found',
          blocked_by_guardrail: false,
        };
        return NextResponse.json(response, { status: 404 });
      }

      const fileContent = await readFile(fixturePath, 'utf-8');
      const parsed = JSON.parse(fileContent);
      const workitems = Array.isArray(parsed) ? parsed : (parsed.workitems || []);
      
      const countsByStatus: Record<string, number> = {};
      const countsByType: Record<string, number> = {};

      for (const wi of workitems) {
        countsByStatus[wi.status] = (countsByStatus[wi.status] || 0) + 1;
        countsByType[wi.type] = (countsByType[wi.type] || 0) + 1;
      }

      const workitemsData: WorkitemsResponse = {
        workitems,
        total_items: workitems.length,
        counts_by_status: countsByStatus,
        counts_by_type: countsByType,
      };

      const response: ApiResponse = {
        success: true,
        action,
        id: 'N/A',
        message: `Retrieved ${workitemsData.total_items} work items (fixture mode)`,
        stdout: '',
        stderr: '',
        blocked_by_guardrail: false,
        data: workitemsData,
      };

      return NextResponse.json(response);
    }

    // Real mode: execute the export script
    // Script path: brokia/mission-control/brokia/workitems/wi-export.sh
    const scriptResult = await runScript('wi-export.sh', [], {
      action,
      id: undefined,
      cwd: WORKITEMS_ENGINE_PATH,
    }) as ScriptResult;

    // Workitems file path: brokia/mission-control/brokia/workitems/index/workitems.json
    const workitemsPath = path.join(process.cwd(), WORKITEMS_ENGINE_PATH, 'index', 'workitems.json');

    let workitemsData: WorkitemsResponse | null = null;
    let dataError: string | null = null;

    // Read the workitems JSON if export succeeded
    if (scriptResult.success && existsSync(workitemsPath)) {
      try {
        const fileContent = await readFile(workitemsPath, 'utf-8');
        const parsed = JSON.parse(fileContent);
        
        // Extract workitems array and compute aggregates
        const workitems = Array.isArray(parsed) ? parsed : (parsed.workitems || []);
        
        const countsByStatus: Record<string, number> = {};
        const countsByType: Record<string, number> = {};

        for (const wi of workitems) {
          countsByStatus[wi.status] = (countsByStatus[wi.status] || 0) + 1;
          countsByType[wi.type] = (countsByType[wi.type] || 0) + 1;
        }

        workitemsData = {
          workitems,
          total_items: workitems.length,
          counts_by_status: countsByStatus,
          counts_by_type: countsByType,
        };
      } catch (readError) {
        dataError = readError instanceof Error ? readError.message : 'Failed to read workitems';
      }
    }

    const response: ApiResponse = {
      success: scriptResult.success && workitemsData !== null,
      action,
      id: 'N/A',
      message: workitemsData 
        ? `Retrieved ${workitemsData.total_items} work items`
        : scriptResult.message || dataError || 'Failed to retrieve work items',
      stdout: scriptResult.stdout,
      stderr: scriptResult.stderr || dataError || '',
      blocked_by_guardrail: scriptResult.blocked_by_guardrail,
      data: workitemsData || undefined,
    };

    // Return 500 if export failed
    if (!scriptResult.success || workitemsData === null) {
      return NextResponse.json(response, { status: 500 });
    }

    return NextResponse.json(response);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    const response: ApiResponse = {
      success: false,
      action,
      id: 'N/A',
      message: `Internal server error: ${errorMessage}`,
      stdout: '',
      stderr: errorMessage,
      blocked_by_guardrail: false,
    };

    return NextResponse.json(response, { status: 500 });
  }
}