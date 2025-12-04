import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type CitationStyle = 'apa7' | 'harvard' | 'mla' | 'chicago';

export type SourceType =
  | 'book'
  | 'journal'
  | 'website'
  | 'conference'
  | 'report'
  | 'thesis'
  | 'chapter'
  | 'video'
  | 'podcast';

export type ReferenceItem = {
  id: string;
  sourceType: SourceType;
  style: CitationStyle;
  title: string;
  authors: string[]; // "Family, Given" order
  year?: string;
  publisher?: string;
  journal?: string;
  volume?: string;
  issue?: string;
  pages?: string;
  doi?: string;
  url?: string;
  accessed?: string;
};

type ReferenceState = {
  items: ReferenceItem[];
  add: (item: Omit<ReferenceItem, 'id'>) => string;
  update: (id: string, patch: Partial<ReferenceItem>) => void;
  remove: (id: string) => void;
  move: (from: number, to: number) => void;
  clear: () => void;
};

export const useReferenceStore = create<ReferenceState>()(
  persist(
    (set) => ({
      items: [],
      add: (item) => {
        const id = Math.random().toString(36).slice(2);
        set((s) => ({ items: [...s.items, { id, ...item }] }));
        return id;
      },
      update: (id, patch) =>
        set((s) => ({
          items: s.items.map((it) => (it.id === id ? { ...it, ...patch } : it))
        })),
      remove: (id) => set((s) => ({ items: s.items.filter((it) => it.id !== id) })),
      move: (from, to) =>
        set((s) => {
          const arr = [...s.items];
          const [spliced] = arr.splice(from, 1);
          arr.splice(to, 0, spliced);
          return { items: arr };
        }),
      clear: () => set({ items: [] })
    }),
    { name: 'refcompo.references' }
  )
);


