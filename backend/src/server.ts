import express, { type Request, type Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'node:path';
import fs from 'node:fs';
import { registerRoutes } from './routes';

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

registerRoutes(app);

// Serverless export (Vercel will use this as the request handler)
export default app;


