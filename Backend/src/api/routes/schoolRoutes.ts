import { Router } from 'express';
import { createSchool, getSchool, updateSchool } from '../controllers/schoolController';
import { authenticate } from '../middleware/auth';

const router = Router();

router.post('/', authenticate, createSchool);
// Split into two separate routes instead of using optional parameter
router.get('/', authenticate, getSchool);
router.get('/:id', authenticate, getSchool);
router.put('/', authenticate, updateSchool);
router.put('/:id', authenticate, updateSchool);

export default router;