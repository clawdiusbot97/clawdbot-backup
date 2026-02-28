import { KanbanColumn } from '@/types/workitem';

export function getColumnColor(column: KanbanColumn): string {
  switch (column) {
    case 'NEW': return 'bg-slate-950/60 border-slate-800';
    case 'RESEARCHING': return 'bg-blue-950/30 border-blue-800/60';
    case 'RESEARCHED': return 'bg-indigo-950/30 border-indigo-800/60';
    case 'DECIDED': return 'bg-violet-950/30 border-violet-800/60';
    case 'PLANNED': return 'bg-amber-950/25 border-amber-800/50';
    case 'BUILDING': return 'bg-orange-950/25 border-orange-800/50';
    case 'DONE': return 'bg-emerald-950/30 border-emerald-800/60';
    case 'DROPPED': return 'bg-rose-950/30 border-rose-800/60';
    default: return 'bg-slate-950/60 border-slate-800';
  }
}

export function getColumnHeaderColor(column: KanbanColumn): string {
  switch (column) {
    case 'NEW': return 'text-slate-200 bg-slate-900/80';
    case 'RESEARCHING': return 'text-blue-200 bg-blue-900/40';
    case 'RESEARCHED': return 'text-indigo-200 bg-indigo-900/40';
    case 'DECIDED': return 'text-violet-200 bg-violet-900/40';
    case 'PLANNED': return 'text-amber-200 bg-amber-900/40';
    case 'BUILDING': return 'text-orange-200 bg-orange-900/40';
    case 'DONE': return 'text-emerald-200 bg-emerald-900/40';
    case 'DROPPED': return 'text-rose-200 bg-rose-900/40';
    default: return 'text-slate-200 bg-slate-900/80';
  }
}
