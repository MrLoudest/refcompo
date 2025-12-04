import axios from 'axios';
import type { NormalizedLookupResult, ReferenceMetadata } from '@refcompo/shared';
import { normalizeMetadata } from '../formatEngine';

export async function lookupGoogleBooksByISBN(isbn: string, apiKey?: string): Promise<NormalizedLookupResult> {
  const keyParam = apiKey ? `&key=${encodeURIComponent(apiKey)}` : '';
  const url = `https://www.googleapis.com/books/v1/volumes?q=isbn:${encodeURIComponent(isbn)}${keyParam}`;
  const { data } = await axios.get(url, { timeout: 8000 });
  const vol = data?.items?.[0]?.volumeInfo;
  if (!vol) {
    return {
      confidence: 'low',
      metadata: {
        sourceType: 'book',
        title: '',
        authors: []
      }
    };
  }
  const md: ReferenceMetadata = {
    sourceType: 'book',
    title: vol.title || '',
    authors: (vol.authors || []).map((n: string) => ({ family: n })),
    year: vol.publishedDate?.slice(0, 4),
    publisher: vol.publisher
  };
  return { confidence: 'high', metadata: normalizeMetadata(md) };
}


