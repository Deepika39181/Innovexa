import { Request, Response, NextFunction } from 'express';
import { prisma } from '../lib/prisma';
import { asyncHandler } from '../utils/asyncHandler';
import { sendSuccess, AppError } from '../utils/apiResponse';
import { AdminActionType, ProjectStatus } from '@prisma/client';

// Helper to log admin action
async function logAdminAction(adminId: string, action: AdminActionType, targetUserId: string | null, targetId: string | null, targetType: string | null, description: string) {
  await prisma.adminLog.create({
    data: {
      action,
      adminId,
      targetUserId,
      targetId,
      targetType,
      description,
    },
  });
}

// USERS AUDITING
export const getAdminUsers = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const users = await prisma.user.findMany({
    include: {
      clientProfile: true,
      freelancerProfile: true,
    },
    orderBy: { createdAt: 'desc' },
  });
  return sendSuccess(res, users, 'Platform users list fetched successfully.');
});

export const verifyUserProfile = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;

  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) {
    return next(new AppError('User not found.', 404));
  }

  const updated = await prisma.user.update({
    where: { id },
    data: { isVerified: true },
  });

  await logAdminAction(
    req.user!.id,
    AdminActionType.VERIFY_USER,
    id,
    id,
    'USER',
    `Verified user profile for ${user.name}`
  );

  return sendSuccess(res, updated, 'User profile verified successfully.');
});

export const banUserToggle = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const { isBanned } = req.body;

  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) {
    return next(new AppError('User not found.', 404));
  }

  const updated = await prisma.user.update({
    where: { id },
    data: { isBanned: !!isBanned },
  });

  const action = isBanned ? AdminActionType.BAN_USER : AdminActionType.UNBAN_USER;
  await logAdminAction(
    req.user!.id,
    action,
    id,
    id,
    'USER',
    `${isBanned ? 'Banned' : 'Unbanned'} user profile: ${user.name}`
  );

  return sendSuccess(res, updated, `User account successfully ${isBanned ? 'banned' : 'unbanned'}.`);
});

// PROJECTS AUDITING
export const getAdminProjects = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const projects = await prisma.project.findMany({
    include: {
      client: { select: { id: true, name: true, avatar: true } },
    },
    orderBy: { createdAt: 'desc' },
  });
  return sendSuccess(res, projects, 'Platform projects overview loaded.');
});

export const approveProject = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;

  const project = await prisma.project.findUnique({ where: { id } });
  if (!project) {
    return next(new AppError('Project not found.', 404));
  }

  const updated = await prisma.project.update({
    where: { id },
    data: { status: ProjectStatus.OPEN },
  });

  await logAdminAction(
    req.user!.id,
    AdminActionType.APPROVE_PROJECT,
    project.clientId,
    id,
    'PROJECT',
    `Approved project posting: "${project.title}"`
  );

  return sendSuccess(res, updated, 'Project posting approved successfully.');
});

export const rejectProject = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const { reason } = req.body;

  const project = await prisma.project.findUnique({ where: { id } });
  if (!project) {
    return next(new AppError('Project not found.', 404));
  }

  const updated = await prisma.project.update({
    where: { id },
    data: { status: ProjectStatus.REJECTED },
  });

  await logAdminAction(
    req.user!.id,
    AdminActionType.REJECT_PROJECT,
    project.clientId,
    id,
    'PROJECT',
    `Rejected project posting: "${project.title}". Reason: ${reason || 'N/A'}`
  );

  return sendSuccess(res, updated, 'Project posting rejected.');
});

// PAYMENTS AUDIT
export const getAdminPayments = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const payments = await prisma.payment.findMany({
    include: {
      payer: { select: { id: true, name: true } },
      receiver: { select: { id: true, name: true } },
    },
    orderBy: { createdAt: 'desc' },
  });
  return sendSuccess(res, payments, 'Administrative payment audit logs fetched.');
});

// PLATFORM ANALYTICS
export const getAdminAnalytics = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const userCount = await prisma.user.count();
  const projectCount = await prisma.project.count();
  const contractCount = await prisma.contract.count();

  const activeEscrowSum = await prisma.payment.aggregate({
    _sum: { amount: true },
    where: { status: 'ESCROWED' },
  });

  const totalEarningsSum = await prisma.payment.aggregate({
    _sum: { amount: true },
    where: { status: 'RELEASED' },
  });

  const categoryBreakdown = await prisma.project.groupBy({
    by: ['category'],
    _count: { id: true },
  });

  return sendSuccess(
    res,
    {
      counters: {
        totalUsers: userCount,
        totalProjects: projectCount,
        totalContracts: contractCount,
        escrowHeld: activeEscrowSum._sum.amount || 0,
        volumeProcessed: totalEarningsSum._sum.amount || 0,
      },
      categoryBreakdown,
    },
    'Global analytics metrics aggregated.'
  );
});

// ADMIN LOGS
export const getAdminLogs = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const logs = await prisma.adminLog.findMany({
    include: {
      admin: { select: { id: true, name: true } },
      targetUser: { select: { id: true, name: true } },
    },
    orderBy: { createdAt: 'desc' },
  });
  return sendSuccess(res, logs, 'Admin action logs fetched.');
});

// GLOBAL SETTINGS
export const getGlobalSettings = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const settings = await prisma.globalSetting.findMany();
  // Format as simpler key-value object
  const formatted = settings.reduce((acc: any, s) => {
    acc[s.key] = s.value;
    return acc;
  }, {});

  return sendSuccess(res, formatted, 'Platform configurations loaded.');
});

export const updateGlobalSettings = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const settingsObj = req.body; // e.g. { platform_fee_percent: "5", tax_rate_percent: "18" }

  const operations = Object.keys(settingsObj).map((key) => {
    return prisma.globalSetting.upsert({
      where: { key },
      update: { value: String(settingsObj[key]) },
      create: { key, value: String(settingsObj[key]) },
    });
  });

  await prisma.$transaction(operations);

  return sendSuccess(res, settingsObj, 'Platform configurations updated successfully.');
});
