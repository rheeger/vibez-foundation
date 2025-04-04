import { Router } from 'express';
import { NotFoundError } from '../utils/errors';
import authRoutes from './auth';
import fundsRoutes from './funds';

const router = Router();

// Health check route
router.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'VIBEZ Foundation API'
  });
});

// Authentication routes
router.use('/auth', authRoutes);

// Version 1 API routes
router.use('/funds', fundsRoutes);
// router.use('/v1/users', userRoutes);
// router.use('/v1/organizations', organizationRoutes);
// router.use('/v1/donations', donationRoutes);

// Catch all for undefined routes
router.all('*', (req, res, next) => {
  next(new NotFoundError(`API endpoint not found: ${req.method} ${req.originalUrl}`));
});

export default router; 