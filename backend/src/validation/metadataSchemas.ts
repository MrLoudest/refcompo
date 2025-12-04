import { z } from 'zod';
import { metadataSchema } from './formatSchemas';

export const normalizedLookupResultSchema = z.object({
  confidence: z.enum(['high', 'medium', 'low']),
  metadata: metadataSchema
});


