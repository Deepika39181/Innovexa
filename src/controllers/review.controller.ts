import { Request, Response, NextFunction } from 'express';
import { prisma } from '../lib/prisma';
import { asyncHandler } from '../utils/asyncHandler';
import { AppError, sendSuccess } from '../utils/apiResponse';
import { ReviewTarget } from '@prisma/client';

// Helper to update aggregated reviews
async function recomputeUserRating(userId: string) {
  const reviews = await prisma.review.findMany({
    where: { revieweeId: userId },
    select: { rating: true },
  });

  const totalReviews = reviews.length;
  const averageRating = totalReviews > 0
    ? parseFloat((reviews.reduce((acc, r) => acc + r.rating, 0) / totalReviews).toFixed(2))
    : 0;

  await prisma.user.update({
    where: { id: userId },
    data: {
      rating: averageRating,
      totalReviews,
    },
  });
}

export const createReview = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const { rating, comment, targetType, revieweeId, contractId, projectId } = req.body;

  if (!rating || rating < 1 || rating > 5) {
    return next(new AppError('Rating value must be between 1 and 5 stars.', 400));
  }

  const reviewee = await prisma.user.findUnique({ where: { id: revieweeId } });
  if (!reviewee) {
    return next(new AppError('Reviewee user not found.', 404));
  }

  // Prevent self review
  if (req.user?.id === revieweeId) {
    return next(new AppError('You cannot publish a self-assessment review.', 400));
  }

  const review = await prisma.$transaction(async (tx) => {
    const newReview = await tx.review.create({
      data: {
        rating,
        comment,
        targetType: targetType || (reviewee.role === 'CLIENT' ? ReviewTarget.CLIENT : ReviewTarget.FREELANCER),
        reviewerId: req.user!.id,
        revieweeId,
        contractId: contractId || null,
        projectId: projectId || null,
      },
    });

    return newReview;
  });

  await recomputeUserRating(revieweeId);

  return sendSuccess(res, review, 'Review published successfully and rating index synchronized.', 201);
});

export const getReviewsByUserId = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;

  const reviews = await prisma.review.findMany({
    where: { revieweeId: id },
    include: {
      reviewer: { select: { id: true, name: true, avatar: true } },
    },
    orderBy: { createdAt: 'desc' },
  });

  return sendSuccess(res, reviews, 'User reviews history logs fetched.');
});

export const updateReview = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const { rating, comment } = req.body;

  const review = await prisma.review.findUnique({ where: { id } });
  if (!review) {
    return next(new AppError('Review log not found.', 404));
  }

  if (review.reviewerId !== req.user?.id && req.user?.role !== 'ADMIN') {
    return next(new AppError('You do not have permission to alter this review.', 403));
  }

  const updated = await prisma.review.update({
    where: { id },
    data: {
      rating,
      comment,
    },
  });

  await recomputeUserRating(review.revieweeId);

  return sendSuccess(res, updated, 'Review log altered and rating average refreshed.');
});

export const deleteReview = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;

  const review = await prisma.review.findUnique({ where: { id } });
  if (!review) {
    return next(new AppError('Review log not found.', 404));
  }

  if (review.reviewerId !== req.user?.id && req.user?.role !== 'ADMIN') {
    return next(new AppError('You do not have permission to delete this review.', 403));
  }

  await prisma.review.delete({ where: { id } });

  await recomputeUserRating(review.revieweeId);

  return sendSuccess(res, null, 'Review deleted successfully.');
});
