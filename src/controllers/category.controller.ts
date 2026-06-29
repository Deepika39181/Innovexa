import { Request, Response, NextFunction } from 'express';
import { prisma } from '../lib/prisma';
import { asyncHandler } from '../utils/asyncHandler';
import { sendSuccess, AppError } from '../utils/apiResponse';

// CATEGORIES
export const getCategories = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const categories = await prisma.category.findMany({
    orderBy: { name: 'asc' },
  });
  return sendSuccess(res, categories, 'Categories fetched successfully.');
});

export const createCategory = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const { name, description } = req.body;

  if (!name) {
    return next(new AppError('Category name is required.', 400));
  }

  const category = await prisma.category.create({
    data: { name, description },
  });

  return sendSuccess(res, category, 'Category created successfully.', 201);
});

export const updateCategory = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const { name, description } = req.body;

  const category = await prisma.category.findUnique({ where: { id } });
  if (!category) {
    return next(new AppError('Category not found.', 404));
  }

  const updated = await prisma.category.update({
    where: { id },
    data: { name, description },
  });

  return sendSuccess(res, updated, 'Category updated successfully.');
});

export const deleteCategory = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;

  const category = await prisma.category.findUnique({ where: { id } });
  if (!category) {
    return next(new AppError('Category not found.', 404));
  }

  await prisma.category.delete({ where: { id } });

  return sendSuccess(res, null, 'Category deleted successfully.');
});


// SKILLS
export const getSkills = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const skills = await prisma.skill.findMany({
    orderBy: { name: 'asc' },
  });
  return sendSuccess(res, skills, 'Skills fetched successfully.');
});

export const createSkill = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const { name } = req.body;

  if (!name) {
    return next(new AppError('Skill name is required.', 400));
  }

  const skill = await prisma.skill.create({
    data: { name },
  });

  return sendSuccess(res, skill, 'Skill created successfully.', 201);
});

export const updateSkill = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const { name } = req.body;

  const skill = await prisma.skill.findUnique({ where: { id } });
  if (!skill) {
    return next(new AppError('Skill not found.', 404));
  }

  const updated = await prisma.skill.update({
    where: { id },
    data: { name },
  });

  return sendSuccess(res, updated, 'Skill updated successfully.');
});

export const deleteSkill = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;

  const skill = await prisma.skill.findUnique({ where: { id } });
  if (!skill) {
    return next(new AppError('Skill not found.', 404));
  }

  await prisma.skill.delete({ where: { id } });

  return sendSuccess(res, null, 'Skill deleted successfully.');
});
