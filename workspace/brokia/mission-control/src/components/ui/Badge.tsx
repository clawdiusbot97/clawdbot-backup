import { ReactNode } from 'react';
import { cn } from '@/components/ui/cn';

type BadgeVariant = 'neutral' | 'success' | 'danger' | 'warning' | 'info';

interface BadgeProps {
  children: ReactNode;
  variant?: BadgeVariant;
  className?: string;
}

const variantClasses: Record<BadgeVariant, string> = {
  neutral: 'border-slate-700 bg-slate-900 text-slate-300',
  success: 'border-emerald-700/60 bg-emerald-500/20 text-emerald-200',
  danger: 'border-rose-700/60 bg-rose-500/20 text-rose-200',
  warning: 'border-amber-700/60 bg-amber-500/20 text-amber-200',
  info: 'border-indigo-700/60 bg-indigo-500/20 text-indigo-200',
};

export function Badge({ children, variant = 'neutral', className }: BadgeProps) {
  return (
    <span className={cn('inline-flex items-center rounded-full border px-2 py-0.5 text-xs', variantClasses[variant], className)}>
      {children}
    </span>
  );
}
