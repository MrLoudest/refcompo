import { useMemo, useState } from 'react';
import { Button } from '../components/ui/Button';
import { Card, CardContent, CardHeader } from '../components/ui/Card';
import { FormGrid } from '../components/ui/FormRow';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { Textarea } from '../components/ui/Textarea';
import { useToast } from '../components/ui/Toast';
import { useReferenceStore, type CitationStyle, type SourceType } from '../state/referenceStore';
import { formatCitationPreview } from '../utils/formatting';
import { lookupByDOI, lookupByISBN } from '../api/lookup';
import { env } from '../utils/env';

const SOURCE_OPTS: { value: SourceType; label: string }[] = [
  { value: 'book', label: 'Book' },
  { value: 'journal', label: 'Journal Article' },
  { value: 'website', label: 'Website' },
  { value: 'conference', label: 'Conference Paper' },
  { value: 'report', label: 'Report' },
  { value: 'thesis', label: 'Thesis' },
  { value: 'chapter', label: 'Book Chapter' }
];

const STYLE_OPTS: { value: CitationStyle; label: string }[] = [
  { value: 'apa7', label: 'APA 7' },
  { value: 'harvard', label: 'Harvard' },
  { value: 'mla', label: 'MLA' },
  { value: 'chicago', label: 'Chicago' }
];

export default function CreateReference() {
  const { toast } = useToast();
  const add = useReferenceStore((s) => s.add);

  const [style, setStyle] = useState<CitationStyle>('apa7');
  const [sourceType, setSourceType] = useState<SourceType>('book');

  const [title, setTitle] = useState('');
  const [authorsRaw, setAuthorsRaw] = useState(''); // one per line: "Family, Given"
  const [year, setYear] = useState('');
  const [publisher, setPublisher] = useState('');
  const [journal, setJournal] = useState('');
  const [volume, setVolume] = useState('');
  const [issue, setIssue] = useState('');
  const [pages, setPages] = useState('');
  const [doi, setDoi] = useState('');
  const [url, setUrl] = useState('');
  // optional accessed date for websites (not used in preview)

  const authors = useMemo(
    () => authorsRaw.split('\n').map((s) => s.trim()).filter(Boolean),
    [authorsRaw]
  );

  const preview = useMemo(
    () =>
      formatCitationPreview({
        id: 'preview',
        sourceType,
        style,
        title,
        authors,
        year,
        publisher,
        journal,
        volume,
        issue,
        pages,
        doi,
        url
      }),
    [style, sourceType, title, authors, year, publisher, journal, volume, issue, pages, doi, url]
  );

  async function handleIsbnLookup(isbn: string) {
    try {
      const data = await lookupByISBN(isbn, env.googleBooksApiKey);
      const item = data?.items?.[0]?.volumeInfo;
      if (!item) {
        toast({ title: 'No results for that ISBN' });
        return;
      }
      setTitle(item.title || '');
      setAuthorsRaw((item.authors || []).join('\n'));
      setYear(item.publishedDate?.slice(0, 4) || '');
      setPublisher(item.publisher || '');
    } catch (e) {
      toast({ title: 'ISBN lookup failed', description: String(e), variant: 'error' });
    }
  }

  async function handleDoiLookup(doiStr: string) {
    try {
      const data = await lookupByDOI(doiStr);
      const work = data?.message;
      if (!work) {
        toast({ title: 'No results for that DOI' });
        return;
      }
      setTitle(work.title?.[0] || '');
      const authors = (work.author as Array<{ given?: string; family?: string }> | undefined) || [];
      setAuthorsRaw(authors.map((a) => `${a.family || ''}, ${a.given || ''}`.trim()).join('\n'));
      setYear(work['published-print']?.['date-parts']?.[0]?.[0]?.toString() || '');
      setJournal(work['container-title']?.[0] || '');
      setVolume(work.volume || '');
      setIssue(work.issue || '');
      setPages(work.page || '');
      setDoi(work.DOI || doiStr);
    } catch (e) {
      toast({ title: 'DOI lookup failed', description: String(e), variant: 'error' });
    }
  }

  function handleAdd() {
    add({
      sourceType,
      style,
      title,
      authors,
      year,
      publisher,
      journal,
      volume,
      issue,
      pages,
      doi,
      url
    });
    toast({ title: 'Added to list', description: 'Your reference was saved locally.' });
  }

  return (
    <div className="py-10 space-y-8">
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold">Create a reference</h1>
        <p className="text-slate-600">Choose a source type and fill in the fields. Use lookup to autofill when possible.</p>
      </div>

      <Card>
        <CardHeader className="space-y-4">
          <FormGrid cols={3}>
            <Select label="Source type" value={sourceType} onChange={(e) => setSourceType(e.target.value as SourceType)}>
              {SOURCE_OPTS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </Select>
            <Select label="Style" value={style} onChange={(e) => setStyle(e.target.value as CitationStyle)}>
              {STYLE_OPTS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </Select>
            <div className="flex items-end">
              <Button type="button" onClick={handleAdd} className="w-full">
                Add to list
              </Button>
            </div>
          </FormGrid>
        </CardHeader>
        <CardContent className="space-y-6">
          <FormGrid cols={3}>
            <Input label="ISBN lookup" placeholder="e.g. 9780140449136" onBlur={(e) => e.target.value && handleIsbnLookup(e.target.value)} />
            <Input label="DOI lookup" placeholder="e.g. 10.1038/nphys1170" onBlur={(e) => e.target.value && handleDoiLookup(e.target.value)} />
            <Input label="URL lookup" placeholder="(requires server proxy)" disabled />
          </FormGrid>
          <FormGrid cols={2}>
            <Input label="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
            {sourceType === 'journal' ? (
              <Input label="Journal" value={journal} onChange={(e) => setJournal(e.target.value)} />
            ) : (
              <Input label="Publisher" value={publisher} onChange={(e) => setPublisher(e.target.value)} />
            )}
          </FormGrid>
          <FormGrid cols={3}>
            <Input label="Year" value={year} onChange={(e) => setYear(e.target.value)} />
            <Input label="Volume" value={volume} onChange={(e) => setVolume(e.target.value)} />
            <Input label="Issue" value={issue} onChange={(e) => setIssue(e.target.value)} />
          </FormGrid>
          <FormGrid cols={3}>
            <Input label="Pages" value={pages} onChange={(e) => setPages(e.target.value)} />
            <Input label="DOI" value={doi} onChange={(e) => setDoi(e.target.value)} />
            <Input label="URL" value={url} onChange={(e) => setUrl(e.target.value)} />
          </FormGrid>
          <Textarea label="Authors (one per line, Family, Given)" rows={4} value={authorsRaw} onChange={(e) => setAuthorsRaw(e.target.value)} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="font-medium">Preview</CardHeader>
        <CardContent>
          <div className="rounded border border-slate-200 bg-slate-50 px-4 py-3 text-sm">{preview}</div>
        </CardContent>
      </Card>
    </div>
  );
}


