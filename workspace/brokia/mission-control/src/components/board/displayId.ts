import { WorkItem } from '@/types/workitem';

export interface IndexByType {
  [type: string]: string[];
}

export function buildIndexByType(items: WorkItem[]): IndexByType {
  const groups = new Map<string, { item: WorkItem; order: number }[]>();

  items.forEach((item, index) => {
    const type = item.type || 'unknown';
    if (!groups.has(type)) {
      groups.set(type, []);
    }
    groups.get(type)?.push({ item, order: index });
  });

  const indexByType: IndexByType = {};

  for (const [type, entries] of groups.entries()) {
    const sorted = [...entries].sort((a, b) => {
      if (a.item.created_at && b.item.created_at) {
        return a.item.created_at.localeCompare(b.item.created_at);
      }
      if (a.item.created_at) return -1;
      if (b.item.created_at) return 1;
      return a.order - b.order;
    });

    indexByType[type] = sorted.map((entry) => entry.item.id);
  }

  return indexByType;
}

function padCounter(value: number): string {
  return String(value).padStart(2, '0');
}

export function displayIdForItem(item: WorkItem, indexByType: IndexByType): string {
  const typeList = indexByType[item.type] || [];
  const position = typeList.indexOf(item.id);
  const prefix = item.type ? item.type.charAt(0).toUpperCase() : 'X';
  if (position >= 0) {
    return `${prefix}-${padCounter(position + 1)}`;
  }
  return `${prefix}-??`;
}
