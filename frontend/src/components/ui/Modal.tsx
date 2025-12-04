import type { PropsWithChildren, ReactNode } from 'react';
import { Button } from './Button';
import { cn } from '../../utils/strings';

export function Modal({
  open,
  title,
  onClose,
  children,
  footer
}: PropsWithChildren<{
  open: boolean;
  title: string;
  footer?: ReactNode;
  onClose: () => void;
}>) {
  if (!open) return null;
  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 grid place-items-center bg-black/30 p-4"
    >
      <div className={cn('w-full max-w-lg rounded-lg bg-white shadow-lg')}>
        <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between">
          <h3 className="font-medium">{title}</h3>
          <Button variant="ghost" onClick={onClose} aria-label="Close modal">
            ✕
          </Button>
        </div>
        <div className="px-5 py-4">{children}</div>
        {footer && <div className="px-5 py-3 border-t border-slate-200">{footer}</div>}
      </div>
    </div>
  );
}


