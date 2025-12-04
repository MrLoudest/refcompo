import type { PropsWithChildren } from 'react';
import { cn } from '../../utils/strings';

export function Card({
  children,
  className
}: PropsWithChildren<{
  className?: string;
}>) {
  return <div className={cn('rounded-lg border border-slate-200 bg-white', className)}>{children}</div>;
}

export function CardHeader({
  children,
  className
}: PropsWithChildren<{ className?: string }>) {
  return (
    <div className={cn('px-5 py-4 border-b border-slate-200', className)}>
      {children}
    </div>
  );
}

export function CardContent({ children, className }: PropsWithChildren<{ className?: string }>) {
  return <div className={cn('px-5 py-4', className)}>{children}</div>;
}


