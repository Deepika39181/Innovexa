import { Request, Response, NextFunction } from 'express';
import { UserRole } from '@prisma/client';
import { verifyAccessToken } from '../utils/jwt';
import { prisma } from '../lib/prisma';
import { AppError } from '../utils/apiResponse';
import { asyncHandler } from '../utils/asyncHandler';

export const protect = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  let token: string | undefined;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(new AppError('You are not logged in. Please log in to get access.', 401));
  }

  // Verify access token
  let decoded;
  try {
    decoded = verifyAccessToken(token);
  } catch (error: any) {
    return next(new AppError('Invalid or expired access token. Please log in again.', 401));
  }

  // Check if user still exists
  const user = await prisma.user.findUnique({
    where: { id: decoded.id },
    select: { id: true, email: true, role: true, isVerified: true, isBanned: true },
  });

  if (!user) {
    return next(new AppError('The user belonging to this token no longer exists.', 401));
  }

  // Check if user is banned
  if (user.isBanned) {
    return next(new AppError('Your account has been suspended by an administrator.', 403));
  }

  // Attach user info to request
  req.user = {
    id: user.id,
    email: user.email,
    role: user.role,
    isVerified: user.isVerified,
  };

  next();
});

export const restrictTo = (...roles: UserRole[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new AppError('You are not logged in. Please log in to get access.', 401));
    }

    if (!roles.includes(req.user.role)) {
      return next(new AppError('You do not have permission to perform this action.', 403));
    }

    next();
  };
};

export const requireVerified = (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    return next(new AppError('You are not logged in. Please log in to get access.', 401));
  }

  if (!req.user.isVerified) {
    return next(new AppError('Your email address is not verified. Please verify your email first.', 403));
  }

  next();
};
