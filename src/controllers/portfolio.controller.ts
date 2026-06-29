import { Request, Response, NextFunction } from 'express';
import { prisma } from '../lib/prisma';
import { asyncHandler } from '../utils/asyncHandler';
import { sendSuccess, AppError } from '../utils/apiResponse';

export const getMyPortfolio = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  if (req.user?.role !== 'FREELANCER') {
    return next(new AppError('Only freelancers maintain professional portfolios.', 403));
  }

  const items = await prisma.portfolio.findMany({
    where: { freelancerId: req.user.id },
    orderBy: { createdAt: 'desc' },
  });

  return sendSuccess(res, items, 'Portfolio items loaded.');
});

export const createPortfolioItem = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const { title, description, imageUrl, projectUrl, githubUrl, technologies, featured } = req.body;

  if (req.user?.role !== 'FREELANCER') {
    return next(new AppError('Only freelancers can create portfolio items.', 403));
  }

  if (!title) {
    return next(new AppError('Title is a required field.', 400));
  }

  const item = await prisma.portfolio.create({
    data: {
      title,
      description,
      imageUrl,
      projectUrl,
      githubUrl,
      technologies: technologies || [],
      featured: featured || false,
      freelancerId: req.user.id,
    },
  });

  return sendSuccess(res, item, 'Portfolio project published successfully.', 201);
});

export const updatePortfolioItem = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const { title, description, imageUrl, projectUrl, githubUrl, technologies, featured } = req.body;

  const item = await prisma.portfolio.findUnique({ where: { id } });
  if (!item) {
    return next(new AppError('Portfolio item not found.', 404));
  }

  if (item.freelancerId !== req.user?.id && req.user?.role !== 'ADMIN') {
    return next(new AppError('You do not have access to edit this item.', 403));
  }

  const updated = await prisma.portfolio.update({
    where: { id },
    data: {
      title,
      description,
      imageUrl,
      projectUrl,
      githubUrl,
      technologies,
      featured,
    },
  });

  return sendSuccess(res, updated, 'Portfolio item updated.');
});

export const deletePortfolioItem = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;

  const item = await prisma.portfolio.findUnique({ where: { id } });
  if (!item) {
    return next(new AppError('Portfolio item not found.', 404));
  }

  if (item.freelancerId !== req.user?.id && req.user?.role !== 'ADMIN') {
    return next(new AppError('You do not have access to delete this item.', 403));
  }

  await prisma.portfolio.delete({ where: { id } });

  return sendSuccess(res, null, 'Portfolio item deleted successfully.');
});
