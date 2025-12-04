import { Router } from 'express';
import { lookupByDoiController, lookupByIsbnController, lookupByUrlController } from '../controllers/lookupController';

export const lookupRoutes = Router();
lookupRoutes.get('/api/lookup/isbn/:isbn', lookupByIsbnController);
lookupRoutes.get('/api/lookup/doi/:doi', lookupByDoiController);
lookupRoutes.get('/api/lookup/url', lookupByUrlController);


