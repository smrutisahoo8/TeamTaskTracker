import { Router } from 'express';
import { healthCheck } from '../controllers/health.controller';

const router = Router();

// ✅ FIX: base path already added in app.ts
router.get('/', healthCheck);

export default router;