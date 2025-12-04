import { Router } from 'express';
import { formatController } from '../controllers/formatController';

export const formatRoutes = Router();
formatRoutes.post('/api/format', formatController);


