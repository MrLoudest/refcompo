import type { CitationStyle, ReferenceItem } from '../state/referenceStore';
import { safeString, titleCase } from './strings';

export function formatAuthors(authors: string[], style: CitationStyle) {
  if (!authors.length) return '';
  const norm = authors.map((a) => safeString(a));
  if (style === 'apa7' || style === 'harvard') {
    // "Family, G." format (assumes input in "Family, Given" already)
    return norm.join('; ');
  }
  // MLA/Chicago simple join
  return norm.join(', ');
}

export function formatCitationPreview(item: ReferenceItem): string {
  const a = formatAuthors(item.authors, item.style);
  const title = titleCase(safeString(item.title));
  const year = safeString(item.year) || 'n.d.';
  const doi = item.doi ? `https://doi.org/${item.doi.replace(/^https?:\/\/(doi\.org\/)?/, '')}` : '';
  const url = item.url || '';
  const joined = (parts: Array<string | undefined>) =>
    parts.filter((p) => p && p.trim().length > 0).join('. ') + '.';

  switch (item.style) {
    case 'apa7': {
      const container =
        item.sourceType === 'journal'
          ? [item.journal, item.volume && `${item.volume}${item.issue ? `(${item.issue})` : ''}`, item.pages?.replace(/-/g, '–')].filter(Boolean).join(', ')
          : item.publisher;
      return joined([a, `(${year})`, title, container, doi || url]);
    }
    case 'harvard': {
      const container =
        item.sourceType === 'journal'
          ? [item.journal, item.volume, item.issue, item.pages?.replace(/-/g, '–')].filter(Boolean).join(', ')
          : item.publisher;
      return joined([a, year, title, container, doi || url]);
    }
    case 'mla': {
      const container =
        item.sourceType === 'journal'
          ? `${item.journal} ${[item.volume, item.issue].filter(Boolean).join('.')}${
              item.pages ? `: ${item.pages}` : ''
            }`
          : item.publisher;
      return joined([a, `"${title}"`, container, year, doi || url]);
    }
    case 'chicago': {
      const container =
        item.sourceType === 'journal'
          ? `${item.journal} ${item.volume || ''}${item.issue ? `, no. ${item.issue}` : ''}${
              item.pages ? `: ${item.pages}` : ''
            }`
          : item.publisher;
      return joined([a, `"${title}"`, container, year, doi || url]);
    }
    default:
      return title;
  }
}


