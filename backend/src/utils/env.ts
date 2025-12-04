import { z } from 'zod';

const EnvSchema = z.object({
  GOOGLE_BOOKS_API_KEY: z.string().optional(),
  CROSSREF_API_URL: z.string().optional(),
  BACKEND_URL: z.string().optional(),
  FRONTEND_URL: z.string().optional()
});

export type Env = z.infer<typeof EnvSchema>;
export const env: Env = EnvSchema.parse(process.env);


