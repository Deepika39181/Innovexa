import { Request, Response, NextFunction } from 'express';
import { prisma } from '../lib/prisma';
import { asyncHandler } from '../utils/asyncHandler';
import { sendSuccess, AppError } from '../utils/apiResponse';
import { DisputeStatus, RefundStatus, PaymentStatus } from '@prisma/client';

export const createDispute = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const { reason, description, contractId, projectId, againstId } = req.body;

  if (!reason) {
    return next(new AppError('Reason is a required field.', 400));
  }

  const dispute = await prisma.dispute.create({
    data: {
      reason,
      description,
      contractId: contractId || null,
      projectId: projectId || null,
      againstId: againstId || null,
      raisedById: req.user!.id,
      status: DisputeStatus.OPEN,
    },
  });

  return sendSuccess(res, dispute, 'Dispute raised successfully. Platform arbitrators have been notified.', 201);
});

export const getDisputes = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    return next(new AppError('Unauthorized', 401));
  }

  const whereClause: any = {};

  if (req.user.role !== 'ADMIN') {
    whereClause.OR = [
      { raisedById: req.user.id },
      { againstId: req.user.id },
    ];
  }

  const disputes = await prisma.dispute.findMany({
    where: whereClause,
    include: {
      project: { select: { id: true, title: true } },
      contract: { select: { id: true, agreedBudget: true } },
      raisedBy: { select: { id: true, name: true, avatar: true } },
      against: { select: { id: true, name: true, avatar: true } },
    },
    orderBy: { createdAt: 'desc' },
  });

  return sendSuccess(res, disputes, 'Disputes list loaded.');
});

export const getDisputeById = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;

  const dispute = await prisma.dispute.findUnique({
    where: { id },
    include: {
      project: true,
      contract: true,
      raisedBy: { select: { id: true, name: true, avatar: true, role: true } },
      against: { select: { id: true, name: true, avatar: true, role: true } },
      resolvedBy: { select: { id: true, name: true } },
    },
  });

  if (!dispute) {
    return next(new AppError('Dispute record not found.', 404));
  }

  if (
    dispute.raisedById !== req.user?.id &&
    dispute.againstId !== req.user?.id &&
    req.user?.role !== 'ADMIN'
  ) {
    return next(new AppError('You do not have access to view this dispute.', 403));
  }

  return sendSuccess(res, dispute, 'Dispute resolved details.');
});

export const resolveDispute = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const { resolution, refundAmount, triggerRefund } = req.body;

  if (!resolution) {
    return next(new AppError('Resolution notes are required.', 400));
  }

  const dispute = await prisma.dispute.findUnique({
    where: { id },
    include: { contract: true },
  });

  if (!dispute) {
    return next(new AppError('Dispute record not found.', 404));
  }

  const resolved = await prisma.$transaction(async (tx) => {
    // 1. Resolve dispute
    const upDispute = await tx.dispute.update({
      where: { id },
      data: {
        status: DisputeStatus.RESOLVED,
        resolution,
        resolvedById: req.user!.id,
        resolvedAt: new Date(),
      },
    });

    // 2. Perform refund operations if triggered
    if (triggerRefund && dispute.contractId) {
      // Find payments on this contract that can be refunded
      const payment = await tx.payment.findFirst({
        where: { contractId: dispute.contractId, status: PaymentStatus.ESCROWED },
      });

      if (payment) {
        // Mark payment as refunded
        await tx.payment.update({
          where: { id: payment.id },
          data: {
            status: PaymentStatus.REFUNDED,
            refundedAt: new Date(),
          },
        });

        // Log refund object
        await tx.refund.create({
          data: {
            amount: refundAmount || payment.amount,
            reason: `Dispute resolution refund: ${resolution}`,
            status: RefundStatus.COMPLETED,
            paymentId: payment.id,
            requestedById: dispute.raisedById,
          },
        });

        // Return client budget escrow deduction
        await tx.user.update({
          where: { id: payment.payerId! },
          data: {
            totalSpent: { decrement: refundAmount || payment.amount },
          },
        });
      }
    }

    return upDispute;
  });

  return sendSuccess(res, resolved, 'Dispute successfully resolved and closed.');
});
