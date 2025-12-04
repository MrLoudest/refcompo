import { useMemo, useState } from 'react';
import { Button } from '../components/ui/Button';
import { Card, CardContent } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Modal } from '../components/ui/Modal';
import { useToast } from '../components/ui/Toast';
import { useReferenceStore, type ReferenceItem } from '../state/referenceStore';
import { formatCitationPreview } from '../utils/formatting';

export default function ReferenceList() {
  const { toast } = useToast();
  const { items, update, remove, move, clear } = useReferenceStore();
  const [editing, setEditing] = useState<ReferenceItem | null>(null);
  const [toDelete, setToDelete] = useState<ReferenceItem | null>(null);

  const exports = useMemo(() => {
    const text = items.map((it) => formatCitationPreview(it)).join('\n');
    const json = JSON.stringify(items, null, 2);
    const bib = items
      .map(
        (it, i) =>
          `@article{ref${i + 1},\n  title={${it.title}},\n  author={${it.authors.join(' and ')}},\n  year={${it.year || 'n.d.'}},\n  journal={${it.journal || ''}},\n  volume={${it.volume || ''}},\n  number={${it.issue || ''}},\n  pages={${it.pages || ''}},\n  doi={${it.doi || ''}},\n  url={${it.url || ''}}\n}`
      )
      .join('\n\n');
    return { text, json, bib };
  }, [items]);

  function copy(str: string, label: string) {
    navigator.clipboard
      .writeText(str)
      .then(() => toast({ title: `Copied ${label} to clipboard` }))
      .catch(() => toast({ title: 'Copy failed', variant: 'error' }));
  }

  return (
    <div className="py-10 space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Your references</h1>
        <div className="flex items-center gap-2">
          <Button variant="secondary" onClick={() => copy(exports.text, 'text')}>
            Export text
          </Button>
          <Button variant="secondary" onClick={() => copy(exports.json, 'JSON')}>
            Export JSON
          </Button>
          <Button variant="secondary" onClick={() => copy(exports.bib, 'BibTeX')}>
            Export BibTeX
          </Button>
          <Button variant="ghost" onClick={clear}>
            Clear all
          </Button>
        </div>
      </div>

      <div className="space-y-3">
        {items.map((it, idx) => (
          <Card key={it.id}>
            <CardContent className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="text-sm">{formatCitationPreview(it)}</div>
              <div className="flex items-center gap-2">
                <Button variant="secondary" onClick={() => idx > 0 && move(idx, idx - 1)}>
                  ↑
                </Button>
                <Button variant="secondary" onClick={() => idx < items.length - 1 && move(idx, idx + 1)}>
                  ↓
                </Button>
                <Button variant="secondary" onClick={() => setEditing(it)}>
                  Edit
                </Button>
                <Button variant="ghost" onClick={() => setToDelete(it)}>
                  Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
        {items.length === 0 && <div className="text-slate-500">No references yet. Create one to get started.</div>}
      </div>

      <Modal
        open={!!editing}
        onClose={() => setEditing(null)}
        title="Edit reference"
        footer={
          <div className="flex items-center justify-end gap-2">
            <Button variant="secondary" onClick={() => setEditing(null)}>
              Close
            </Button>
          </div>
        }
      >
        {editing && (
          <div className="space-y-3">
            <Input
              label="Title"
              value={editing.title}
              onChange={(e) => update(editing.id, { title: e.target.value })}
            />
            <Input
              label="Authors (comma separated)"
              value={editing.authors.join(', ')}
              onChange={(e) => update(editing.id, { authors: e.target.value.split(',').map((s) => s.trim()).filter(Boolean) })}
            />
            <div className="grid grid-cols-3 gap-3">
              <Input label="Year" value={editing.year} onChange={(e) => update(editing.id, { year: e.target.value })} />
              <Input label="Volume" value={editing.volume} onChange={(e) => update(editing.id, { volume: e.target.value })} />
              <Input label="Issue" value={editing.issue} onChange={(e) => update(editing.id, { issue: e.target.value })} />
            </div>
            <div className="grid grid-cols-3 gap-3">
              <Input label="Pages" value={editing.pages} onChange={(e) => update(editing.id, { pages: e.target.value })} />
              <Input label="DOI" value={editing.doi} onChange={(e) => update(editing.id, { doi: e.target.value })} />
              <Input label="URL" value={editing.url} onChange={(e) => update(editing.id, { url: e.target.value })} />
            </div>
          </div>
        )}
      </Modal>

      <Modal
        open={!!toDelete}
        onClose={() => setToDelete(null)}
        title="Delete reference"
        footer={
          <div className="flex items-center justify-end gap-2">
            <Button variant="ghost" onClick={() => setToDelete(null)}>
              Cancel
            </Button>
            {toDelete && (
              <Button
                variant="secondary"
                onClick={() => {
                  remove(toDelete.id);
                  setToDelete(null);
                }}
              >
                Delete
              </Button>
            )}
          </div>
        }
      >
        <div className="text-sm text-slate-700">This action cannot be undone.</div>
      </Modal>
    </div>
  );
}


