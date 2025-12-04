import type { ReactNode } from 'react';
import { cn } from '../../utils/strings';

export function Tabs({
  tabs,
  value,
  onChange
}: {
  tabs: { value: string; label: ReactNode }[];
  value: string;
  onChange: (val: string) => void;
}) {
  return (
    <div className="border-b border-slate-200">
      <div className="flex gap-6">
        {tabs.map((t) => (
          <button
            key={t.value}
            className={cn(
              'relative -mb-px py-3 text-sm transition-colors',
              value === t.value
                ? 'text-slate-900'
                : 'text-slate-500 hover:text-slate-900'
            )}
            onClick={() => onChange(t.value)}
            type="button"
          >
            {t.label}
            {value === t.value && (
              <span className="absolute inset-x-0 -bottom-px h-0.5 bg-slate-900" />
            )}
          </button>
        ))}
      </div>
    </div>
  );
}


