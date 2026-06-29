import { Request, Response, NextFunction } from 'express';
import { prisma } from '../lib/prisma';
import { asyncHandler } from '../utils/asyncHandler';
import { AppError, sendSuccess } from '../utils/apiResponse';
import { MilestoneStatus, DeliverableStatus } from '@prisma/client';

export const createMilestone = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const { id: contractId } = req.params;
  const { title, description, amount, dueDate, order } = req.body;

  const contract = await prisma.contract.findUnique({ where: { id: contractId } });
  if (!contract) {
    return next(new AppError('Contract not found.', 404));
  }

  if (contract.clientId !== req.user?.id && req.user?.role !== 'ADMIN') {
    return next(new AppError('Only the employer client can add milestones.', 403));
  }

  const milestone = await prisma.milestone.create({
    data: {
      title,
      description,
      amount,
      dueDate: dueDate ? new Date(dueDate) : null,
      order: order || 1,
      contractId,
      projectId: contract.projectId,
      status: MilestoneStatus.PENDING,
    },
  });

  return sendSuccess(res, milestone, 'Milestone created successfully.', 201);
});

export const updateMilestone = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const { title, description, amount, dueDate, order, status } = req.body;

  const existingMilestone = await prisma.milestone.findUnique({
    where: { id },
    include: { contract: true },
  });

  if (!existingMilestone) {
    return next(new AppError('Milestone not found.', 404));
  }

  // Authorize
  if (existingMilestone.contract?.clientId !== req.user?.id && req.user?.role !== 'ADMIN') {
    return next(new AppError('Only the employer client can edit this milestone.', 403));
  }

  const updated = await prisma.milestone.update({
    where: { id },
    data: {
      title,
      description,
      amount,
      dueDate: dueDate ? new Date(dueDate) : undefined,
      order,
      status,
    },
  });

  return sendSuccess(res, updated, 'Milestone updated successfully.');
});

export const submitMilestone = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const { comment, fileUrl, fileName, fileType } = req.body;

  const milestone = await prisma.milestone.findUnique({
    where: { id },
    include: { contract: true },
  });

  if (!milestone) {
    return next(new AppError('Milestone not found.', 404));
  }

  if (milestone.contract?.freelancerId !== req.user?.id) {
    return next(new AppError('Only the assigned freelancer can submit deliverables for this milestone.', 403));
  }

  const updated = await prisma.$transaction(async (tx) => {
    // 1. Update milestone status
    const upMilestone = await tx.milestone.update({
      where: { id },
      data: {
        status: MilestoneStatus.SUBMITTED,
        submittedAt: new Date(),
      },
    });

    // 2. Create deliverable entry if attachment provided
    if (fileUrl) {
      await tx.deliverable.create({
        data: {
          fileName: fileName || 'deliverable.zip',
          fileUrl,
          fileType: fileType || 'archive/zip',
          status: DeliverableStatus.UPLOADED,
          contractId: milestone.contractId!,
          uploadedById: req.user!.id,
          feedback: comment,
        },
      });
    }

    return upMilestone;
  });

  return sendSuccess(res, updated, 'Milestone deliverables submitted successfully.');
});

export const approveMilestone = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;

  const milestone = await prisma.milestone.findUnique({
    where: { id },
    include: { contract: true },
  });

  if (!milestone) {
    return next(new AppError('Milestone not found.', 404));
  }

  if (milestone.contract?.clientId !== req.user?.id && req.user?.role !== 'ADMIN') {
    return next(new AppError('Only the client can approve deliverables.', 403));
  }

  const updated = await prisma.$transaction(async (tx) => {
    // 1. Mark milestone as APPROVED and PAID
    const upMilestone = await tx.milestone.update({
      where: { id },
      data: {
        status: MilestoneStatus.PAID,
        approvedAt: new Date(),
        paymentReleased: true,
      },
    });

    // 2. We should also record an escrow release payment transaction
    await tx.payment.create({
      data: {
        amount: milestone.amount,
        platformFee: Math.round(milestone.amount * 0.05), // Mock 5% fee
        currency: 'INR',
        status: 'RELEASED',
        paymentMethod: 'ESCROW',
        payerId: milestone.contract?.clientId,
        receiverId: milestone.contract?.freelancerId,
        contractId: milestone.contractId,
        milestoneId: milestone.id,
        paidAt: new Date(),
        releasedAt: new Date(),
      },
    });

    // Update freelancer's earnings in profile
    await tx.user.update({
      where: { id: milestone.contract!.freelancerId },
      data: {
        totalEarnings: { increment: milestone.amount },
      },
    });

    return upMilestone;
  });

  return sendSuccess(res, updated, 'Milestone deliverables approved and funds released from escrow.');
});

export const requestChangesOnMilestone = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const { feedback } = req.body;

  if (!feedback) {
    return next(new AppError('Feedback comment is required to request changes.', 400));
  }

  const milestone = await prisma.milestone.findUnique({
    where: { id },
    include: { contract: true },
  });

  if (!milestone) {
    return next(new AppError('Milestone not found.', 404));
  }

  if (milestone.contract?.clientId !== req.user?.id && req.user?.role !== 'ADMIN') {
    return next(new AppError('Only the client can request changes.', 403));
  }

  const updated = await prisma.milestone.update({
    where: { id },
    data: {
      status: MilestoneStatus.REJECTED, // Mark as rejected/needs revisions
      description: `${milestone.description || ''} \n\n[Client Feedback]: ${feedback}`,
    },
  });

  return sendSuccess(res, updated, 'Milestone revision feedback submitted successfully.');
});
