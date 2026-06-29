import { Router } from "express";
import { UserRole } from "@prisma/client";

import {
  createBid,
  getProjectBids,
  getMyBids,
  updateBid,
  updateBidStatus,
  deleteBid,
} from "../controllers/bid.controller";

import { protect, restrictTo } from "../middlewares/auth";

const router = Router();

// Freelancer places bid
router.post(
  "/project/:id/bids",
  protect,
  restrictTo(UserRole.FREELANCER),
  createBid
);

// Client/Admin view bids
router.get(
  "/project/:id/bids",
  protect,
  restrictTo(UserRole.CLIENT, UserRole.ADMIN),
  getProjectBids
);

// Freelancer/Admin own bids
router.get(
  "/my-bids",
  protect,
  restrictTo(UserRole.FREELANCER, UserRole.ADMIN),
  getMyBids
);

// Freelancer update own bid
router.put(
  "/:id",
  protect,
  restrictTo(UserRole.FREELANCER),
  updateBid
);

// Client/Admin accept/reject bid
router.put(
  "/:id/status",
  protect,
  restrictTo(UserRole.CLIENT, UserRole.ADMIN),
  updateBidStatus
);

// Freelancer/Admin delete bid
router.delete(
  "/:id",
  protect,
  restrictTo(UserRole.FREELANCER, UserRole.ADMIN),
  deleteBid
);

export default router;