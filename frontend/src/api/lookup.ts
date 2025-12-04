import axios from 'axios';
import { isISBN, isDOI, isURL } from '../utils/validators';

export async function lookupByISBN(isbn: string, apiKey?: string) {
  if (!isISBN(isbn)) throw new Error('Invalid ISBN');
  const keyParam = apiKey ? `&key=${encodeURIComponent(apiKey)}` : '';
  const url = `https://www.googleapis.com/books/v1/volumes?q=isbn:${encodeURIComponent(isbn)}${keyParam}`;
  const { data } = await axios.get(url, { timeout: 8000 });
  return data;
}

export async function lookupByDOI(doi: string, base = 'https://api.crossref.org/works') {
  if (!isDOI(doi)) throw new Error('Invalid DOI');
  const url = `${base}/${encodeURIComponent(doi)}`;
  const { data } = await axios.get(url, { timeout: 8000 });
  return data;
}

export async function lookupByURL(url: string) {
  if (!isURL(url)) throw new Error('Invalid URL');
  // Note: Direct scraping is blocked by CORS in the browser. This is a stub.
  // We recommend implementing a backend metadata proxy later.
  return { note: 'URL scraping requires a server-side proxy due to CORS.' };
}


