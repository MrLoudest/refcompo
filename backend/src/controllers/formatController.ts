import type { Request, Response } from 'express';
import type { FormatReferenceResponse } from '@refcompo/shared';
import { formatReferenceRequestSchema } from '../validation/formatSchemas';
import { badRequest } from '../errors/AppError';
import { formatReference, normalizeMetadata, validateReferenceMetadata } from '../services/formatEngine';

export async function formatController(
  req: Request,
  res: Response<{ data: FormatReferenceResponse }>
) {
  const parsed = formatReferenceRequestSchema.safeParse(req.body);
  if (!parsed.success) {
    throw badRequest('Invalid format request', parsed.error.flatten());
  }
  const { style, metadata } = parsed.data;
  const normalized = normalizeMetadata(metadata);
  const warnings = validateReferenceMetadata(normalized);
  const formatted = formatReference(style, normalized);
  res.json({ data: { formatted, warnings } });
}


