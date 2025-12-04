import axios from 'axios';

export async function fetchCrossrefExample(query: string) {
  const base = process.env.CROSSREF_API_URL || 'https://api.crossref.org/works';
  const url = `${base}?query=${encodeURIComponent(query)}&rows=1`;
  const res = await axios.get(url, { timeout: 8000 });
  return res.data;
}


