import { useEffect, useState } from 'react';
import { KANBAN_COLUMNS, KanbanColumn, MissionLogEntry, RunningState, WorkItem } from '@/types/workitem';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Field } from '@/components/ui/Field';
import { Select } from '@/components/ui/Select';
import { Textarea } from '@/components/ui/Textarea';
import { formatDateTime } from '@/components/board/formatters';

export interface DrawerReportFile {
  name: string;
  size: number;
}

export interface ItemDrawerProps {
  item: WorkItem | null;
  open: boolean;
  canClarify: boolean;
  clarifyDisabledReason?: string;
  canConfirm: boolean;
  canMove: boolean;
  canUpdate: boolean;
  canDrop: boolean;
  canDelete: boolean;
  actionLoading: string | null;
  reportsLoading: boolean;
  reportLoadingName: string | null;
  reports: DrawerReportFile[];
  itemLogs: { running: boolean; runState?: RunningState; logs: MissionLogEntry[] } | null;
  runState?: RunningState;
  logsLoading: boolean;
  moveTarget: KanbanColumn;
  dropReason: string;
  onClose: () => void;
  onOpenEdit: () => void;
  onClarify: () => void;
  onConfirm: (plan: 'A' | 'B' | 'C') => void;
  onMove: () => void;
  onDrop: () => void;
  onDelete: () => void;
  onResearch: () => void;
  onMoveTargetChange: (column: KanbanColumn) => void;
  onDropReasonChange: (value: string) => void;
  onReportOpen: (name: string) => void;
  onSelectTimelineEntry: (entry: MissionLogEntry) => void;
  displayId?: string;
}

export function ItemDrawer({
  item,
  open,
  canClarify,
  clarifyDisabledReason,
  canConfirm,
  canMove,
  canUpdate,
  canDrop,
  canDelete,
  actionLoading,
  reportsLoading,
  reportLoadingName,
  reports,
  itemLogs,
  runState,
  logsLoading,
  moveTarget,
  dropReason,
  onClose,
  onOpenEdit,
  onClarify,
  onConfirm,
  onMove,
  onDrop,
  onDelete,
  onResearch,
  onMoveTargetChange,
  onDropReasonChange,
  onReportOpen,
  onSelectTimelineEntry,
  displayId,
}: ItemDrawerProps) {
  const [selectedPlan, setSelectedPlan] = useState<'A' | 'B' | 'C' | ''>('');
  const [now, setNow] = useState(() => Date.now());

  const isRunning = itemLogs?.running ?? Boolean(runState);
  const effectiveRunState = runState ?? itemLogs?.runState;
  const canStartResearch =
    (item?.allowed_actions.includes('research') ?? false) &&
    !isRunning &&
    (item?.status === 'NEW' || item?.status === 'RESEARCHING');

  useEffect(() => {
    if (!isRunning || !effectiveRunState?.started_at) return;

    const interval = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(interval);
  }, [isRunning, effectiveRunState?.started_at]);

  const durationText = (() => {
    if (!effectiveRunState?.started_at) return 'N/A';
    const started = new Date(effectiveRunState.started_at).getTime();
    if (Number.isNaN(started)) return 'N/A';
    const diffSeconds = Math.max(0, Math.floor((now - started) / 1000));
    const hours = Math.floor(diffSeconds / 3600);
    const minutes = Math.floor((diffSeconds % 3600) / 60);
    const seconds = diffSeconds % 60;
    if (hours > 0) return `${hours}h ${minutes}m ${seconds}s`;
    if (minutes > 0) return `${minutes}m ${seconds}s`;
    return `${seconds}s`;
  })();

  if (!open || !item) return null;

  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/35" onClick={onClose} />
      <aside className="fixed top-0 right-0 z-50 flex h-full w-full max-w-xl flex-col border-l border-slate-800 bg-slate-950 shadow-2xl">
        <div className="flex items-start justify-between gap-4 border-b border-slate-800 px-5 py-4">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-widest text-slate-500">{displayId ?? item.id}</p>
            <h2 className="mt-1 text-lg font-semibold text-slate-100">{item.title}</h2>
            <p className="text-xs text-slate-400">Canonical ID: {item.id}</p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-200">✕</button>
        </div>

        <div className="flex-1 space-y-5 overflow-y-auto px-5 py-4">
          <section>
            <h3 className="mb-2 text-sm font-semibold text-slate-100">Details</h3>
            <dl className="grid grid-cols-2 gap-2 text-sm">
              <div><dt className="text-slate-400">Type</dt><dd className="text-slate-100">{item.type}</dd></div>
              <div><dt className="text-slate-400">Status</dt><dd className="text-slate-100">{item.status}</dd></div>
              <div><dt className="text-slate-400">Owner</dt><dd className="text-slate-100">@{item.owner}</dd></div>
              <div><dt className="text-slate-400">Priority</dt><dd className="text-slate-100">{item.priority}</dd></div>
              <div><dt className="text-slate-400">Impact</dt><dd className="text-slate-100">{item.impact || 'N/A'}</dd></div>
              <div><dt className="text-slate-400">Effort</dt><dd className="text-slate-100">{item.effort || 'N/A'}</dd></div>
              <div><dt className="text-slate-400">Cost / month</dt><dd className="text-slate-100">{item.cost_estimate_usd_month ?? 'N/A'}</dd></div>
              <div><dt className="text-slate-400">Path</dt><dd className="break-all text-slate-100">{item.path}</dd></div>
              <div><dt className="text-slate-400">Created</dt><dd className="text-slate-100">{formatDateTime(item.created_at)}</dd></div>
              <div><dt className="text-slate-400">Updated</dt><dd className="text-slate-100">{formatDateTime(item.updated_at)}</dd></div>
            </dl>

            {isRunning && effectiveRunState && (
              <>
                <div className="mt-3 rounded-md border border-amber-700/50 bg-amber-950/30 p-3 text-sm text-amber-100">
                  This item is being processed by {effectiveRunState.agent}
                </div>
                <div className="mt-3 rounded-md border border-amber-700/50 bg-amber-950/20 p-3 text-sm">
                  <h4 className="mb-2 font-semibold text-amber-100">Active Run</h4>
                  <dl className="grid grid-cols-2 gap-2 text-xs">
                    <div><dt className="text-amber-200/80">Agent</dt><dd className="text-amber-100">{effectiveRunState.agent}</dd></div>
                    <div><dt className="text-amber-200/80">Action</dt><dd className="text-amber-100">{effectiveRunState.action}</dd></div>
                    <div><dt className="text-amber-200/80">Started at</dt><dd className="text-amber-100">{formatDateTime(effectiveRunState.started_at)}</dd></div>
                    <div><dt className="text-amber-200/80">Duration</dt><dd className="text-amber-100">{durationText}</dd></div>
                    {effectiveRunState.status_target && (
                      <div className="col-span-2"><dt className="text-amber-200/80">Status target</dt><dd className="text-amber-100">{effectiveRunState.status_target}</dd></div>
                    )}
                  </dl>
                </div>
              </>
            )}

            <div className="mt-3">
              <p className="mb-1 text-xs text-slate-400">Allowed actions</p>
              <div className="flex flex-wrap gap-1">
                {item.allowed_actions.map((action) => (
                  <Badge key={action}>{action}</Badge>
                ))}
              </div>
            </div>
          </section>

          <section>
            <h3 className="mb-2 text-sm font-semibold text-slate-100">Actions</h3>
            <div className="mb-3 flex flex-wrap gap-2">
              {canClarify && (
                <Button
                  onClick={onClarify}
                  disabled={actionLoading !== null || isRunning || Boolean(clarifyDisabledReason)}
                  variant="warning"
                  size="sm"
                  loading={actionLoading === 'clarify'}
                  title={clarifyDisabledReason}
                >
                  {actionLoading === 'clarify' ? 'Clarifying...' : 'Clarify'}
                </Button>
              )}

              {item.reports.clarification && (
                <Button
                  onClick={() => onReportOpen('clarification.md')}
                  disabled={reportLoadingName === 'clarification.md'}
                  variant="ghost"
                  size="sm"
                >
                  {reportLoadingName === 'clarification.md' ? 'Opening...' : 'Open Clarification Report'}
                </Button>
              )}

              {canUpdate && (
                <Button onClick={onOpenEdit} disabled={actionLoading !== null || isRunning} variant="secondary" size="sm">
                  Update
                </Button>
              )}

              {canStartResearch && (
                <Button onClick={onResearch} disabled={actionLoading !== null || isRunning} variant="primary" size="sm" loading={actionLoading === 'research'}>
                  {actionLoading === 'research' ? 'Researching...' : 'Start Research'}
                </Button>
              )}
            </div>

            {canConfirm && (
              <div className="mb-3 space-y-2 rounded-md border border-slate-800 bg-slate-900/60 p-3">
                <Field label="Implementation plan">
                  <Select
                    value={selectedPlan}
                    onChange={(event) => setSelectedPlan(event.target.value as 'A' | 'B' | 'C' | '')}
                    className="py-1.5"
                  >
                    <option value="">Select plan...</option>
                    <option value="A">Plan A</option>
                    <option value="B">Plan B</option>
                    <option value="C">Plan C</option>
                  </Select>
                </Field>
                <p className="text-xs text-slate-400">Select a plan and confirm to proceed</p>
                <Button
                  onClick={() => selectedPlan && onConfirm(selectedPlan)}
                  disabled={actionLoading !== null || isRunning || !selectedPlan}
                  variant="primary"
                  size="sm"
                  loading={actionLoading === 'confirm'}
                >
                  {actionLoading === 'confirm' ? 'Confirming...' : 'Confirm selected plan'}
                </Button>
              </div>
            )}

            {canMove && (
              <div className="mb-3 flex items-center gap-2">
                <Select value={moveTarget} disabled={isRunning} onChange={(event) => onMoveTargetChange(event.target.value as KanbanColumn)} className="py-1.5">
                  {KANBAN_COLUMNS.map((column) => (
                    <option key={column} value={column}>{column}</option>
                  ))}
                </Select>
                <Button onClick={onMove} disabled={actionLoading !== null || isRunning} variant="secondary" size="sm" loading={actionLoading === 'move'}>
                  {actionLoading === 'move' ? 'Moving...' : 'Move'}
                </Button>
              </div>
            )}

            {canDrop && (
              <div className="space-y-2">
                <Field label="Drop reason (optional)">
                  <Textarea
                    rows={2}
                    value={dropReason}
                    onChange={(event) => onDropReasonChange(event.target.value)}
                    disabled={isRunning}
                    placeholder="Reason for dropping this work item"
                  />
                </Field>
                <Button onClick={onDrop} disabled={actionLoading !== null || isRunning} variant="danger" size="sm" loading={actionLoading === 'drop'}>
                  {actionLoading === 'drop' ? 'Dropping...' : 'Drop'}
                </Button>
              </div>
            )}

            {canDelete && (
              <div className="mt-3 space-y-2 rounded-md border border-rose-800/50 bg-rose-950/20 p-3">
                <p className="text-xs text-rose-200/80">This action cannot be undone.</p>
                <Button onClick={onDelete} disabled={actionLoading !== null || isRunning} variant="danger" size="sm" loading={actionLoading === 'delete'}>
                  {actionLoading === 'delete' ? 'Deleting...' : 'Delete'}
                </Button>
              </div>
            )}
          </section>

          <section>
            <div className="mb-2 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-slate-100">View Reports</h3>
              {reportsLoading && <span className="text-xs text-slate-400">Loading...</span>}
            </div>
            {reports.length ? (
              <ul className="space-y-1">
                {reports.map((file) => (
                  <li key={file.name}>
                    <button
                      onClick={() => onReportOpen(file.name)}
                      disabled={reportLoadingName === file.name}
                      className="flex w-full items-center justify-between rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-left text-sm hover:bg-slate-800"
                    >
                      <span>{file.name}</span>
                      <span className="text-xs text-slate-400">
                        {reportLoadingName === file.name ? 'Opening...' : `${Math.round(file.size / 1024)} KB`}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-slate-400">No reports available.</p>
            )}
          </section>

          <section>
            <div className="mb-2 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-slate-100">Activity timeline</h3>
              {itemLogs?.running && <Badge variant="warning">RUNNING</Badge>}
            </div>

            {logsLoading ? (
              <div className="text-sm text-slate-400">Loading logs...</div>
            ) : itemLogs?.logs?.length ? (
              <ul className="space-y-2">
                {itemLogs.logs.map((entry, index) => (
                  <li key={`${entry.file ?? entry.finished_at}-${index}`}>
                    <button
                      onClick={() => onSelectTimelineEntry(entry)}
                      className="w-full rounded-md border border-slate-700 bg-slate-900 p-2 text-left hover:bg-slate-800"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className="text-sm font-medium text-slate-100">{entry.action}</div>
                        <Badge variant={entry.success ? 'success' : 'danger'}>
                          {entry.blocked_by_guardrail ? 'BLOCKED' : entry.success ? 'OK' : 'FAIL'}
                        </Badge>
                      </div>
                      <div className="mt-1 text-xs text-slate-400">
                        <div>{entry.duration_ms} ms • {formatDateTime(entry.finished_at || entry.started_at)}</div>
                      </div>
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="text-sm text-slate-400">No activity yet for this item.</div>
            )}
          </section>
        </div>
      </aside>
    </>
  );
}
