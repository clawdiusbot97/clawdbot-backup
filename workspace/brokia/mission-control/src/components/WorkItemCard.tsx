'use client';

import { CSS } from '@dnd-kit/utilities';
import { useDraggable } from '@dnd-kit/core';
import { WorkItem } from '@/types/workitem';
import { Card } from '@/components/ui/Card';
import { cn } from '@/components/ui/cn';

interface WorkItemCardProps {
  item: WorkItem;
  onClick?: (item: WorkItem) => void;
  canDrag?: boolean;
  isDragging?: boolean;
  runState?: { agent: string };
  onBlockedDragAttempt?: (item: WorkItem) => void;
  displayId?: string;
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
    case 'p0': return 'bg-rose-950/80 text-rose-200 border-rose-700/70';
    case 'p1': return 'bg-orange-950/80 text-orange-200 border-orange-700/70';
    case 'p2': return 'bg-amber-950/80 text-amber-200 border-amber-700/70';
    case 'p3': return 'bg-sky-950/80 text-sky-200 border-sky-700/70';
    default: return 'bg-slate-900 text-slate-300 border-slate-700';
  }
}

function getTypeBadgeColor(type: string): string {
  switch (type) {
    case 'idea': return 'bg-violet-600/20 text-violet-300 border border-violet-500/40';
    case 'research': return 'bg-cyan-600/20 text-cyan-300 border border-cyan-500/40';
    case 'requirement': return 'bg-blue-600/20 text-blue-300 border border-blue-500/40';
    case 'feature': return 'bg-emerald-600/20 text-emerald-300 border border-emerald-500/40';
    case 'risk': return 'bg-rose-600/20 text-rose-300 border border-rose-500/40';
    case 'decision': return 'bg-fuchsia-600/20 text-fuchsia-300 border border-fuchsia-500/40';
    case 'solution': return 'bg-amber-600/20 text-amber-300 border border-amber-500/40';
    default: return 'bg-slate-800 text-slate-300 border border-slate-700';
  }
}

export function WorkItemCard({
  item,
  onClick,
  canDrag = false,
  isDragging = false,
  runState,
  onBlockedDragAttempt,
  displayId,
}: WorkItemCardProps) {
  const visibleTags = item.tags.slice(0, 6);
  const hiddenTagCount = Math.max(0, item.tags.length - 6);

  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: item.id,
    data: { item },
    disabled: !canDrag,
  });

  const style = {
    transform: CSS.Translate.toString(transform),
  };

  const reportIcons = [
    { key: 'clarification', label: 'C', active: item.reports.clarification },
    { key: 'tech', label: 'T', active: item.reports.tech },
    { key: 'cost', label: '$', active: item.reports.cost },
    { key: 'product', label: 'P', active: item.reports.product },
    { key: 'arch', label: 'A', active: item.reports.arch },
  ] as const;

  const displayIdLabel = displayId ?? item.id;

  return (
    <Card
      ref={setNodeRef}
      style={style}
      className={cn(
        'cursor-pointer p-3 transition hover:border-indigo-400/60 hover:bg-slate-900',
        canDrag && 'active:cursor-grabbing',
        isDragging && 'opacity-40'
      )}
      onClick={() => onClick?.(item)}
      onPointerDown={() => {
        if (!canDrag && runState) {
          onBlockedDragAttempt?.(item);
        }
      }}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          onClick?.(item);
        }
      }}
    >
      <div className="mb-2 flex items-start justify-between gap-2">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-widest text-slate-500">{displayIdLabel}</p>
          <p className="text-xs text-slate-400">{item.id}</p>
        </div>
        <div className="flex items-center gap-1">
          {canDrag && (
            <span
              className="cursor-grab rounded border border-slate-700 bg-slate-800 px-1 py-0.5 text-[10px] text-slate-300 active:cursor-grabbing"
              title="Drag to move"
              {...attributes}
              {...listeners}
            >
              ::
            </span>
          )}
          {runState && (
            <span className="animate-pulse rounded-full border border-amber-500/60 bg-amber-900/60 px-2 py-0.5 text-[10px] font-medium text-amber-200" title={`Taken by ${runState.agent}`}>
              Running · {runState.agent}
            </span>
          )}
          <span className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${getTypeBadgeColor(item.type)}`}>
            {item.type}
          </span>
        </div>
      </div>

      <h3 className="mb-3 line-clamp-2 text-sm font-medium text-slate-100" title={item.title}>
        {item.title}
      </h3>

      <div className="mb-2 flex items-center gap-2">
        <span className={`rounded border px-2 py-0.5 text-xs ${getPriorityColor(item.priority)}`}>
          {item.priority}
        </span>
        <span className="truncate text-xs text-slate-400" title={item.owner}>
          @{item.owner}
        </span>
      </div>

      {item.tags.length > 0 && (
        <div className="mb-2 flex flex-wrap gap-1">
          {visibleTags.map((tag) => (
            <span
              key={tag}
              className="rounded border border-slate-700 bg-slate-800 px-1.5 py-0.5 text-xs text-slate-300"
            >
              {tag}
            </span>
          ))}
          {hiddenTagCount > 0 && (
            <span className="rounded border border-slate-700 bg-slate-800 px-1.5 py-0.5 text-xs text-slate-400">
              +{hiddenTagCount}
            </span>
          )}
        </div>
      )}

      <div className="flex items-center justify-between border-t border-slate-800 pt-2">
        <span className="text-xs text-slate-500">
          {formatRelativeTime(item.updated_at)}
        </span>

        <div className="flex items-center gap-1.5">
          {item.needs_clarification && (
            <span
              className="flex h-4 w-4 items-center justify-center rounded-full bg-amber-400 text-[8px] font-bold text-black"
              title="Needs clarification"
            >
              ?
            </span>
          )}
          {item.implementation_approved && (
            <span
              className="flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500 text-[8px] font-bold text-white"
              title="Implementation approved"
            >
              ✓
            </span>
          )}

          <div className="ml-1 flex items-center gap-0.5">
            {reportIcons.map((report) => (
              <span
                key={report.key}
                className={`flex h-3 w-3 items-center justify-center rounded text-[6px] font-bold ${
                  report.active
                    ? 'bg-indigo-500 text-white'
                    : 'bg-slate-700 text-slate-400'
                }`}
                title={`${report.key} report`}
              >
                {report.label}
              </span>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
}
