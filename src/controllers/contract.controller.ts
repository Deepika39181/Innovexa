import { Request, Response, NextFunction } from 'express';
import { prisma } from '../lib/prisma';
import { asyncHandler } from '../utils/asyncHandler';
import { AppError, sendSuccess } from '../utils/apiResponse';
import { createContractSchema, updateContractSchema, updateContractStatusSchema } from '../validators/contract';
import { ContractStatus, ProjectStatus } from '@prisma/client';

export const getContracts = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    return next(new AppError('Unauthorized', 401));
  }

  const whereClause: any = {};

  if (req.user.role === 'CLIENT') {
    whereClause.clientId = req.user.id;
  } else if (req.user.role === 'FREELANCER') {
    whereClause.freelancerId = req.user.id;
  }

  const contracts = await prisma.contract.findMany({
    where: whereClause,
    include: {
      project: {
        select: { id: true, title: true, budget: true },
      },
      client: {
        select: { id: true, name: true, avatar: true },
      },
      freelancer: {
        select: { id: true, name: true, avatar: true },
      },
      milestones: true,
    },
    orderBy: { startDate: 'desc' },
  });

  return sendSuccess(res, contracts, 'Contracts fetched successfully.');
});

export const getContractById = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;

  const contract = await prisma.contract.findUnique({
    where: { id },
    include: {
      project: true,
      client: { select: { id: true, name: true, email: true, avatar: true } },
      freelancer: { select: { id: true, name: true, email: true, avatar: true } },
      milestones: { orderBy: { order: 'asc' } },
      deliverables: true,
      payments: true,
    },
  });

  if (!contract) {
    return next(new AppError('Contract not found.', 404));
  }

  // Access check
  if (
    contract.clientId !== req.user?.id &&
    contract.freelancerId !== req.user?.id &&
    req.user?.role !== 'ADMIN'
  ) {
    return next(new AppError('You do not have permission to view this contract.', 403));
  }

  return sendSuccess(res, contract, 'Contract retrieved successfully.');
});

export const createContract = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  if (req.user?.role !== 'CLIENT' && req.user?.role !== 'ADMIN') {
    return next(new AppError('Only clients can generate contract templates.', 403));
  }

  const parsed = createContractSchema.parse(req.body);

  const contract = await prisma.$transaction(async (tx) => {
    // 1. Create the contract
    const newContract = await tx.contract.create({
      data: {
        projectId: parsed.projectId,
        clientId: req.user!.id,
        freelancerId: parsed.freelancerId,
        bidId: parsed.bidId || null,
        agreedBudget: parsed.agreedBudget,
        deadline: parsed.deadline ? new Date(parsed.deadline) : null,
        status: ContractStatus.ACTIVE,
      },
    });

    // 2. Mark project status to IN_PROGRESS
    await tx.project.update({
      where: { id: parsed.projectId },
      data: { status: ProjectStatus.IN_PROGRESS },
    });

    return newContract;
  });

  return sendSuccess(res, contract, 'Contract created and initialized successfully.', 201);
});

export const updateContract = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const parsed = updateContractSchema.parse(req.body);

  const contract = await prisma.contract.findUnique({ where: { id } });
  if (!contract) {
    return next(new AppError('Contract not found.', 404));
  }

  if (contract.clientId !== req.user?.id && req.user?.role !== 'ADMIN') {
    return next(new AppError('You do not have permission to edit this contract.', 403));
  }

  const updated = await prisma.contract.update({
    where: { id },
    data: {
      agreedBudget: parsed.agreedBudget,
      deadline: parsed.deadline ? new Date(parsed.deadline) : undefined,
    },
  });

  return sendSuccess(res, updated, 'Contract details updated.');
});

export const updateContractStatus = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const parsed = updateContractStatusSchema.parse(req.body);

  const contract = await prisma.contract.findUnique({ where: { id } });
  if (!contract) {
    return next(new AppError('Contract not found.', 404));
  }

  if (
    contract.clientId !== req.user?.id &&
    contract.freelancerId !== req.user?.id &&
    req.user?.role !== 'ADMIN'
  ) {
    return next(new AppError('Unauthorized access to contract status controls.', 403));
  }

  const updated = await prisma.$transaction(async (tx) => {
    const updatedContract = await tx.contract.update({
      where: { id },
      data: {
        status: parsed.status,
        ...(parsed.status === ContractStatus.COMPLETED && { completedAt: new Date() }),
      },
    });

    // Mirror to project status if completed
    if (parsed.status === ContractStatus.COMPLETED) {
      await tx.project.update({
        where: { id: contract.projectId },
        data: { status: ProjectStatus.COMPLETED },
      });

      // Update counters
      await tx.user.update({
        where: { id: contract.freelancerId },
        data: {
          completedProjects: { increment: 1 },
          totalEarnings: { increment: contract.agreedBudget },
        },
      });

      await tx.user.update({
        where: { id: contract.clientId },
        data: {
          totalSpent: { increment: contract.agreedBudget },
        },
      });
    }

    return updatedContract;
  });

  return sendSuccess(res, updated, `Contract status updated to ${parsed.status}.`);
});
