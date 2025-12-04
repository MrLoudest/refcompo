import type { ButtonHTMLAttributes, PropsWithChildren } from 'react';
import { cn } from '../../utils/strings';

type Variant = 'primary' | 'secondary' | 'ghost';

export function Button({
  variant = 'primary',
  className,
  disabled,
  ...props
}: PropsWithChildren<
  ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: Variant;
  }
>) {
  const base =
    'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed';
  const variants: Record<Variant, string> = {
    primary: 'bg-slate-900 text-white hover:bg-slate-800 focus:ring-slate-400',
    secondary:
      'bg-white text-slate-900 border border-slate-300 hover:bg-slate-50 focus:ring-slate-300',
    ghost: 'bg-transparent hover:bg-slate-100 text-slate-900 focus:ring-slate-300'
  };
  return (
    <button
      className={cn(base, variants[variant], 'px-4 py-2', className)}
      disabled={disabled}
      {...props}
    />
  );
}


