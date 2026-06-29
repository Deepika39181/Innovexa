import { Router } from 'express';
import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  getSkills,
  createSkill,
  updateSkill,
  deleteSkill,
} from '../controllers/category.controller';
import { protect, restrictTo } from '../middlewares/auth';

const router = Router();

// Public reads
router.get('/categories', getCategories);
router.get('/skills', getSkills);

// Admin writes (mounted relative to admin routes, but kept here for logical grouping)
router.post('/admin/categories', protect, restrictTo('ADMIN'), createCategory);
router.put('/admin/categories/:id', protect, restrictTo('ADMIN'), updateCategory);
router.delete('/admin/categories/:id', protect, restrictTo('ADMIN'), deleteCategory);

router.post('/admin/skills', protect, restrictTo('ADMIN'), createSkill);
router.put('/admin/skills/:id', protect, restrictTo('ADMIN'), updateSkill);
router.delete('/admin/skills/:id', protect, restrictTo('ADMIN'), deleteSkill);

export default router;
