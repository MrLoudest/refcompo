import axios from 'axios';
import type { NormalizedLookupResult, ReferenceMetadata } from '@refcompo/shared';
import { normalizeMetadata } from '../formatEngine';

export async function lookupCrossrefByDOI(doi: string, base = 'https://api.crossref.org/works'): Promise<NormalizedLookupResult> {
  const url = `${base}/${encodeURIComponent(doi)}`;
  const { data } = await axios.get(url, { timeout: 8000 });
  const work = data?.message;
  if (!work) {
    return {
      confidence: 'low',
      metadata: {
        sourceType: 'journal',
        title: '',
        authors: []
      }
    };
  }
  const authors = (work.author || []).map((a: any) => ({ family: a.family || '', given: a.given || '' }));
  const md: ReferenceMetadata = {
    sourceType: 'journal',
    title: work.title?.[0] || '',
    authors,
    year: work['published-print']?.['date-parts']?.[0]?.[0]?.toString(),
    journal: work['container-title']?.[0] || '',
    volume: work.volume,
    issue: work.issue,
    pages: work.page,
    doi: work.DOI
  };
  return { confidence: 'high', metadata: normalizeMetadata(md) };
}


