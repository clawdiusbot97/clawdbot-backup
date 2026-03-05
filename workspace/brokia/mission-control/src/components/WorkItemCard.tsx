'use client';

import { WorkItem } from '@/types/workitem';

interface WorkItemCardProps {
  item: WorkItem;
  onClick?: (item: WorkItem) => void;
  draggable?: boolean;
  onDragStart?: (item: WorkItem) => void;
  onDragEnd?: () => void;
  runState?: { agent: string };
  onBlockedDragAttempt?: (item: WorkItem) => void;
}

function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffMins < 1) return 'just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function getPriorityColor(priority: string): string {
  switch (priority) {
    case 'p0': return 'bg-red-100 text-red-800 border-red-200';
    case 'p1': return 'bg-orange-100 text-orange-800 border-orange-200';
    case 'p2': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case 'p3': return 'bg-blue-100 text-blue-800 border-blue-200';
    default: return 'bg-gray-100 text-gray-800 border-gray-200';
  }
}

function getTypeBadgeColor(type: string): string {
  switch (type) {
    case 'idea': return 'bg-purple-100 text-purple-800';
    case 'research': return 'bg-blue-100 text-blue-800';
    case 'experiment': return 'bg-green-100 text-green-800';
    case 'spike': return 'bg-pink-100 text-pink-800';
    case 'story': return 'bg-indigo-100 text-indigo-800';
    case 'task': return 'bg-gray-100 text-gray-800';
    case 'epic': return 'bg-amber-100 text-amber-800';
    default: return 'bg-gray-100 text-gray-800';
  }
}

export function WorkItemCard({ item, onClick, draggable = false, onDragStart, onDragEnd }: WorkItemCardProps) {
  const visibleTags = item.tags.slice(0, 6);
  const hiddenTagCount = Math.max(0, item.tags.length - 6);

  const reportIcons = [
    { key: 'clarification', label: 'C', active: item.reports.clarification },
    { key: 'tech', label: 'T', active: item.reports.tech },
    { key: 'cost', label: '$', active: item.reports.cost },
    { key: 'product', label: 'P', active: item.reports.product },
    { key: 'arch', label: 'A', active: item.reports.arch },
  ] as const;

  return (
    <div
      className={`bg-white rounded-lg border border-gray-200 p-3 hover:shadow-md transition-shadow cursor-pointer ${
        draggable ? 'active:cursor-grabbing' : ''
      }`}
      onClick={() => onClick?.(item)}
      role="button"
      tabIndex={0}
      draggable={draggable}
      onDragStart={() => onDragStart?.(item)}
      onDragEnd={onDragEnd}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          onClick?.(item);
        }
      }}
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <span className="text-xs font-mono text-gray-500 truncate" title={item.id}>
          {item.id}
        </span>
        <span className={`text-xs px-2 py-0.5 rounded-full font-medium shrink-0 ${getTypeBadgeColor(item.type)}`}>
          {item.type}
        </span>
      </div>

      <h3 className="text-sm font-medium text-gray-900 mb-3 line-clamp-2" title={item.title}>
        {item.title}
      </h3>

      <div className="flex items-center gap-2 mb-2">
        <span className={`text-xs px-2 py-0.5 rounded border ${getPriorityColor(item.priority)}`}>
          {item.priority}
        </span>
        <span className="text-xs text-gray-600 truncate" title={item.owner}>
          @{item.owner}
        </span>
      </div>

      {item.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-2">
          {visibleTags.map((tag) => (
            <span
              key={tag}
              className="text-xs px-1.5 py-0.5 bg-gray-100 text-gray-600 rounded"
            >
              {tag}
            </span>
          ))}
          {hiddenTagCount > 0 && (
            <span className="text-xs px-1.5 py-0.5 bg-gray-100 text-gray-500 rounded">
              +{hiddenTagCount}
            </span>
          )}
        </div>
      )}

      <div className="flex items-center justify-between pt-2 border-t border-gray-100">
        <span className="text-xs text-gray-400">
          {formatRelativeTime(item.updated_at)}
        </span>

        <div className="flex items-center gap-1.5">
          {item.needs_clarification && (
            <span
              className="w-4 h-4 rounded-full bg-yellow-400 flex items-center justify-center text-[8px] text-white font-bold"
              title="Needs clarification"
            >
              ?
            </span>
          )}
          {item.implementation_approved && (
            <span
              className="w-4 h-4 rounded-full bg-green-500 flex items-center justify-center text-[8px] text-white font-bold"
              title="Implementation approved"
            >
              ✓
            </span>
          )}

          <div className="flex items-center gap-0.5 ml-1">
            {reportIcons.map((report) => (
              <span
                key={report.key}
                className={`w-3 h-3 rounded text-[6px] flex items-center justify-center font-bold ${
                  report.active
                    ? 'bg-indigo-500 text-white'
                    : 'bg-gray-200 text-gray-400'
                }`}
                title={`${report.key} report`}
              >
                {report.label}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
