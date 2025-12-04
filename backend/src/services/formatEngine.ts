import type {
  CitationStyle,
  ReferenceMetadata,
  FormattedReference,
  ReferenceWarning
} from '@refcompo/shared';
import { formatApaReference, formatApaInText } from './styles/apa7/apa';
import { formatHarvardReference, formatHarvardInText } from './styles/harvard/harvard';
import { formatMlaReference, formatMlaInText } from './styles/mla/mla';
import { formatChicagoReference, formatChicagoInText } from './styles/chicago/chicago';

export function formatReference(
  style: CitationStyle,
  md: ReferenceMetadata
): FormattedReference {
  switch (style) {
    case 'apa7':
      return {
        reference: formatApaReference(md),
        inTextFirst: formatApaInText(md, { first: true }),
        inTextSubsequent: formatApaInText(md, { first: false })
      };
    case 'harvard':
      return {
        reference: formatHarvardReference(md),
        inTextFirst: formatHarvardInText(md, { first: true }),
        inTextSubsequent: formatHarvardInText(md, { first: false })
      };
    case 'mla':
      return {
        reference: formatMlaReference(md),
        inTextFirst: formatMlaInText(md, { first: true }),
        inTextSubsequent: formatMlaInText(md, { first: false })
      };
    case 'chicago':
      return {
        reference: formatChicagoReference(md),
        inTextFirst: formatChicagoInText(md, { first: true }),
        inTextSubsequent: formatChicagoInText(md, { first: false })
      };
    default:
      return { reference: md.title };
  }
}

export function validateReferenceMetadata(
  md: ReferenceMetadata
): ReferenceWarning[] {
  const warnings: ReferenceWarning[] = [];
  if (!md.title?.trim()) {
    warnings.push({ code: 'MISSING_TITLE', message: 'Title is required' });
  }
  if (!md.year?.trim()) {
    warnings.push({ code: 'MISSING_YEAR', message: 'Year is missing' });
  }
  if (md.sourceType === 'journal' && !md.journal?.trim()) {
    warnings.push({ code: 'MISSING_JOURNAL', message: 'Journal is required for articles' });
  }
  if ((md.sourceType === 'book' || md.sourceType === 'report' || md.sourceType === 'thesis') && !md.publisher?.trim()) {
    warnings.push({ code: 'MISSING_PUBLISHER', message: 'Publisher is recommended for this source type' });
  }
  if (md.doi && !/^10\.\d{4,9}\/[-._;()/:A-Z0-9]+$/i.test(md.doi)) {
    warnings.push({ code: 'INVALID_DOI', message: 'DOI looks invalid' });
  }
  if (md.url && !/^https?:\/\//i.test(md.url)) {
    warnings.push({ code: 'SUSPICIOUS_URL', message: 'URL should start with http(s)://' });
  }
  return warnings;
}

// Normalizers
export function normalizeTitle(title: string) {
  const t = title.trim().replace(/\s+/g, ' ').replace(/[“”]/g, '"').replace(/[‘’]/g, "'");
  const withoutTrailing = t.replace(/[ .,:;]+$/g, '');
  // if ALL CAPS, transform to sentence case
  if (/^[A-Z0-9\s]+$/.test(withoutTrailing) && /[A-Z]/.test(withoutTrailing)) {
    const lower = withoutTrailing.toLowerCase();
    return lower.charAt(0).toUpperCase() + lower.slice(1);
  }
  return withoutTrailing;
}

export function normalizeAuthors(authors: ReferenceMetadata['authors']) {
  return authors.map((a) => ({
    ...a,
    family: a.family.trim().replace(/\s+/g, ' ')
  }));
}

export function normalizeMetadata(md: ReferenceMetadata): ReferenceMetadata {
  return {
    ...md,
    title: normalizeTitle(md.title),
    authors: normalizeAuthors(md.authors),
    url: md.url?.trim(),
    doi: md.doi?.trim()
  };
}


