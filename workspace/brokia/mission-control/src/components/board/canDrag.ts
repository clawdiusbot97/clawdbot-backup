import { RunningState, WorkItem } from '@/types/workitem';

const DND_DENYLIST_STATUSES = new Set([
  'RESEARCHING',
  'RESEARCHED',
  'DECIDED',
  'PLANNED',
  'BUILDING',
  'DONE',
  'DROPPED',
]);

export function canDragWorkItem(item: WorkItem, runState?: RunningState): boolean {
  if (runState) return false;
  if (DND_DENYLIST_STATUSES.has(item.status)) return false;
  if (!item.allowed_actions.includes('move') && !item.allowed_actions.includes('drop')) return false;
  return true;
}

