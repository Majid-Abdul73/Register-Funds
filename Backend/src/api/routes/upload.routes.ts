import { Router } from 'express';
import { uploadFile, uploadMiddleware, uploadMultipleFiles, uploadMultipleMiddleware, checkFileStatus } from '../controllers/upload.controller';
import { authenticate } from '../middleware/auth';

const router = Router();

// Upload single file (requires authentication)
router.post('/', authenticate, uploadMiddleware, uploadFile);

// Upload multiple files (requires authentication)
router.post('/multiple', authenticate, uploadMultipleMiddleware, uploadMultipleFiles);

// Check file status (requires authentication)
router.get('/status', authenticate, checkFileStatus);

export default router;