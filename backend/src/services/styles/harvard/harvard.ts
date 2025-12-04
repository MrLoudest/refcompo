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

export function formatHarvardReference(md: ReferenceMetadata) {
  const authors = formatAuthors(md);
  const year = md.year || 'n.d.';
  const title = md.title;
  const container =
    md.sourceType === 'journal'
      ? [md.journal, md.volume, md.issue, md.pages].filter(Boolean).join(', ')
      : md.publisher;
  const doiOrUrl = md.doi ? `https://doi.org/${md.doi.replace(/^https?:\/\/(doi\.org\/)?/, '')}` : md.url;
  return joinNonEmpty([authors, year, title, container, doiOrUrl]);
}

export function formatHarvardInText(md: ReferenceMetadata, opts: { first: boolean; page?: string }) {
  const year = md.year || 'n.d.';
  const firstAuthor = md.authors?.[0];
  const base = firstAuthor?.family || '';
  const page = opts.page ? `, p. ${opts.page}` : '';
  return `(${base}, ${year}${page})`;
}


