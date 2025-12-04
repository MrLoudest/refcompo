import type { SelectHTMLAttributes } from 'react';
import { cn } from '../../utils/strings';

type Props = SelectHTMLAttributes<HTMLSelectElement> & {
  label?: string;
  error?: string;
  tooltip?: string;
};

export function Select({ label, error, className, id, children, tooltip, ...props }: Props) {
  const inputId = id || props.name || `field-${Math.random().toString(36).slice(2)}`;
  return (
    <label htmlFor={inputId} className="block space-y-1">
      {label && (
        <span className="text-sm text-slate-700" title={tooltip}>
          {label}
        </span>
      )}
      <select
        id={inputId}
        className={cn(
          'w-full rounded-md border bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-300',
          error ? 'border-red-500' : 'border-slate-300',
          className
        )}
        aria-invalid={!!error}
        aria-describedby={error ? `${inputId}-error` : undefined}
        {...props}
      >
        {children}
      </select>
      {error && (
        <span id={`${inputId}-error`} className="text-xs text-red-600">
          {error}
        </span>
      )}
    </label>
  );
}


