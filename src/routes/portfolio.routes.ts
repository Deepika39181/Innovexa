import { Router } from 'express';
import {
  getMyPortfolio,
  createPortfolioItem,
  updatePortfolioItem,
  deletePortfolioItem,
} from '../controllers/portfolio.controller';
import { protect, restrictTo } from '../middlewares/auth';

const router = Router();

router.use(protect);

router.get('/me', restrictTo('FREELANCER'), getMyPortfolio);
router.post('/', restrictTo('FREELANCER'), createPortfolioItem);
router.put('/:id', updatePortfolioItem);
router.delete('/:id', deletePortfolioItem);

export default router;
