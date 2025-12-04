import type { PropsWithChildren } from 'react';
import { cn } from '../../utils/strings';

export function FormRow({
  children,
  className
}: PropsWithChildren<{
  className?: string;
}>) {
  return <div className={cn('grid gap-4 sm:grid-cols-2', className)}>{children}</div>;
}

export function FormGrid({
  children,
  cols = 2
}: PropsWithChildren<{
  cols?: 1 | 2 | 3 | 4;
}>) {
  const map: Record<number, string> = { 1: 'grid-cols-1', 2: 'sm:grid-cols-2', 3: 'lg:grid-cols-3', 4: 'xl:grid-cols-4' };
  return <div className={`grid gap-4 ${map[cols] || ''}`}>{children}</div>;
}


