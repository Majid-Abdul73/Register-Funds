import { Router } from 'express';
import { uploadFile, uploadMiddleware } from '../controllers/upload.controller';
import { authenticate } from '../middleware/auth';

const router = Router();

// Upload single file (requires authentication)
router.post('/', authenticate, uploadMiddleware, uploadFile);

export default router;