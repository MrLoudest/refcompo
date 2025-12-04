import type { NormalizedLookupResult, ReferenceMetadata } from '@refcompo/shared';

// Simple placeholder: in production, implement a server-side fetch + extraction.
export async function scrapeUrlMetadata(url: string): Promise<NormalizedLookupResult> {
  // We cannot fetch arbitrary URLs here due to SSR constraints; return low confidence stub.
  const md: ReferenceMetadata = {
    sourceType: 'website',
    title: '',
    authors: [],
    url
  };
  return { confidence: 'low', metadata: md };
}


