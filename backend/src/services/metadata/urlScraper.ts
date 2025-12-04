import axios from 'axios';
import * as cheerio from 'cheerio';
import type { NormalizedLookupResult, ReferenceMetadata, Confidence } from '@refcompo/shared';
import { normalizeMetadata, normalizeTitle } from '../formatEngine';

function stripSiteSuffix(t: string) {
  const separators = [' | ', ' - '];
  for (const sep of separators) {
    if (t.includes(sep)) {
      return t.split(sep)[0];
    }
  }
  return t;
}

function computeConfidence(fields: Record<string, unknown>): Confidence {
  const present = Object.values(fields).filter(Boolean).length;
  if (present >= 3) return 'high';
  if (present >= 2) return 'medium';
  return 'low';
}

export async function scrapeUrlMetadata(url: string): Promise<NormalizedLookupResult> {
  const headers = {
    'User-Agent':
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    Accept: 'text/html,application/xhtml+xml'
  };
  const res = await axios.get<string>(url, { timeout: 8000, headers });
  const html = res.data || '';
  const $ = cheerio.load(html);

  const titleTag = $('title').first().text().trim();
  const ogTitle = $('meta[property="og:title"]').attr('content')?.trim();
  const metaDesc =
    $('meta[name="description"]').attr('content')?.trim() ||
    $('meta[property="og:description"]').attr('content')?.trim();
  const authorMeta =
    $('meta[name="author"]').attr('content')?.trim() ||
    $('meta[property="article:author"]').attr('content')?.trim();
  const pubDate =
    $('meta[property="article:published_time"]').attr('content')?.trim() ||
    $('meta[name="date"]').attr('content')?.trim() ||
    $('time[datetime]').attr('datetime')?.trim();

  // Prefer og:title then <title>
  let title = ogTitle || titleTag || '';
  title = normalizeTitle(stripSiteSuffix(title));

  // Source type heuristics
  const host = new URL(url).hostname;
  const isYouTube = /youtube\.com|youtu\.be/i.test(host);
  const sourceType: ReferenceMetadata['sourceType'] = isYouTube ? 'video' : 'website';

  const md: ReferenceMetadata = {
    sourceType,
    title,
    authors: authorMeta ? [{ family: authorMeta }] : [],
    year: pubDate ? pubDate.slice(0, 4) : undefined,
    url
  };

  const confidence = computeConfidence({
    title,
    description: metaDesc,
    author: authorMeta,
    pubDate
  });

  return { confidence, metadata: normalizeMetadata(md) };
}


