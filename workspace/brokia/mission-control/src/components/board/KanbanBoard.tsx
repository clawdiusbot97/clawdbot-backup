import { Dispatch, SetStateAction } from 'react';
import { KanbanColumn, RunningState, WorkItem } from '@/types/workitem';
import { DndKitBoard } from '@/components/board/DndKitBoard';

interface KanbanBoardProps {
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
}

export function KanbanBoard(props: KanbanBoardProps) {
  return <DndKitBoard {...props} />;
}
