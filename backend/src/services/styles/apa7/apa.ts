import type { ReferenceMetadata } from '@refcompo/shared';

function joinNonEmpty(parts: Array<string | undefined>) {
  return parts.filter((p) => p && p.trim().length > 0).join('. ') + '.';
}

function formatAuthors(md: ReferenceMetadata) {
  if (!md.authors?.length) return '';
  return md.authors
    .map((a) => (a.organization ? a.family : `${a.family}${a.given ? `, ${a.given[0]}.` : ''}`))
    .join(', ');
}

export function formatApaReference(md: ReferenceMetadata) {
  const authors = formatAuthors(md);
  const year = md.year ? `(${md.year})` : '(n.d.)';
  const title = md.title;
  const container =
    md.sourceType === 'journal'
      ? [md.journal, md.volume && `${md.volume}${md.issue ? `(${md.issue})` : ''}`, md.pages]
          .filter(Boolean)
          .join(', ')
      : md.publisher;
  const doi = md.doi ? `https://doi.org/${md.doi.replace(/^https?:\/\/(doi\.org\/)?/, '')}` : '';
  return joinNonEmpty([authors, year, title, container, doi || md.url]);
}

export function formatApaInText(md: ReferenceMetadata, opts: { first: boolean; page?: string } = { first: true }) {
  const year = md.year || 'n.d.';
  const firstAuthor = md.authors?.[0];
  if (!firstAuthor) return `(${year})`;
  const base = firstAuthor.organization ? firstAuthor.family : firstAuthor.family;
  const etAl = md.authors.length > 2 ? ' et al.' : md.authors.length === 2 ? ` & ${md.authors[1].family}` : '';
  const page = opts.page ? `, p. ${opts.page}` : '';
  if (opts.first) {
    return `(${base}${etAl}, ${year}${page})`;
  }
  // subsequent can be shortened to first author + year
  return `(${base}, ${year}${page})`;
}


