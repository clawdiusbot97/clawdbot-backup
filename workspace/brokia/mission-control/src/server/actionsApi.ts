import { runScript, ScriptResult } from '@/server/runScript';
import {
  StandardApiResponse,
  combineStdStreams,
  extractWorkitemIdFromText,
  getBrokiaRoot,
  runExportAndRead,
} from '@/server/workitems';
import { WorkItemsData } from '@/types/workitem';

export interface ScriptCall {
  scriptName: string;
  args: string[];
  action: string;
  id?: string;
}

interface ExecuteActionParams {
  action: string;
  fallbackId?: string;
  calls: ScriptCall[];
  successMessage?: string;
}

function normalizeActionId(id?: string | null): string {
  if (!id || !id.trim() || id === 'N/A') {
    return 'SYSTEM';
  }
  return id.trim();
}

function resolveIdFromResult(result: ScriptResult, currentId: string): string {
  const fromResult = normalizeActionId(result.id);
  if (fromResult !== 'SYSTEM') {
    return fromResult;
  }

  const fromStdout = extractWorkitemIdFromText(result.stdout);
  if (fromStdout) {
    return fromStdout;
  }

  return currentId;
}

function buildFailedResponse(
  action: string,
  id: string,
  result: ScriptResult,
  priorResults: ScriptResult[] = []
): StandardApiResponse<null> {
  const { stdout, stderr } = combineStdStreams([...priorResults, result]);

  return {
    success: false,
    action,
    id,
    message: result.message,
    stdout,
    stderr,
    blocked_by_guardrail: result.blocked_by_guardrail,
    data: null,
  };
}

export async function executeActionWithExport({
  action,
  fallbackId = 'SYSTEM',
  calls,
  successMessage,
}: ExecuteActionParams): Promise<StandardApiResponse<WorkItemsData | null>> {
  let resolvedId = normalizeActionId(fallbackId);
  const results: ScriptResult[] = [];

  for (const call of calls) {
    const result = await runScript(call.scriptName, call.args, {
      cwd: getBrokiaRoot(),
      action: call.action,
      id: call.id || resolvedId,
    });

    results.push(result);
    resolvedId = resolveIdFromResult(result, resolvedId);

    if (!result.success) {
      return buildFailedResponse(action, resolvedId, result, results.slice(0, -1));
    }
  }

  const { exportResult, data } = await runExportAndRead(`${action}_export`, resolvedId);
  results.push(exportResult);

  if (!exportResult.success) {
    return buildFailedResponse(action, resolvedId, exportResult, results.slice(0, -1));
  }

  const { stdout, stderr } = combineStdStreams(results);

  return {
    success: true,
    action,
    id: resolvedId,
    message: successMessage || `Action '${action}' executed successfully and export refreshed`,
    stdout,
    stderr,
    blocked_by_guardrail: false,
    data,
  };
}
