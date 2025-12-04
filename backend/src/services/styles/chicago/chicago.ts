import type { ReferenceMetadata } from '@refcompo/shared';

function joinNonEmpty(parts: Array<string | undefined>) {
  return parts.filter((p) => p && p.trim().length > 0).join('. ') + '.';
}

function formatAuthors(md: ReferenceMetadata) {
  if (!md.authors?.length) return '';
  return md.authors
    .map((a) => (a.organization ? a.family : `${a.family}${a.given ? `, ${a.given}` : ''}`))
    .join(', ');
}

export function formatChicagoReference(md: ReferenceMetadata) {
  const authors = formatAuthors(md);
  const title = `"${md.title}"`;
  const container =
    md.sourceType === 'journal'
      ? `${md.journal || ''} ${md.volume || ''}${md.issue ? `, no. ${md.issue}` : ''}${
          md.pages ? `: ${md.pages}` : ''
        }`
      : md.publisher;
  return joinNonEmpty([authors, title, container, md.year, md.doi || md.url]);
}

export function formatChicagoInText(md: ReferenceMetadata, opts: { first: boolean; page?: string }) {
  const firstAuthor = md.authors?.[0];
  const base = firstAuthor?.family || '';
  const page = opts.page ? `, ${opts.page}` : '';
  return `(${base}${page})`;
}


