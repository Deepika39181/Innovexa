import { Router } from 'express';
import {
  getContracts,
  getContractById,
  createContract,
  updateContract,
  updateContractStatus,
} from '../controllers/contract.controller';
import { protect, restrictTo } from '../middlewares/auth';

const router = Router();

router.use(protect);

router.get('/', getContracts);
router.get('/:id', getContractById);
router.post('/', restrictTo('CLIENT', 'ADMIN'), createContract);
router.put('/:id', restrictTo('CLIENT', 'ADMIN'), updateContract);
router.put('/:id/status', updateContractStatus);

export default router;
