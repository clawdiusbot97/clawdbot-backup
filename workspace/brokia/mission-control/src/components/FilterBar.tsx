'use client';

import { Filters } from '@/types/workitem';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Field } from '@/components/ui/Field';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';

interface FilterBarProps {
  filters: Filters;
  onFiltersChange: (filters: Filters) => void;
  availableTypes: string[];
  availableOwners: string[];
  availableTags: string[];
  onRefresh: () => void;
  isLoading: boolean;
  showDropped: boolean;
  onShowDroppedChange: (value: boolean) => void;
}

export function FilterBar({
  filters,
  onFiltersChange,
  availableTypes,
  availableOwners,
  availableTags,
  onRefresh,
  isLoading,
  showDropped,
  onShowDroppedChange,
}: FilterBarProps) {
  const updateFilter = <K extends keyof Filters>(key: K, value: Filters[K]) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const hasActiveFilters =
    filters.search ||
    filters.type ||
    filters.owner ||
    filters.tag ||
    filters.needsClarification;

  const clearFilters = () => {
    onFiltersChange({
      search: '',
      type: '',
      owner: '',
      tag: '',
      needsClarification: false,
      showDropped: false,
    });
  };

  return (
    <Card className="mb-4 p-4">
      <div className="flex flex-wrap items-center gap-3">
        {/* Search */}
        <div className="flex-1 min-w-[200px]">
          <Field label="Search">
            <Input
              type="text"
              placeholder="ID or title..."
              value={filters.search}
              onChange={(e) => updateFilter('search', e.target.value)}
              className="py-1.5"
            />
          </Field>
        </div>

        {/* Type filter */}
        <div className="min-w-[120px]">
          <Field label="Type">
            <Select value={filters.type} onChange={(e) => updateFilter('type', e.target.value)} className="py-1.5">
              <option value="">All types</option>
              {availableTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </Select>
          </Field>
        </div>

        {/* Owner filter */}
        <div className="min-w-[120px]">
          <Field label="Owner">
            <Select value={filters.owner} onChange={(e) => updateFilter('owner', e.target.value)} className="py-1.5">
              <option value="">All owners</option>
              {availableOwners.map((owner) => (
                <option key={owner} value={owner}>
                  @{owner}
                </option>
              ))}
            </Select>
          </Field>
        </div>

        {/* Tag filter */}
        <div className="min-w-[120px]">
          <Field label="Tag">
            <Select value={filters.tag} onChange={(e) => updateFilter('tag', e.target.value)} className="py-1.5">
              <option value="">All tags</option>
              {availableTags.map((tag) => (
                <option key={tag} value={tag}>
                  {tag}
                </option>
              ))}
            </Select>
          </Field>
        </div>

        {/* Needs clarification toggle */}
        <div className="flex items-end">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={filters.needsClarification}
              onChange={(e) => updateFilter('needsClarification', e.target.checked)}
              className="h-4 w-4 rounded border-slate-600 bg-slate-900 text-indigo-500 focus:ring-indigo-500"
            />
            <span className="text-sm text-slate-300">Needs clarification</span>
          </label>
        </div>
        <div className="flex items-end">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={showDropped}
              onChange={(e) => onShowDroppedChange(e.target.checked)}
              className="h-4 w-4 rounded border-slate-600 bg-slate-900 text-indigo-500 focus:ring-indigo-500"
            />
            <span className="text-sm text-slate-300">Show dropped</span>
          </label>
        </div>

        {/* Actions */}
        <div className="flex items-end gap-2 ml-auto">
          {hasActiveFilters && (
            <Button
              onClick={clearFilters}
              variant="ghost"
              size="sm"
            >
              Clear
            </Button>
          )}
          <Button
            onClick={onRefresh}
            loading={isLoading}
            size="sm"
            variant="primary"
          >
            {isLoading ? 'Loading...' : 'Refresh'}
          </Button>
        </div>
      </div>
    </Card>
  );
}
