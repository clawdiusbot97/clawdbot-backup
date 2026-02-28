import { Button } from '@/components/ui/Button';

interface BoardHeaderProps {
  filteredCount: number;
  totalCount: number;
  refreshing: boolean;
  onCreate: () => void;
  onRefresh: () => void;
}

export function BoardHeader({ filteredCount, totalCount, refreshing, onCreate, onRefresh }: BoardHeaderProps) {
  return (
    <div className="mb-4 flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-bold text-slate-100">Mission Control</h1>
        <p className="text-sm text-slate-400">
          {filteredCount} of {totalCount} items
          {filteredCount !== totalCount && ' (filtered)'}
        </p>
      </div>

      <div className="flex items-center gap-2">
        <Button onClick={onCreate} variant="primary">
          + Create
        </Button>
        <Button onClick={onRefresh} loading={refreshing} variant="secondary">
          {refreshing ? 'Refreshing...' : 'Refresh Export'}
        </Button>
      </div>
    </div>
  );
}
