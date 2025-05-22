import { Router } from 'express';
import userRoutes from './user.routes';
import authRoutes from './auth.routes';
import moduleRoutes from './module.routes';

const router = Router();

router.use('/users', userRoutes);
router.use('/auth', authRoutes);
router.use('/modules', moduleRoutes);

export default router;
