import { Router } from 'express';
import { createUpdate, getUpdates, getUpdateById, updateUpdate, deleteUpdate } from '../controllers/updates.controller';
import { authenticate } from '../middleware/auth';

const router = Router();

router.post('/', authenticate, createUpdate);
router.get('/', getUpdates);
router.get('/:id', getUpdateById);
router.put('/:id', authenticate, updateUpdate);
router.delete('/:id', authenticate, deleteUpdate);

export default router;