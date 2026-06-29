import { Router } from 'express';
import { getMeProfile, updateMeProfile, getUserById, getUserReviews, changePassword } from '../controllers/user.controller';
import { protect } from '../middlewares/auth';

const router = Router();

// Public routes
router.get('/:id', getUserById);
router.get('/:id/reviews', getUserReviews);

// Protected routes
router.get('/me', protect, getMeProfile);
router.put('/me', protect, updateMeProfile);
router.put('/change-password', protect, changePassword);

export default router;
