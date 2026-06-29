import { Router } from "express";
import { UserRole } from "@prisma/client";
import { protect, restrictTo } from "../middlewares/auth";
import {
  fundProjectEscrow,
  releaseEscrowFunds,
  withdrawEarnings,
  getPaymentHistory,
  getEarningsBreakdown,
  getInvoiceById,
} from "../controllers/payment.controller";

const router = Router();

router.use(protect);

router.post(
  "/fund",
  protect,
  restrictTo(UserRole.CLIENT, UserRole.ADMIN),
  fundProjectEscrow
);

router.post(
  "/release",
  protect,
  restrictTo(UserRole.CLIENT, UserRole.ADMIN),
  releaseEscrowFunds
);

router.post(
  "/withdraw",
  protect,
  restrictTo(UserRole.FREELANCER),
  withdrawEarnings
);

router.get(
  "/history",
  protect,
  getPaymentHistory
);

router.get(
  "/earnings",
  protect,
  restrictTo(UserRole.FREELANCER),
  getEarningsBreakdown
);

router.get(
  "/invoice/:id",
  protect,
  getInvoiceById
);

export default router;