import type { SourceType } from '../state/referenceStore';

export type FieldKey =
  | 'title'
  | 'authors'
  | 'year'
  | 'publisher'
  | 'journal'
  | 'volume'
  | 'issue'
  | 'pages'
  | 'doi'
  | 'url'
  | 'seriesTitle'
  | 'conferenceName'
  | 'thesisType'
  | 'videoChannel'
  | 'podcastName';

export type FieldMeta = {
  key: FieldKey;
  label: string;
  tooltip?: string;
  required?: boolean;
};

export const FIELD_META: Record<FieldKey, FieldMeta> = {
  title: { key: 'title', label: 'Title', tooltip: 'Work title (article, book, page, etc.)', required: true },
  authors: { key: 'authors', label: 'Authors', tooltip: 'One per line: Family, Given' },
  year: { key: 'year', label: 'Year', tooltip: 'Publication year (YYYY)' },
  publisher: { key: 'publisher', label: 'Publisher', tooltip: 'Publisher or institution' },
  journal: { key: 'journal', label: 'Journal', tooltip: 'Journal or periodical name' },
  volume: { key: 'volume', label: 'Volume' },
  issue: { key: 'issue', label: 'Issue' },
  pages: { key: 'pages', label: 'Pages', tooltip: 'Use hyphen or en dash (e.g., 12-18)' },
  doi: { key: 'doi', label: 'DOI' },
  url: { key: 'url', label: 'URL' },
  seriesTitle: { key: 'seriesTitle', label: 'Book title', tooltip: 'Container title for a chapter' },
  conferenceName: { key: 'conferenceName', label: 'Conference', tooltip: 'Conference or proceedings name' },
  thesisType: { key: 'thesisType', label: 'Thesis type', tooltip: 'phd, masters, or bachelor' },
  videoChannel: { key: 'videoChannel', label: 'Channel', tooltip: 'e.g., YouTube channel' },
  podcastName: { key: 'podcastName', label: 'Podcast', tooltip: 'Podcast show name' }
};

export const SOURCE_FIELDS: Record<SourceType, FieldKey[]> = {
  book: ['title', 'authors', 'year', 'publisher', 'pages', 'doi', 'url'],
  journal: ['title', 'authors', 'year', 'journal', 'volume', 'issue', 'pages', 'doi', 'url'],
  website: ['title', 'authors', 'year', 'url'],
  conference: ['title', 'authors', 'year', 'conferenceName', 'pages', 'doi', 'url'],
  report: ['title', 'authors', 'year', 'publisher', 'url'],
  thesis: ['title', 'authors', 'year', 'publisher', 'thesisType', 'url'],
  chapter: ['title', 'authors', 'year', 'seriesTitle', 'publisher', 'pages', 'doi', 'url'],
  video: ['title', 'authors', 'year', 'videoChannel', 'url'],
  podcast: ['title', 'authors', 'year', 'podcastName', 'url']
};

export type FieldErrors = Partial<Record<FieldKey, string>>;

export function validateForSource(source: SourceType, vals: Record<FieldKey, string | undefined>): FieldErrors {
  const reqs = SOURCE_FIELDS[source];
  const errs: FieldErrors = {};
  for (const key of reqs) {
    if (['doi', 'pages', 'issue', 'volume'].includes(key)) continue;
    const v = (vals[key] || '').trim();
    if (!v && (FIELD_META[key].required || ['title', 'url'].includes(key))) {
      errs[key] = `${FIELD_META[key].label} is required`;
    }
  }
  if (vals.doi && !/^10\.\d{4,9}\/[-._;()/:A-Z0-9]+$/i.test(vals.doi)) {
    errs.doi = 'Invalid DOI format';
  }
  if (vals.url && !/^https?:\/\//i.test(vals.url)) {
    errs.url = 'URL must start with http(s)://';
  }
  return errs;
}


