import { apiClient } from './client';
import type {
  FormatReferenceRequest,
  FormatReferenceResponse,
  NormalizedLookupResult
} from '@refcompo/shared';

export async function apiFormatReference(body: FormatReferenceRequest) {
  const { data } = await apiClient.post<{ data: FormatReferenceResponse }>('/api/format', body);
  return data.data;
}

export async function apiLookupISBN(isbn: string) {
  const { data } = await apiClient.get<{ data: NormalizedLookupResult }>(`/api/lookup/isbn/${encodeURIComponent(isbn)}`);
  return data.data;
}

export async function apiLookupDOI(doi: string) {
  const { data } = await apiClient.get<{ data: NormalizedLookupResult }>(`/api/lookup/doi/${encodeURIComponent(doi)}`);
  return data.data;
}

export async function apiLookupURL(url: string) {
  const { data } = await apiClient.get<{ data: NormalizedLookupResult }>(`/api/lookup/url`, {
    params: { url }
  });
  return data.data;
}


