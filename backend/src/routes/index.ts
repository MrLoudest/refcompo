import type { Express, Request, Response } from 'express';
import { healthController } from '../controllers/healthController';

export function registerRoutes(app: Express) {
  app.get('/health', healthController);

  app.get('/ping', (_req: Request, res: Response) => {
    res.json({ data: { message: 'pong' } });
  });
}


