'use client';

import { ReactNode } from 'react';
import { cn } from '@/components/ui/cn';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: ReactNode;
  className?: string;
}

export function Modal({ open, onClose, title, subtitle, children, className }: ModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[70] bg-black/65 p-4">
      <div className="flex min-h-full items-center justify-center">
        <div className={cn('w-full max-w-3xl rounded-xl border border-slate-700 bg-slate-950 p-5 shadow-2xl', className)}>
          <div className="mb-4 flex items-start justify-between gap-3">
            <div>
              <h2 className="text-lg font-semibold text-slate-100">{title}</h2>
              {subtitle && <p className="mt-0.5 text-xs text-slate-400 break-all">{subtitle}</p>}
            </div>
            <button
              onClick={onClose}
              className="rounded-md border border-slate-700 bg-slate-900 px-2 py-1 text-xs text-slate-300 hover:bg-slate-800"
            >
              ✕
            </button>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}
