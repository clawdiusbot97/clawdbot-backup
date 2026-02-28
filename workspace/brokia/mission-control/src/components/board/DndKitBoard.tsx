import { Dispatch, SetStateAction } from 'react';
import { DndContext, DragEndEvent, DragOverEvent, DragStartEvent } from '@dnd-kit/core';
import { KANBAN_COLUMNS, KanbanColumn, RunningState, WorkItem } from '@/types/workitem';
import { KanbanColumnView } from '@/components/board/KanbanColumnView';
import { canDragWorkItem } from '@/components/board/canDrag';

interface DndKitBoardProps {
  itemsByColumn: Record<KanbanColumn, WorkItem[]>;
  dragOverColumn: KanbanColumn | null;
  draggingItem: WorkItem | null;
  runningById: Record<string, RunningState | undefined>;
  onCardClick: (item: WorkItem) => void;
  onDragStartCard: (item: WorkItem) => void;
  onDragEndCard: () => void;
  onDropColumn: (column: KanbanColumn) => void;
  onBlockedDragAttempt: (item: WorkItem) => void;
  setDragOverColumn: Dispatch<SetStateAction<KanbanColumn | null>>;
  columns?: readonly KanbanColumn[];
  getDisplayId?: (item: WorkItem) => string;
}

export function DndKitBoard({
  itemsByColumn,
  dragOverColumn: _dragOverColumn,
  draggingItem,
  runningById,
  onCardClick,
  onDragStartCard,
  onDragEndCard,
  onDropColumn,
  onBlockedDragAttempt,
  setDragOverColumn,
  columns,
  getDisplayId,
}: DndKitBoardProps) {
  void _dragOverColumn;

  const handleDragStart = (event: DragStartEvent) => {
    const item = event.active.data.current?.item as WorkItem | undefined;
    if (!item) return;

    if (!canDragWorkItem(item, runningById[item.id])) {
      onBlockedDragAttempt(item);
      return;
    }

    onDragStartCard(item);
  };

  const handleDragOver = (event: DragOverEvent) => {
    const overId = event.over?.id;
    if (!overId) {
      setDragOverColumn(null);
      return;
    }

    const maybeColumn = String(overId) as KanbanColumn;
    if (KANBAN_COLUMNS.includes(maybeColumn)) {
      setDragOverColumn(maybeColumn);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const overId = event.over?.id;

    if (overId) {
      const maybeColumn = String(overId) as KanbanColumn;
      if (KANBAN_COLUMNS.includes(maybeColumn)) {
        onDropColumn(maybeColumn);
      }
    }

    setDragOverColumn(null);
    onDragEndCard();
  };

  return (
    <DndContext onDragStart={handleDragStart} onDragOver={handleDragOver} onDragEnd={handleDragEnd}>
      <div className="flex gap-4 overflow-x-auto pb-4">
        {(columns ?? KANBAN_COLUMNS).map((column) => (
          <KanbanColumnView
            key={column}
            column={column}
            items={itemsByColumn[column]}
            draggingItem={draggingItem}
            isDragging={Boolean(draggingItem)}
            runningById={runningById}
            onCardClick={onCardClick}
            onBlockedDragAttempt={onBlockedDragAttempt}
            getDisplayId={getDisplayId}
          />
        ))}
      </div>
    </DndContext>
  );
}
