import { Router } from 'express';
import { login, register, resetPassword, verifyToken } from '../controllers/auth.controller';
import { authenticate } from '../middleware/auth';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.post('/reset-password', resetPassword);
router.get('/verify', authenticate, verifyToken);

export default router;