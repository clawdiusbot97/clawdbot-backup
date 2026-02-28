'use client';

import { Filters } from '@/types/workitem';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Field } from '@/components/ui/Field';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';

interface FiltersBarProps {
  filters: Filters;
  availableTypes: string[];
  availableOwners: string[];
  availableTags: string[];
  loading?: boolean;
  onChange: (filters: Filters) => void;
  onRefresh: () => void;
}

export function FiltersBar({
  filters,
  availableTypes,
  availableOwners,
  availableTags,
  loading = false,
  onChange,
  onRefresh,
}: FiltersBarProps) {
  const update = <K extends keyof Filters>(key: K, value: Filters[K]) => onChange({ ...filters, [key]: value });

  const hasActiveFilters =
    filters.search || filters.type || filters.owner || filters.tag || filters.needsClarification || filters.showDropped;

  return (
    <Card className="mb-4 p-4">
      <div className="flex flex-wrap items-center gap-3">
        <div className="min-w-[220px] flex-1">
          <Field label="Search">
            <Input
              type="text"
              placeholder="ID or title..."
              value={filters.search}
              onChange={(e) => update('search', e.target.value)}
              className="py-1.5"
            />
          </Field>
        </div>

        <div className="min-w-[130px]">
          <Field label="Type">
            <Select value={filters.type} onChange={(e) => update('type', e.target.value)} className="py-1.5">
              <option value="">All types</option>
              {availableTypes.map((type) => <option key={type} value={type}>{type}</option>)}
            </Select>
          </Field>
        </div>

        <div className="min-w-[130px]">
          <Field label="Owner">
            <Select value={filters.owner} onChange={(e) => update('owner', e.target.value)} className="py-1.5">
              <option value="">All owners</option>
              {availableOwners.map((owner) => <option key={owner} value={owner}>@{owner}</option>)}
            </Select>
          </Field>
        </div>

        <div className="min-w-[130px]">
          <Field label="Tag">
            <Select value={filters.tag} onChange={(e) => update('tag', e.target.value)} className="py-1.5">
              <option value="">All tags</option>
              {availableTags.map((tag) => <option key={tag} value={tag}>{tag}</option>)}
            </Select>
          </Field>
        </div>

        <label className="mt-5 flex items-center gap-2 text-sm text-slate-300">
          <input
            type="checkbox"
            checked={filters.needsClarification}
            onChange={(e) => update('needsClarification', e.target.checked)}
            className="h-4 w-4 rounded border-slate-600 bg-slate-900 text-indigo-500 focus:ring-indigo-500"
          />
          Needs clarification
        </label>

        <label className="mt-5 flex items-center gap-2 text-sm text-slate-300">
          <input
            type="checkbox"
            checked={filters.showDropped}
            onChange={(e) => update('showDropped', e.target.checked)}
            className="h-4 w-4 rounded border-slate-600 bg-slate-900 text-indigo-500 focus:ring-indigo-500"
          />
          Show dropped
        </label>

        <div className="ml-auto mt-5 flex items-center gap-2">
          {hasActiveFilters && (
            <Button
              size="sm"
              variant="ghost"
              onClick={() => onChange({ search: '', type: '', owner: '', tag: '', needsClarification: false, showDropped: false })}
            >
              Clear
            </Button>
          )}
          <Button size="sm" variant="primary" onClick={onRefresh} loading={loading}>
            {loading ? 'Loading...' : 'Refresh'}
          </Button>
        </div>
      </div>
    </Card>
  );
}
