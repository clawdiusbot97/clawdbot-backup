import { forwardRef, HTMLAttributes, ReactNode } from 'react';
import { cn } from '@/components/ui/cn';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

export const Card = forwardRef<HTMLDivElement, CardProps>(function Card({ children, className, ...props }, ref) {
  return (
    <div
      ref={ref}
      className={cn('rounded-xl border border-slate-800 bg-slate-900/80 shadow-lg shadow-black/20', className)}
      {...props}
    >
      {children}
    </div>
  );
});
