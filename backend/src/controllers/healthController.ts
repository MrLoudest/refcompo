import type { Request, Response } from 'express';
import type { ApiResponse, Health } from '@refcompo/shared';

export function healthController(_req: Request, res: Response<ApiResponse<Health>>) {
  res.json({
    data: {
      status: 'ok',
      timestamp: new Date().toISOString()
    }
  });
}


