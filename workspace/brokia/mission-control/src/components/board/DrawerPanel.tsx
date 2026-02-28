'use client';

import { useState } from 'react';
import { KanbanColumn, MissionLogEntry, RunningState, WorkItem } from '@/types/workitem';
import { ItemDrawer } from '@/components/board/ItemDrawer';
import { formatDateTime } from '@/components/board/formatters';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';

interface DrawerPanelProps {
  selectedItem: WorkItem | null;
  selectedDisplayId?: string;
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
  reports: { name: string; size: number }[];
  logs: { running: boolean; runState?: RunningState; logs: MissionLogEntry[] } | null;
  runningState?: RunningState;
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
  onNotice: (text: string) => void;
}

export function DrawerPanel(props: DrawerPanelProps) {
  const [selectedTimelineEntry, setSelectedTimelineEntry] = useState<MissionLogEntry | null>(null);

  return (
    <>
      <ItemDrawer
        key={props.selectedItem?.id ?? 'item-drawer'}
        item={props.selectedItem}
        open={props.open}
        displayId={props.selectedDisplayId}
        canClarify={props.canClarify}
        clarifyDisabledReason={props.clarifyDisabledReason}
        canConfirm={props.canConfirm}
        canMove={props.canMove}
        canUpdate={props.canUpdate}
        canDrop={props.canDrop}
        canDelete={props.canDelete}
        actionLoading={props.actionLoading}
        reportsLoading={props.reportsLoading}
        reportLoadingName={props.reportLoadingName}
        reports={props.reports}
        itemLogs={props.logs}
        runState={props.runningState}
        logsLoading={props.logsLoading}
        moveTarget={props.moveTarget}
        dropReason={props.dropReason}
        onClose={props.onClose}
        onOpenEdit={props.onOpenEdit}
        onClarify={props.onClarify}
        onConfirm={props.onConfirm}
        onMove={props.onMove}
        onDrop={props.onDrop}
        onDelete={props.onDelete}
        onResearch={props.onResearch}
        onMoveTargetChange={props.onMoveTargetChange}
        onDropReasonChange={props.onDropReasonChange}
        onReportOpen={props.onReportOpen}
        onSelectTimelineEntry={setSelectedTimelineEntry}
      />

      <Modal
        open={Boolean(selectedTimelineEntry)}
        onClose={() => setSelectedTimelineEntry(null)}
        title="Timeline Entry Details"
        className="max-h-[90vh] max-w-3xl overflow-y-auto"
      >
        {selectedTimelineEntry && (
          <>
            <dl className="mb-4 grid grid-cols-2 gap-3 text-sm">
              <div><dt className="text-slate-400">Action</dt><dd className="text-slate-100">{selectedTimelineEntry.action}</dd></div>
              <div><dt className="text-slate-400">Result</dt><dd className="text-slate-100">{selectedTimelineEntry.blocked_by_guardrail ? 'Blocked' : selectedTimelineEntry.success ? 'Success' : 'Failed'}</dd></div>
              <div><dt className="text-slate-400">Started</dt><dd className="text-slate-100">{formatDateTime(selectedTimelineEntry.started_at)}</dd></div>
              <div><dt className="text-slate-400">Finished</dt><dd className="text-slate-100">{formatDateTime(selectedTimelineEntry.finished_at)}</dd></div>
              <div><dt className="text-slate-400">Duration</dt><dd className="text-slate-100">{selectedTimelineEntry.duration_ms} ms</dd></div>
              <div><dt className="text-slate-400">Provider / Model</dt><dd className="text-slate-100">{selectedTimelineEntry.provider}/{selectedTimelineEntry.model}</dd></div>
              <div className="col-span-2"><dt className="text-slate-400">Log file</dt><dd className="break-all text-slate-100">{selectedTimelineEntry.file || 'N/A'}</dd></div>
            </dl>

            <div className="mb-4">
              <div className="mb-1 flex items-center justify-between">
                <h3 className="text-sm font-semibold text-slate-100">stdout</h3>
                <Button onClick={async () => {
                  await navigator.clipboard.writeText(selectedTimelineEntry.stdout || '');
                  props.onNotice('stdout copied to clipboard');
                }} size="sm" variant="ghost">Copy stdout</Button>
              </div>
              <pre className="max-h-64 overflow-y-auto rounded-md border border-slate-800 bg-slate-900 p-3 font-mono text-[11px] whitespace-pre-wrap break-words text-slate-100">{selectedTimelineEntry.stdout || '(empty)'}</pre>
            </div>

            <div>
              <div className="mb-1 flex items-center justify-between">
                <h3 className="text-sm font-semibold text-slate-100">stderr</h3>
                <Button onClick={async () => {
                  await navigator.clipboard.writeText(selectedTimelineEntry.stderr || '');
                  props.onNotice('stderr copied to clipboard');
                }} size="sm" variant="ghost">Copy stderr</Button>
              </div>
              <pre className="max-h-64 overflow-y-auto rounded-md border border-rose-800/60 bg-rose-950/40 p-3 font-mono text-[11px] whitespace-pre-wrap break-words text-rose-200">{selectedTimelineEntry.stderr || '(empty)'}</pre>
            </div>
          </>
        )}
      </Modal>
    </>
  );
}
