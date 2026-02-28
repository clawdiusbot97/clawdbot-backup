import { useDroppable } from '@dnd-kit/core';
import { WorkItem, KanbanColumn, RunningState } from '@/types/workitem';
import { WorkItemCard } from '@/components/WorkItemCard';
import { getColumnColor, getColumnHeaderColor } from '@/components/board/kanbanTheme';
import { canDragWorkItem } from '@/components/board/canDrag';

interface KanbanColumnViewProps {
  column: KanbanColumn;
  items: WorkItem[];
  draggingItem: WorkItem | null;
  isDragging: boolean;
  runningById: Record<string, RunningState | undefined>;
  onCardClick: (item: WorkItem) => void;
  onBlockedDragAttempt: (item: WorkItem) => void;
  getDisplayId?: (item: WorkItem) => string;
}

export function KanbanColumnView({
  column,
  items,
  draggingItem,
  isDragging,
  onCardClick,
  runningById,
  onBlockedDragAttempt,
  getDisplayId,
}: KanbanColumnViewProps) {
  const { isOver, setNodeRef } = useDroppable({
    id: column,
    data: { column },
  });

  return (
    <div
      ref={setNodeRef}
      className={`flex-shrink-0 w-72 rounded-lg border ${getColumnColor(column)} flex flex-col max-h-[calc(100vh-220px)] ${
        isOver ? 'ring-2 ring-indigo-400 ring-offset-1 ring-offset-slate-950' : ''
      }`}
    >
      <div className={`px-3 py-2 rounded-t-lg flex items-center justify-between ${getColumnHeaderColor(column)}`}>
        <span className="text-sm font-semibold">{column}</span>
        <span className="rounded-full bg-black/30 px-2 py-0.5 text-xs font-medium">
          {items.length}
        </span>
      </div>

      <div className="flex-1 space-y-2 overflow-y-auto p-2">
        {items.length === 0 ? (
          <div className="py-8 text-center text-sm text-slate-500">
            {draggingItem ? 'Drop here' : 'No items'}
          </div>
        ) : (
          items.map((item) => {
            const runState = runningById[item.id];
            const canDrag = canDragWorkItem(item, runState);
            return (
              <WorkItemCard
                key={item.id}
                item={item}
                onClick={onCardClick}
                canDrag={canDrag}
                runState={runState}
                onBlockedDragAttempt={onBlockedDragAttempt}
                isDragging={isDragging && draggingItem?.id === item.id}
                displayId={getDisplayId?.(item)}
              />
            );
          })
        )}
      </div>
    </div>
  );
}
