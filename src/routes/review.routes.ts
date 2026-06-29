import { Router } from 'express';
import {
  createReview,
  getReviewsByUserId,
  updateReview,
  deleteReview,
} from '../controllers/review.controller';
import { protect } from '../middlewares/auth';

const router = Router();

router.get('/user/:id', getReviewsByUserId);

// Protected writes
router.post('/', protect, createReview);
router.put('/:id', protect, updateReview);
router.delete('/:id', protect, deleteReview);

export default router;
