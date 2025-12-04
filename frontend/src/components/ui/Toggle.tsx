import type { ButtonHTMLAttributes } from 'react';
import { cn } from '../../utils/strings';

export function Toggle({
  pressed,
  onPressedChange,
  className,
  ...props
}: {
  pressed: boolean;
  onPressedChange: (val: boolean) => void;
} & ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type="button"
      aria-pressed={pressed}
      className={cn(
        'inline-flex h-6 w-10 items-center rounded-full border transition-colors',
        pressed ? 'bg-slate-900 border-slate-900' : 'bg-slate-200 border-slate-300',
        className
      )}
      onClick={() => onPressedChange(!pressed)}
      {...props}
    >
      <span
        className={cn(
          'h-5 w-5 rounded-full bg-white shadow transform transition-transform',
          pressed ? 'translate-x-4' : 'translate-x-1'
        )}
      />
    </button>
  );
}


