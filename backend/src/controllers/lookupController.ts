import type { Request, Response } from 'express';
import type { NormalizedLookupResult } from '@refcompo/shared';
import { loadEnv } from '../config/env';
import { lookupGoogleBooksByISBN } from '../services/metadata/googleBooks';
import { lookupCrossrefByDOI } from '../services/metadata/crossRef';
import { scrapeUrlMetadata } from '../services/metadata/urlScraper';
import { badRequest } from '../errors/AppError';

export async function lookupByIsbnController(
  req: Request,
  res: Response<{ data: NormalizedLookupResult }>
) {
  const { isbn } = req.params;
  if (!isbn) throw badRequest('ISBN required');
  const env = loadEnv();
  const data = await lookupGoogleBooksByISBN(isbn, env.GOOGLE_BOOKS_API_KEY);
  res.json({ data });
}

export async function lookupByDoiController(
  req: Request,
  res: Response<{ data: NormalizedLookupResult }>
) {
  const { doi } = req.params;
  if (!doi) throw badRequest('DOI required');
  const env = loadEnv();
  const data = await lookupCrossrefByDOI(doi, env.CROSSREF_API_URL);
  res.json({ data });
}

export async function lookupByUrlController(
  req: Request,
  res: Response<{ data: NormalizedLookupResult }>
) {
  const { url } = req.query as { url?: string };
  if (!url) throw badRequest('URL required');
  const data = await scrapeUrlMetadata(url);
  res.json({ data });
}


