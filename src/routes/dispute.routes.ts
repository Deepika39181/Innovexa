import { Router } from 'express';
import {
  createDispute,
  getDisputes,
  getDisputeById,
  resolveDispute,
} from '../controllers/dispute.controller';
import { protect, restrictTo } from '../middlewares/auth';

const router = Router();

router.use(protect);

router.post('/', createDispute);
router.get('/', getDisputes);
router.get('/:id', getDisputeById);

// Admin-only resolution route
router.put('/admin/disputes/:id/resolve', restrictTo('ADMIN'), resolveDispute);

export default router;
