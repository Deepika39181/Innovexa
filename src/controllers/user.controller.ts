import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcrypt';
import { prisma } from '../lib/prisma';
import { asyncHandler } from '../utils/asyncHandler';
import { AppError, sendSuccess } from '../utils/apiResponse';
import { changePasswordSchema } from '../validators/auth';

export const getMeProfile = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    return next(new AppError('Unauthorized', 401));
  }

  const profile = await prisma.user.findUnique({
    where: { id: req.user.id },
    include: {
      clientProfile: true,
      freelancerProfile: true,
      adminProfile: true,
    },
  });

  if (!profile) {
    return next(new AppError('User profile not found.', 404));
  }

  return sendSuccess(res, profile, 'Profile retrieved successfully.');
});

export const updateMeProfile = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    return next(new AppError('Unauthorized', 401));
  }

  const { name, bio, portfolio, github, linkedin, phone, location, skills, experience, hourlyRate, availability, companyName, website, title } = req.body;

  const updatedUser = await prisma.$transaction(async (tx) => {
    const user = await tx.user.update({
      where: { id: req.user!.id },
      data: {
        name,
        bio,
        portfolio,
        github,
        linkedin,
        phone,
        location,
        skills,
        experience,
        hourlyRate,
        availability,
        profileCompleted: true,
      },
    });

    if (req.user!.role === 'CLIENT') {
      await tx.clientProfile.upsert({
        where: { userId: req.user!.id },
        update: { companyName, website },
        create: { userId: req.user!.id, companyName, website },
      });
    } else if (req.user!.role === 'FREELANCER') {
      await tx.freelancerProfile.upsert({
        where: { userId: req.user!.id },
        update: { title, skills: skills || [], experience, hourlyRate, availableForWork: availability !== undefined ? availability : true },
        create: { userId: req.user!.id, title, skills: skills || [], experience, hourlyRate, availableForWork: true },
      });
    }

    return user;
  });

  const fullProfile = await prisma.user.findUnique({
    where: { id: updatedUser.id },
    include: { clientProfile: true, freelancerProfile: true },
  });

  return sendSuccess(res, fullProfile, 'Profile updated successfully.');
});

export const getUserById = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;

  const user = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      avatar: true,
      bio: true,
      portfolio: true,
      github: true,
      linkedin: true,
      location: true,
      skills: true,
      experience: true,
      hourlyRate: true,
      availability: true,
      rating: true,
      totalReviews: true,
      completedProjects: true,
      totalEarnings: true,
      totalSpent: true,
      isVerified: true,
      createdAt: true,
      clientProfile: true,
      freelancerProfile: true,
      portfolioItems: true,
    },
  });

  if (!user) {
    return next(new AppError('User not found.', 404));
  }

  return sendSuccess(res, user, 'User retrieved successfully.');
});

export const getUserReviews = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;

  const reviews = await prisma.review.findMany({
    where: { revieweeId: id },
    include: {
      reviewer: {
        select: { id: true, name: true, avatar: true },
      },
      project: {
        select: { id: true, title: true },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  return sendSuccess(res, reviews, 'Reviews retrieved successfully.');
});

export const changePassword = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    return next(new AppError('Unauthorized', 401));
  }

  const parsed = changePasswordSchema.parse(req.body);

  const user = await prisma.user.findUnique({
    where: { id: req.user.id },
  });

  if (!user) {
    return next(new AppError('User not found.', 404));
  }

  const isPasswordValid = await bcrypt.compare(parsed.currentPassword, user.password);
  if (!isPasswordValid) {
    return next(new AppError('Current password is incorrect.', 400));
  }

  const hashedNewPassword = await bcrypt.hash(parsed.newPassword, 12);

  await prisma.user.update({
    where: { id: req.user.id },
    data: { password: hashedNewPassword },
  });

  return sendSuccess(res, null, 'Password updated successfully.');
});
