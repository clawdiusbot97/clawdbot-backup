'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { Filters, KANBAN_COLUMNS, KanbanColumn, WorkItem } from '@/types/workitem';
import { buildIndexByType, displayIdForItem } from '@/components/board/displayId';
import { BoardHeader } from '@/components/board/BoardHeader';
import { DndKitBoard } from '@/components/board/DndKitBoard';
import { FiltersBar } from '@/components/board/FiltersBar';
import { DrawerPanel } from '@/components/board/DrawerPanel';
import { ReportModal } from '@/components/board/ReportModal';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Field } from '@/components/ui/Field';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { Select } from '@/components/ui/Select';
import { canDragWorkItem } from '@/components/board/canDrag';
import { useWorkitems } from './hooks/useWorkitems';
import { useLogs } from './hooks/useLogs';
import { useReports } from './hooks/useReports';
import { useActions } from './hooks/useActions';

const CREATE_TYPES = ['idea', 'requirement', 'feature', 'blocker', 'decision', 'risk', 'research', 'solution'] as const;
const PRIORITIES = ['p0', 'p1', 'p2', 'p3'] as const;

type Notice = { kind: 'success' | 'error'; text: string } | null;

interface CreateForm { type: string; title: string; priority: string; }
interface EditForm { owner: string; priority: string; addTag: string; removeTag: string; costEstimate: string; }

function parseApiError(error: unknown): string {
  return error instanceof Error ? error.message : 'Unknown error';
}

export default function BoardPage() {
  const { data, loading, error, refresh, replaceData } = useWorkitems();
  const { itemLogs, runningById, logsLoading, fetchItemLogs, fetchRunningStates, clearSelectedItemLogs } = useLogs();
  const { reports, reportsLoading, reportLoadingName, openReport, fetchReports, loadReport, clearReports, closeReport } = useReports();

  const [filters, setFilters] = useState<Filters>({ search: '', type: '', owner: '', tag: '', needsClarification: false, showDropped: false });
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [notice, setNotice] = useState<Notice>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [moveTarget, setMoveTarget] = useState<KanbanColumn>('NEW');
  const [dropReason, setDropReason] = useState('');
  const [draggingItem, setDraggingItem] = useState<WorkItem | null>(null);
  const [dragOverColumn, setDragOverColumn] = useState<KanbanColumn | null>(null);
  const [optimisticStatus, setOptimisticStatus] = useState<Record<string, KanbanColumn>>({});

  const [createForm, setCreateForm] = useState<CreateForm>({ type: 'idea', title: '', priority: 'p2' });
  const [editForm, setEditForm] = useState<EditForm>({ owner: '', priority: 'p2', addTag: '', removeTag: '', costEstimate: '' });

  const refreshItemAndReports = useCallback(async () => {
    if (!selectedItemId) return;
    await fetchItemLogs(selectedItemId);
    await fetchReports(selectedItemId);
  }, [fetchItemLogs, fetchReports, selectedItemId]);

  const { actionLoading, notice: actionNotice, create, clarify, research, confirm, move, drop, update, refreshBoard } = useActions({
    selectedItemId,
    onSuccess: async (nextData) => {
      replaceData(nextData);
      await refreshItemAndReports();
    },
  });

  useEffect(() => { refresh(); }, [refresh]);
  useEffect(() => { if (data?.items) fetchRunningStates(data.items); }, [data?.items, fetchRunningStates]);
  useEffect(() => {
    if (selectedItemId) {
      fetchItemLogs(selectedItemId);
      fetchReports(selectedItemId);
    } else {
      clearSelectedItemLogs();
      clearReports();
    }
  }, [selectedItemId, fetchItemLogs, fetchReports, clearSelectedItemLogs, clearReports]);

  useEffect(() => {
    if (actionNotice) setNotice(actionNotice as Notice);
  }, [actionNotice]);

  const selectedItem = useMemo(() => (selectedItemId && data?.items ? data.items.find((item) => item.id === selectedItemId) || null : null), [data?.items, selectedItemId]);

  useEffect(() => {
    if (!selectedItem) return;
    if (KANBAN_COLUMNS.includes(selectedItem.status as KanbanColumn)) setMoveTarget(selectedItem.status as KanbanColumn);
    setEditForm({
      owner: selectedItem.owner,
      priority: selectedItem.priority,
      addTag: '',
      removeTag: '',
      costEstimate: selectedItem.cost_estimate_usd_month !== null && selectedItem.cost_estimate_usd_month !== undefined ? String(selectedItem.cost_estimate_usd_month) : '',
    });
  }, [selectedItem]);

  const { availableTypes, availableOwners, availableTags } = useMemo(() => {
    if (!data?.items) return { availableTypes: [], availableOwners: [], availableTags: [] };
    return {
      availableTypes: [...new Set(data.items.map((item) => item.type))].sort(),
      availableOwners: [...new Set(data.items.map((item) => item.owner))].sort(),
      availableTags: [...new Set(data.items.flatMap((item) => item.tags))].sort(),
    };
  }, [data?.items]);

  const indexByType = useMemo(() => buildIndexByType(data?.items ?? []), [data?.items]);

  const filteredItems = useMemo(() => {
    if (!data?.items) return [];
    return data.items.filter((item) => {
      if (filters.search) {
        const q = filters.search.toLowerCase();
        const displayId = displayIdForItem(item, indexByType).toLowerCase();
        if (!item.id.toLowerCase().includes(q) && !displayId.includes(q) && !item.title.toLowerCase().includes(q)) return false;
      }
      if (filters.type && item.type !== filters.type) return false;
      if (filters.owner && item.owner !== filters.owner) return false;
      if (filters.tag && !item.tags.includes(filters.tag)) return false;
      if (filters.needsClarification && !item.needs_clarification) return false;
      if (!filters.showDropped && item.status === 'DROPPED') return false;
      return true;
    });
  }, [data?.items, filters, indexByType]);

  const boardColumns: readonly KanbanColumn[] = filters.showDropped ? KANBAN_COLUMNS : KANBAN_COLUMNS.filter((column) => column !== 'DROPPED');

  const itemsByColumn = useMemo(() => {
    const grouped: Record<KanbanColumn, WorkItem[]> = { NEW: [], RESEARCHING: [], RESEARCHED: [], DECIDED: [], PLANNED: [], BUILDING: [], DONE: [], DROPPED: [] };
    for (const item of filteredItems) {
      const effectiveStatus = optimisticStatus[item.id] ?? (item.status as KanbanColumn);
      grouped[KANBAN_COLUMNS.includes(effectiveStatus) ? effectiveStatus : 'NEW'].push(item);
    }
    return grouped;
  }, [filteredItems, optimisticStatus]);

  const handleCreate = async () => {
    if (!createForm.title.trim()) return setNotice({ kind: 'error', text: 'Title is required' });
    const result = await create({ type: createForm.type, title: createForm.title.trim(), priority: createForm.priority });
    if (result?.success) {
      setCreateForm({ type: 'idea', title: '', priority: 'p2' });
      setIsCreateOpen(false);
      if (result.id) setSelectedItemId(result.id);
    }
  };

  const handleUpdate = async () => {
    if (!selectedItem) return;
    const patch: Record<string, string | number> = {};
    if (editForm.owner.trim() && editForm.owner.trim() !== selectedItem.owner) patch.owner = editForm.owner.trim();
    if (editForm.priority.trim() && editForm.priority.trim() !== selectedItem.priority) patch.priority = editForm.priority.trim();
    if (editForm.addTag.trim()) patch.add_tag = editForm.addTag.trim();
    if (editForm.removeTag.trim()) patch.remove_tag = editForm.removeTag.trim();
    if (editForm.costEstimate.trim()) patch.cost_estimate_usd_month = editForm.costEstimate.trim();
    if (!Object.keys(patch).length) return setNotice({ kind: 'error', text: 'No update changes provided' });
    const result = await update(selectedItem.id, patch);
    if (result?.success) setIsEditOpen(false);
  };

  const handleDelete = async () => {
    if (!selectedItem) return;
    try {
      const response = await fetch(`/api/workitems?id=${encodeURIComponent(selectedItem.id)}`, { method: 'DELETE' });
      const result = await response.json();
      if (result.success) {
        setNotice({ kind: 'success', text: result.message || 'Workitem deleted' });
        setSelectedItemId(null);
        await refresh();
      } else {
        const blocked = result?.blocked_by_guardrail ? ' (blocked by guardrail)' : '';
        setNotice({ kind: 'error', text: `${result.message || 'Delete failed'}${blocked}` });
      }
    } catch (err) {
      setNotice({ kind: 'error', text: parseApiError(err) });
    }
  };

  const handleOpenReport = async (name: string) => {
    if (!selectedItem) return;
    try {
      const report = await loadReport(selectedItem.id, name);
      if (!report) setNotice({ kind: 'error', text: 'Failed to open report' });
    } catch (err) {
      setNotice({ kind: 'error', text: parseApiError(err) });
    }
  };

  const handleColumnDrop = async (to: KanbanColumn) => {
    if (!draggingItem) return;
    const from = (optimisticStatus[draggingItem.id] ?? draggingItem.status) as KanbanColumn;
    if (from === to) return setDraggingItem(null);
    setOptimisticStatus((prev) => ({ ...prev, [draggingItem.id]: to }));
    const result = await move(draggingItem.id, to);
    if (!result?.success) {
      setOptimisticStatus((prev) => {
        const next = { ...prev };
        delete next[draggingItem.id];
        return next;
      });
    }
    setDraggingItem(null);
    setDragOverColumn(null);
  };

  const allowedActions = new Set(selectedItem?.allowed_actions ?? []);
  const reportsSuggestClarified = reports.some((file) => /clarif/i.test(file.name));
  const isAlreadyClarified = Boolean(selectedItem && (selectedItem.clarification_status && selectedItem.clarification_status !== 'PENDING' || reportsSuggestClarified));
  const selectedDisplayId = selectedItem ? displayIdForItem(selectedItem, indexByType) : undefined;

  if (loading && !data) return <div className="min-h-screen bg-slate-950 p-4" />;
  if (error && !data) return <div className="min-h-screen bg-slate-950 p-4"><div className="max-w-[1600px] mx-auto"><Card className="border-rose-700/50 bg-rose-950/20 p-4 text-rose-200"><p className="font-medium">Error loading work items</p><p className="mt-1 text-sm">{error}</p><Button onClick={refresh} className="mt-3" variant="danger">Retry</Button></Card></div></div>;

  return (
    <div className="min-h-screen bg-slate-950 p-4">
      <div className="mx-auto max-w-[1600px]">
        <BoardHeader filteredCount={filteredItems.length} totalCount={data?.total_items || 0} refreshing={actionLoading === 'refresh'} onCreate={() => setIsCreateOpen(true)} onRefresh={refreshBoard} />
        <FiltersBar filters={filters} availableTypes={availableTypes} availableOwners={availableOwners} availableTags={availableTags} loading={loading || actionLoading === 'refresh'} onChange={setFilters} onRefresh={refreshBoard} />

        <DndKitBoard
          itemsByColumn={itemsByColumn}
          dragOverColumn={dragOverColumn}
          draggingItem={draggingItem}
          runningById={runningById}
          columns={boardColumns}
          getDisplayId={(item) => displayIdForItem(item, indexByType)}
          onCardClick={(item) => { setSelectedItemId(item.id); setDropReason(''); }}
          onDragStartCard={(item) => {
            const runState = runningById[item.id];
            if (!canDragWorkItem(item, runState)) return;
            setDraggingItem(item);
          }}
          onDragEndCard={() => { setDraggingItem(null); setDragOverColumn(null); }}
          onDropColumn={handleColumnDrop}
          onBlockedDragAttempt={(item) => {
            const runState = runningById[item.id];
            setNotice({ kind: 'error', text: runState ? `Cannot move: item is being processed by ${runState.agent}` : `${item.id} cannot be moved` });
          }}
          setDragOverColumn={setDragOverColumn}
        />
      </div>

      <DrawerPanel
        selectedItem={selectedItem}
        selectedDisplayId={selectedDisplayId}
        open={Boolean(selectedItem)}
        canClarify={allowedActions.has('clarify')}
        clarifyDisabledReason={isAlreadyClarified ? 'Already clarified' : undefined}
        canConfirm={allowedActions.has('confirm')}
        canMove={allowedActions.has('move')}
        canUpdate={allowedActions.has('update')}
        canDrop={allowedActions.has('drop') || allowedActions.has('move')}
        canDelete={selectedItem?.status === 'DROPPED'}
        actionLoading={actionLoading}
        reportsLoading={reportsLoading}
        reportLoadingName={reportLoadingName}
        reports={reports}
        logs={itemLogs}
        runningState={selectedItem ? runningById[selectedItem.id] : undefined}
        logsLoading={logsLoading}
        moveTarget={moveTarget}
        dropReason={dropReason}
        onClose={() => { setSelectedItemId(null); setDropReason(''); setIsEditOpen(false); }}
        onOpenEdit={() => setIsEditOpen(true)}
        onClarify={() => selectedItem && clarify(selectedItem.id)}
        onConfirm={(plan) => selectedItem && confirm(selectedItem.id, plan)}
        onMove={() => selectedItem && move(selectedItem.id, moveTarget)}
        onDrop={() => selectedItem && drop(selectedItem.id, dropReason.trim() || undefined)}
        onDelete={handleDelete}
        onResearch={() => selectedItem && research(selectedItem.id)}
        onMoveTargetChange={setMoveTarget}
        onDropReasonChange={setDropReason}
        onReportOpen={handleOpenReport}
        onNotice={(text) => setNotice({ kind: 'success', text })}
      />

      <ReportModal report={openReport} onClose={closeReport} />

      {notice && <div className={`fixed bottom-4 right-4 z-[80] max-w-md rounded-lg border px-4 py-3 text-sm shadow-lg ${notice.kind === 'success' ? 'border-emerald-700/60 bg-emerald-950/80 text-emerald-200' : 'border-rose-700/60 bg-rose-950/80 text-rose-200'}`}>{notice.text}</div>}

      <Modal open={isCreateOpen} onClose={() => setIsCreateOpen(false)} title="Create work item" className="max-w-lg">
        <div className="space-y-3">
          <Field label="Type"><Select value={createForm.type} onChange={(e) => setCreateForm((prev) => ({ ...prev, type: e.target.value }))}>{CREATE_TYPES.map((type) => <option key={type} value={type}>{type}</option>)}</Select></Field>
          <Field label="Title"><Input type="text" value={createForm.title} onChange={(e) => setCreateForm((prev) => ({ ...prev, title: e.target.value }))} placeholder="Describe the work item" /></Field>
          <Field label="Priority"><Select value={createForm.priority} onChange={(e) => setCreateForm((prev) => ({ ...prev, priority: e.target.value }))}>{PRIORITIES.map((p) => <option key={p} value={p}>{p}</option>)}</Select></Field>
        </div>
        <div className="mt-5 flex justify-end gap-2"><Button onClick={() => setIsCreateOpen(false)} variant="ghost">Cancel</Button><Button onClick={handleCreate} loading={actionLoading === 'create'} variant="primary">{actionLoading === 'create' ? 'Creating...' : 'Create'}</Button></div>
      </Modal>

      {selectedItem && (
        <Modal open={isEditOpen} onClose={() => setIsEditOpen(false)} title={`Update ${selectedItem.id}`} className="max-w-lg">
          <div className="space-y-3">
            <Field label="Owner"><Input type="text" value={editForm.owner} onChange={(e) => setEditForm((prev) => ({ ...prev, owner: e.target.value }))} /></Field>
            <Field label="Priority"><Select value={editForm.priority} onChange={(e) => setEditForm((prev) => ({ ...prev, priority: e.target.value }))}>{PRIORITIES.map((p) => <option key={p} value={p}>{p}</option>)}</Select></Field>
            <Field label="Add tag"><Input type="text" value={editForm.addTag} onChange={(e) => setEditForm((prev) => ({ ...prev, addTag: e.target.value }))} placeholder="example: urgent" /></Field>
            <Field label="Remove tag"><Input type="text" value={editForm.removeTag} onChange={(e) => setEditForm((prev) => ({ ...prev, removeTag: e.target.value }))} placeholder="example: deprecated" /></Field>
            <Field label="Cost estimate (USD / month)"><Input type="number" min={0} step="0.01" value={editForm.costEstimate} onChange={(e) => setEditForm((prev) => ({ ...prev, costEstimate: e.target.value }))} /></Field>
          </div>
          <div className="mt-5 flex justify-end gap-2"><Button onClick={() => setIsEditOpen(false)} variant="ghost">Cancel</Button><Button onClick={handleUpdate} loading={actionLoading === 'update'} variant="secondary">{actionLoading === 'update' ? 'Updating...' : 'Save'}</Button></div>
        </Modal>
      )}
    </div>
  );
}
