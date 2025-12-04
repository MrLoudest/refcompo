import { useMemo, useState } from 'react';
import { Button } from '../components/ui/Button';
import { Card, CardContent, CardHeader } from '../components/ui/Card';
import { FormGrid } from '../components/ui/FormRow';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { Textarea } from '../components/ui/Textarea';
import { useToast } from '../components/ui/Toast';
import { WarningHint } from '../components/ui/WarningHint';
import { useReferenceStore, type CitationStyle, type SourceType } from '../state/referenceStore';
import { formatCitationPreview } from '../utils/formatting';
import { FIELD_META, SOURCE_FIELDS, type FieldKey, validateForSource } from '../utils/sourceFormConfig';
import { apiFormatReference, apiLookupDOI, apiLookupISBN } from '../api/appApi';
import type { FormatReferenceResponse, ReferenceWarning } from '@refcompo/shared';
import { debounce } from '../utils/debounce';

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
  const [seriesTitle, setSeriesTitle] = useState('');
  const [conferenceName, setConferenceName] = useState('');
  const [thesisType, setThesisType] = useState('');
  const [videoChannel, setVideoChannel] = useState('');
  const [podcastName, setPodcastName] = useState('');
  const [errors, setErrors] = useState<Partial<Record<FieldKey, string>>>({});

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

  // Server preview + warnings
  const [serverPreview, setServerPreview] = useState<string>('');
  const [warnings, setWarnings] = useState<ReferenceWarning[]>([]);
  const warningSet = useMemo(() => new Set(warnings.map((w) => w.code)), [warnings]);
  const warnColor = (code: ReferenceWarning['code']): 'red' | 'yellow' | 'blue' =>
    (['MISSING_TITLE', 'MISSING_YEAR', 'MISSING_PUBLISHER', 'MISSING_JOURNAL'] as ReferenceWarning['code'][]).includes(code)
      ? 'red'
      : (['INVALID_DOI', 'SUSPICIOUS_URL'] as ReferenceWarning['code'][]).includes(code)
      ? 'yellow'
      : 'blue';

  const triggerServerPreview = useMemo(
    () =>
      debounce(async () => {
        try {
          const res: FormatReferenceResponse = await apiFormatReference({
            style,
            metadata: {
              sourceType,
              title,
              authors: authors.map((a) => {
                const [family, given] = a.split(',').map((s) => s.trim());
                return { family: family || a.trim(), given };
              }),
              year,
              publisher,
              journal,
              volume,
              issue,
              pages,
              doi,
              url,
              seriesTitle: seriesTitle || undefined,
              conferenceName: conferenceName || undefined,
              thesisType: (thesisType as any) || undefined,
              videoChannel: videoChannel || undefined,
              podcastName: podcastName || undefined
            }
          });
          setServerPreview(res.formatted.reference);
          setWarnings(res.warnings || []);
        } catch {
          setServerPreview('');
          setWarnings([]);
        }
      }, 400),
    [style, sourceType, title, authors, year, publisher, journal, volume, issue, pages, doi, url]
  );

  // update server preview on input changes
  useMemo(() => {
    triggerServerPreview();
    return null;
  }, [triggerServerPreview]);

  async function handleIsbnLookup(isbn: string) {
    try {
      const { metadata, confidence } = await apiLookupISBN(isbn);
      if (!metadata?.title) {
        toast({ title: 'No results for that ISBN' });
        return;
      }
      setTitle(metadata.title || '');
      setAuthorsRaw((metadata.authors || []).map((a) => [a.family, a.given].filter(Boolean).join(', ')).join('\n'));
      setYear(metadata.year || '');
      setPublisher(metadata.publisher || '');
      if (confidence !== 'high') {
        toast({ title: `ISBN lookup confidence: ${confidence}` });
      }
    } catch (e) {
      toast({ title: 'ISBN lookup failed', description: String(e), variant: 'error' });
    }
  }

  async function handleDoiLookup(doiStr: string) {
    try {
      const { metadata, confidence } = await apiLookupDOI(doiStr);
      if (!metadata?.title) {
        toast({ title: 'No results for that DOI' });
        return;
      }
      setTitle(metadata.title || '');
      setAuthorsRaw((metadata.authors || []).map((a) => [a.family, a.given].filter(Boolean).join(', ')).join('\n'));
      setYear(metadata.year || '');
      setJournal(metadata.journal || '');
      setVolume(metadata.volume || '');
      setIssue(metadata.issue || '');
      setPages(metadata.pages || '');
      setDoi(metadata.doi || doiStr);
      if (confidence !== 'high') {
        toast({ title: `DOI lookup confidence: ${confidence}` });
      }
    } catch (e) {
      toast({ title: 'DOI lookup failed', description: String(e), variant: 'error' });
    }
  }

  function handleAdd() {
    const fieldVals = {
      title,
      authors: authors.join('\n'),
      year,
      publisher,
      journal,
      volume,
      issue,
      pages,
      doi,
      url,
      seriesTitle,
      conferenceName,
      thesisType,
      videoChannel,
      podcastName
    } as Record<FieldKey, string | undefined>;
    const vErrs = validateForSource(sourceType, fieldVals);
    setErrors(vErrs);
    if (Object.keys(vErrs).length > 0) {
      toast({ title: 'Please fix highlighted fields', variant: 'error' });
      return;
    }
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
            <Input
              label="URL lookup"
              placeholder="https://example.com/article"
              onBlur={async (e) => {
                const val = e.target.value.trim();
                if (!val) return;
                try {
                  const { metadata, confidence } = await (await import('../api/appApi')).apiLookupURL(val);
                  if (metadata.title) setTitle(metadata.title);
                  if (metadata.authors?.length) {
                    setAuthorsRaw(metadata.authors.map((a) => [a.family, a.given].filter(Boolean).join(', ')).join('\n'));
                  }
                  if (metadata.year) setYear(metadata.year);
                  setUrl(val);
                  if (confidence !== 'high') {
                    toast({ title: `URL lookup confidence: ${confidence}` });
                  }
                } catch (err) {
                  toast({ title: 'URL lookup failed', description: String(err), variant: 'error' });
                }
              }}
            />
          </FormGrid>
          <FormGrid cols={2}>
            <div>
              <Input label="Title" value={title} onChange={(e) => setTitle(e.target.value)} error={errors.title} tooltip={FIELD_META.title.tooltip} />
              {warningSet.has('MISSING_TITLE') && <WarningHint text="Title is required" color={warnColor('MISSING_TITLE')} />}
            </div>
            {sourceType === 'journal' ? (
              <div>
                <Input label="Journal" value={journal} onChange={(e) => setJournal(e.target.value)} error={errors.journal} tooltip={FIELD_META.journal.tooltip} />
                {warningSet.has('MISSING_JOURNAL') && <WarningHint text="Journal required for articles" color={warnColor('MISSING_JOURNAL')} />}
              </div>
            ) : (
              <div>
                <Input label="Publisher" value={publisher} onChange={(e) => setPublisher(e.target.value)} error={errors.publisher} tooltip={FIELD_META.publisher.tooltip} />
                {warningSet.has('MISSING_PUBLISHER') && <WarningHint text="Publisher recommended" color={warnColor('MISSING_PUBLISHER')} />}
              </div>
            )}
          </FormGrid>
          <FormGrid cols={3}>
            <div>
              <Input label="Year" value={year} onChange={(e) => setYear(e.target.value)} error={errors.year} tooltip={FIELD_META.year.tooltip} />
              {warningSet.has('MISSING_YEAR') && <WarningHint text="Year missing" color={warnColor('MISSING_YEAR')} />}
            </div>
            <Input label="Volume" value={volume} onChange={(e) => setVolume(e.target.value)} />
            <Input label="Issue" value={issue} onChange={(e) => setIssue(e.target.value)} />
          </FormGrid>
          <FormGrid cols={3}>
            <Input label="Pages" value={pages} onChange={(e) => setPages(e.target.value)} />
            <div>
              <Input label="DOI" value={doi} onChange={(e) => setDoi(e.target.value)} error={errors.doi} tooltip={FIELD_META.doi.tooltip} />
              {warningSet.has('INVALID_DOI') && <WarningHint text="DOI looks invalid" color={warnColor('INVALID_DOI')} />}
            </div>
            <div>
              <Input label="URL" value={url} onChange={(e) => setUrl(e.target.value)} error={errors.url} tooltip={FIELD_META.url.tooltip} />
              {warningSet.has('SUSPICIOUS_URL') && <WarningHint text="Suspicious URL (needs http/https)" color={warnColor('SUSPICIOUS_URL')} />}
            </div>
          </FormGrid>
          {/* Source-specific fields */}
          {sourceType === 'chapter' && (
            <FormGrid cols={2}>
              <Input label={FIELD_META.seriesTitle.label} tooltip={FIELD_META.seriesTitle.tooltip} value={seriesTitle} onChange={(e) => setSeriesTitle(e.target.value)} error={errors.seriesTitle} />
            </FormGrid>
          )}
          {sourceType === 'conference' && (
            <FormGrid cols={2}>
              <Input label={FIELD_META.conferenceName.label} tooltip={FIELD_META.conferenceName.tooltip} value={conferenceName} onChange={(e) => setConferenceName(e.target.value)} error={errors.conferenceName} />
            </FormGrid>
          )}
          {sourceType === 'thesis' && (
            <FormGrid cols={2}>
              <Input label={FIELD_META.thesisType.label} tooltip={FIELD_META.thesisType.tooltip} value={thesisType} onChange={(e) => setThesisType(e.target.value)} error={errors.thesisType} />
            </FormGrid>
          )}
          {sourceType === 'video' && (
            <FormGrid cols={2}>
              <Input label={FIELD_META.videoChannel.label} tooltip={FIELD_META.videoChannel.tooltip} value={videoChannel} onChange={(e) => setVideoChannel(e.target.value)} error={errors.videoChannel} />
            </FormGrid>
          )}
          {sourceType === 'podcast' && (
            <FormGrid cols={2}>
              <Input label={FIELD_META.podcastName.label} tooltip={FIELD_META.podcastName.tooltip} value={podcastName} onChange={(e) => setPodcastName(e.target.value)} error={errors.podcastName} />
            </FormGrid>
          )}
          <Textarea label="Authors (one per line, Family, Given)" rows={4} value={authorsRaw} onChange={(e) => setAuthorsRaw(e.target.value)} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="font-medium">Preview</CardHeader>
        <CardContent>
          <div className="rounded border border-slate-200 bg-slate-50 px-4 py-3 text-sm mb-3">
            {serverPreview || preview}
          </div>
          {!!warnings.length && (
            <div className="flex flex-wrap gap-2">
              {warnings.map((w) => (
                <span
                  key={w.code}
                  className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs border ${
                    warnColor(w.code) === 'red'
                      ? 'border-red-300 text-red-700'
                      : warnColor(w.code) === 'yellow'
                      ? 'border-amber-300 text-amber-700'
                      : 'border-sky-300 text-sky-700'
                  }`}
                  title={w.code}
                >
                  {w.message}
                </span>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}


