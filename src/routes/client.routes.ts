import { Router } from 'express';
import {
  getClientDashboard,
  getClientAnalytics,
  getSavedFreelancers,
  saveFreelancer,
  unsaveFreelancer,
} from '../controllers/client.controller';
import { protect, restrictTo } from '../middlewares/auth';

const router = Router();

// Secure all client routes
router.use(protect);
router.use(restrictTo('CLIENT', 'ADMIN'));

router.get('/dashboard', getClientDashboard);
router.get('/analytics', getClientAnalytics);
router.get('/saved-freelancers', getSavedFreelancers);
router.post('/save-freelancer/:id', saveFreelancer);
router.delete('/save-freelancer/:id', unsaveFreelancer);

export default router;
