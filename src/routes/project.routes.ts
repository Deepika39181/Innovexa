import { Router } from "express";
import { UserRole } from "@prisma/client";
import {
  getProjects,
  createProject,
  getProjectById,
  updateProject,
  deleteProject,
  getMyProjects,
  getSavedProjects,
  saveProject,
  unsaveProject,
} from "../controllers/project.controller";
import { protect, restrictTo } from "../middlewares/auth";

const router = Router();

// Public routes
router.get("/", getProjects);

// Specific routes first
router.get(
  "/client/my-projects",
  protect,
  restrictTo(UserRole.CLIENT, UserRole.ADMIN),
  getMyProjects
);

router.get(
  "/freelancer/saved",
  protect,
  restrictTo(UserRole.FREELANCER),
  getSavedProjects
);

// Client/Admin create project
router.post(
  "/",
  protect,
  restrictTo(UserRole.CLIENT, UserRole.ADMIN),
  createProject
);

// Freelancer save/unsave project
router.post(
  "/:id/save",
  protect,
  restrictTo(UserRole.FREELANCER),
  saveProject
);

router.delete(
  "/:id/save",
  protect,
  restrictTo(UserRole.FREELANCER),
  unsaveProject
);

// Client/Admin update/delete project
router.put(
  "/:id",
  protect,
  restrictTo(UserRole.CLIENT, UserRole.ADMIN),
  updateProject
);

router.delete(
  "/:id",
  protect,
  restrictTo(UserRole.CLIENT, UserRole.ADMIN),
  deleteProject
);

// Dynamic route always last
router.get("/:id", getProjectById);

export default router;