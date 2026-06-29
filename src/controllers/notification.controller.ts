import { Request, Response, NextFunction } from 'express';
import { prisma } from '../lib/prisma';
import { asyncHandler } from '../utils/asyncHandler';
import { sendSuccess, AppError } from '../utils/apiResponse';

export const getMyNotifications = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    return next(new AppError('Unauthorized', 401));
  }

  const notifications = await prisma.notification.findMany({
    where: { userId: req.user.id },
    orderBy: { createdAt: 'desc' },
    take: 50,
  });

  return sendSuccess(res, notifications, 'Notifications log fetched.');
});

export const markNotificationRead = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;

  const notification = await prisma.notification.findUnique({ where: { id } });
  if (!notification) {
    return next(new AppError('Notification alert not found.', 404));
  }

  if (notification.userId !== req.user?.id) {
    return next(new AppError('You do not own this notification.', 403));
  }

  const updated = await prisma.notification.update({
    where: { id },
    data: { isRead: true },
  });

  return sendSuccess(res, updated, 'Notification marked as read.');
});

export const markAllNotificationsRead = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    return next(new AppError('Unauthorized', 401));
  }

  await prisma.notification.updateMany({
    where: { userId: req.user.id, isRead: false },
    data: { isRead: true },
  });

  return sendSuccess(res, null, 'All notifications marked as read.');
});
