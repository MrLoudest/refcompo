import { create } from 'zustand';
import { cn } from '../../utils/strings';

type ToastItem = { id: string; title: string; description?: string; variant?: 'default' | 'error' };

type ToastState = {
  toasts: ToastItem[];
  show: (t: Omit<ToastItem, 'id'>) => void;
  dismiss: (id: string) => void;
};

export const useToastStore = create<ToastState>((set) => ({
  toasts: [],
  show: (t) =>
    set((s) => ({
      toasts: [...s.toasts, { id: Math.random().toString(36).slice(2), ...t }]
    })),
  dismiss: (id) => set((s) => ({ toasts: s.toasts.filter((x) => x.id !== id) }))
}));

export function ToastViewport() {
  const { toasts, dismiss } = useToastStore();
  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={cn(
            'w-80 rounded-md border bg-white px-4 py-3 shadow',
            t.variant === 'error' ? 'border-red-300' : 'border-slate-200'
          )}
          role="status"
          aria-live="polite"
        >
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="text-sm font-medium">{t.title}</div>
              {t.description && <div className="text-xs text-slate-600">{t.description}</div>}
            </div>
            <button className="text-slate-500 hover:text-slate-900" onClick={() => dismiss(t.id)}>
              ✕
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

export function useToast() {
  const show = useToastStore((s) => s.show);
  return { toast: show };
}


