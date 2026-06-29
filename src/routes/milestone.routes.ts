import { Router } from 'express';
import {
  createMilestone,
  updateMilestone,
  submitMilestone,
  approveMilestone,
  requestChangesOnMilestone,
} from '../controllers/milestone.controller';
import { protect, restrictTo } from '../middlewares/auth';

const router = Router();

router.use(protect);

// Nested routes under contracts
router.post('/contract/:id/milestones', restrictTo('CLIENT', 'ADMIN'), createMilestone);

// Direct milestone operations
router.put('/:id', restrictTo('CLIENT', 'ADMIN'), updateMilestone);
router.post('/:id/submit', restrictTo('FREELANCER'), submitMilestone);
router.post('/:id/approve', restrictTo('CLIENT', 'ADMIN'), approveMilestone);
router.post('/:id/request-changes', restrictTo('CLIENT', 'ADMIN'), requestChangesOnMilestone);

export default router;
