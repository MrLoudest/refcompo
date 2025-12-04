import { z } from 'zod';

const EnvSchema = z.object({
  NODE_ENV: z.string().optional(),
  GOOGLE_BOOKS_API_KEY: z.string().optional(),
  CROSSREF_API_URL: z.string().optional().default('https://api.crossref.org/works'),
  FRONTEND_URL: z.string().optional(),
  BACKEND_URL: z.string().optional()
});

export type AppEnv = z.infer<typeof EnvSchema>;

export function loadEnv(): AppEnv {
  return EnvSchema.parse(process.env);
}


