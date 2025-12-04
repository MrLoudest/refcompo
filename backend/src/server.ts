import express, { type Request, type Response, type NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'node:path';
import fs from 'node:fs';
import { formatRoutes } from './routes/formatRoutes';
import { lookupRoutes } from './routes/lookupRoutes';
import { AppError } from './errors/AppError';

// Load env from package dir or root .env.local (for local dev)
dotenv.config();
const rootEnv = path.resolve(process.cwd(), '../.env.local');
if (fs.existsSync(rootEnv)) {
  dotenv.config({ path: rootEnv });
}

const app = express();
app.use(express.json());
app.use(
  cors({
    origin: process.env.FRONTEND_URL || '*',
    credentials: true
  })
);

// Health
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({ data: { status: 'ok', timestamp: new Date().toISOString() } });
});

// API routes
app.use(formatRoutes);
app.use(lookupRoutes);

// Global error handler
// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((err: unknown, _req: Request, res: Response, _next: NextFunction) => {
  if (err && typeof err === 'object' && 'code' in (err as any)) {
    const e = err as AppError;
    return res.status(e.status).json({ error: { code: e.code, message: e.message, details: e.details } });
  }
  // eslint-disable-next-line no-console
  console.error(err);
  return res.status(500).json({ error: { code: 'INTERNAL_ERROR', message: 'Internal server error' } });
});

// Serverless export (Vercel will use this as the request handler)
export default app;


