import { Router } from 'express';
import {
  getAdminUsers,
  verifyUserProfile,
  banUserToggle,
  getAdminProjects,
  approveProject,
  rejectProject,
  getAdminPayments,
  getAdminAnalytics,
  getAdminLogs,
  getGlobalSettings,
  updateGlobalSettings,
} from '../controllers/admin.controller';
import { protect, restrictTo } from '../middlewares/auth';

const router = Router();

// Wrap with protect and restrictTo admin
router.use(protect);
router.use(restrictTo('ADMIN'));

// Users Admin controls
router.get('/users', getAdminUsers);
router.put('/users/:id/verify', verifyUserProfile);
router.put('/users/:id/ban', banUserToggle);

// Projects Admin controls
router.get('/projects', getAdminProjects);
router.put('/projects/:id/approve', approveProject);
router.put('/projects/:id/reject', rejectProject);

// Payments controls
router.get('/payments', getAdminPayments);

// System Logs, Analytics and Global Settings
router.get('/analytics', getAdminAnalytics);
router.get('/logs', getAdminLogs);
router.get('/settings', getGlobalSettings);
router.put('/settings', updateGlobalSettings);

export default router;
