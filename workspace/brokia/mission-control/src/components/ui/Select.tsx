import { forwardRef, SelectHTMLAttributes } from 'react';
import { cn } from '@/components/ui/cn';

type SelectProps = SelectHTMLAttributes<HTMLSelectElement>;

export const Select = forwardRef<HTMLSelectElement, SelectProps>(function Select({ className, ...props }, ref) {
  return (
    <select
      ref={ref}
      className={cn(
        'w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100',
        'focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/30',
        className
      )}
      {...props}
    />
  );
});
