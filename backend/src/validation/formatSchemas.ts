import { z } from 'zod';
import type { CitationStyle, SourceType } from '@refcompo/shared';

export const styleSchema: z.ZodType<CitationStyle> = z.enum([
  'apa7',
  'harvard',
  'mla',
  'chicago'
]);

export const sourceTypeSchema: z.ZodType<SourceType> = z.enum([
  'book',
  'journal',
  'website',
  'conference',
  'report',
  'thesis',
  'chapter',
  'video',
  'podcast'
]);

export const authorSchema = z.object({
  family: z.string().min(1),
  given: z.string().optional(),
  organization: z.boolean().optional()
});

export const metadataSchema = z.object({
  sourceType: sourceTypeSchema,
  title: z.string().min(1),
  authors: z.array(authorSchema).default([]),
  year: z.string().optional(),
  publisher: z.string().optional(),
  journal: z.string().optional(),
  volume: z.string().optional(),
  issue: z.string().optional(),
  pages: z.string().optional(),
  doi: z.string().optional(),
  url: z.string().url().optional(),
  accessed: z.string().optional(),
  conferenceName: z.string().optional(),
  thesisType: z.enum(['phd', 'masters', 'bachelor']).optional(),
  seriesTitle: z.string().optional(),
  videoChannel: z.string().optional(),
  podcastName: z.string().optional()
});

export const formatReferenceRequestSchema = z.object({
  style: styleSchema,
  metadata: metadataSchema,
  inText: z
    .object({
      firstMention: z.boolean().optional(),
      page: z.string().optional()
    })
    .optional()
});

export type FormatReferenceRequestInput = z.infer<typeof formatReferenceRequestSchema>;


