import { Request, Response, NextFunction } from 'express';
import { prisma } from '../lib/prisma';
import { asyncHandler } from '../utils/asyncHandler';
import { AppError, sendSuccess } from '../utils/apiResponse';
import { createProjectSchema, updateProjectSchema } from '../validators/project';
import { ProjectStatus } from '@prisma/client';

export const getProjects = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const {
    search,
    category,
    minBudget,
    maxBudget,
    remote,
    experienceLevel,
    skills,
    sortBy = 'createdAt',
    sortOrder = 'desc',
    page = '1',
    limit = '10',
  } = req.query;

  const parsedPage = Math.max(1, parseInt(page as string, 10));
  const parsedLimit = Math.max(1, parseInt(limit as string, 10));
  const skip = (parsedPage - 1) * parsedLimit;

  // Build prisma query condition clauses
  const whereClause: any = {
    isActive: true,
    status: ProjectStatus.OPEN, // By default only show OPEN projects
  };

  if (search) {
    whereClause.OR = [
      { title: { contains: search as string, mode: 'insensitive' } },
      { description: { contains: search as string, mode: 'insensitive' } },
    ];
  }

  if (category) {
    whereClause.category = category as string;
  }

  if (minBudget || maxBudget) {
    whereClause.budget = {};
    if (minBudget) {
      whereClause.budget.gte = parseFloat(minBudget as string);
    }
    if (maxBudget) {
      whereClause.budget.lte = parseFloat(maxBudget as string);
    }
  }

  if (remote !== undefined) {
    whereClause.remote = remote === 'true';
  }

  if (experienceLevel) {
    whereClause.experienceLevel = experienceLevel as string;
  }

  if (skills) {
    const skillsList = (skills as string).split(',');
    whereClause.skills = { hasSome: skillsList };
  }

  // Count total matches
  const totalItems = await prisma.project.count({ where: whereClause });

  // Get matching projects
  const projects = await prisma.project.findMany({
    where: whereClause,
    include: {
      client: {
        select: { id: true, name: true, avatar: true, rating: true },
      },
      categoryRef: true,
    },
    orderBy: { [sortBy as string]: sortOrder as string },
    skip,
    take: parsedLimit,
  });

  return sendSuccess(
    res,
    {
      projects,
      pagination: {
        totalItems,
        currentPage: parsedPage,
        itemsPerPage: parsedLimit,
        totalPages: Math.ceil(totalItems / parsedLimit),
      },
    },
    'Projects fetched successfully.'
  );
});

export const createProject = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  if (!req.user || req.user.role !== 'CLIENT') {
    return next(new AppError('Only clients can publish new projects.', 403));
  }

  const parsed = createProjectSchema.parse(req.body);

  const project = await prisma.project.create({
    data: {
      title: parsed.title,
      description: parsed.description,
      budget: parsed.budget,
      category: parsed.category || null,
      skills: parsed.skills,
      deadline: parsed.deadline ? new Date(parsed.deadline) : null,
      experienceLevel: parsed.experienceLevel || null,
      duration: parsed.duration || null,
      visibility: parsed.visibility || 'PUBLIC',
      remote: parsed.remote !== undefined ? parsed.remote : true,
      location: parsed.location || null,
      clientId: req.user.id,
      status: ProjectStatus.OPEN, // Auto approve or set to Open for demo
      categoryId: parsed.categoryId || null,
    },
  });

  return sendSuccess(res, project, 'Project created successfully.', 201);
});

export const getProjectById = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;

  const project = await prisma.project.findUnique({
    where: { id },
    include: {
      client: {
        select: {
          id: true,
          name: true,
          email: true,
          avatar: true,
          rating: true,
          totalReviews: true,
          completedProjects: true,
          createdAt: true,
        },
      },
      bids: {
        include: {
          freelancer: {
            select: { id: true, name: true, avatar: true, rating: true },
          },
        },
      },
      attachments: true,
    },
  });

  if (!project) {
    return next(new AppError('Project not found.', 404));
  }

  return sendSuccess(res, project, 'Project fetched successfully.');
});

export const updateProject = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const parsed = updateProjectSchema.parse(req.body);

  const existingProject = await prisma.project.findUnique({
    where: { id },
  });

  if (!existingProject) {
    return next(new AppError('Project not found.', 404));
  }

  // Authorize: Client owner or Admin
  if (existingProject.clientId !== req.user?.id && req.user?.role !== 'ADMIN') {
    return next(new AppError('You do not have permission to edit this project.', 403));
  }

  const updatedProject = await prisma.project.update({
    where: { id },
    data: {
      title: parsed.title,
      description: parsed.description,
      budget: parsed.budget,
      category: parsed.category,
      skills: parsed.skills,
      deadline: parsed.deadline ? new Date(parsed.deadline) : undefined,
      experienceLevel: parsed.experienceLevel,
      duration: parsed.duration,
      visibility: parsed.visibility,
      remote: parsed.remote,
      location: parsed.location,
      categoryId: parsed.categoryId,
    },
  });

  return sendSuccess(res, updatedProject, 'Project updated successfully.');
});

export const deleteProject = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;

  const existingProject = await prisma.project.findUnique({
    where: { id },
  });

  if (!existingProject) {
    return next(new AppError('Project not found.', 404));
  }

  // Authorize: Client owner or Admin
  if (existingProject.clientId !== req.user?.id && req.user?.role !== 'ADMIN') {
    return next(new AppError('You do not have permission to delete this project.', 403));
  }

  // Hard or soft delete - we'll update active state or complete delete
  await prisma.project.delete({
    where: { id },
  });

  return sendSuccess(res, null, 'Project deleted successfully.');
});

export const getMyProjects = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  if (req.user?.role !== 'CLIENT') {
    return next(new AppError('Only clients can view posted projects list.', 403));
  }

  const projects = await prisma.project.findMany({
    where: { clientId: req.user.id },
    include: {
      _count: {
        select: { bids: true },
      },
      contracts: true,
    },
    orderBy: { createdAt: 'desc' },
  });

  return sendSuccess(res, projects, 'Client projects fetched successfully.');
});

export const getSavedProjects = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  if (req.user?.role !== 'FREELANCER') {
    return next(new AppError('Only freelancers can view saved projects.', 403));
  }

  const saved = await prisma.savedProject.findMany({
    where: { freelancerId: req.user.id },
    include: {
      project: {
        include: {
          client: {
            select: { id: true, name: true, avatar: true },
          },
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  return sendSuccess(res, saved, 'Saved projects fetched successfully.');
});

export const saveProject = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;

  if (req.user?.role !== 'FREELANCER') {
    return next(new AppError('Only freelancers can save projects.', 403));
  }

  const project = await prisma.project.findUnique({ where: { id } });
  if (!project) {
    return next(new AppError('Project not found.', 404));
  }

  const existingSave = await prisma.savedProject.findUnique({
    where: {
      freelancerId_projectId: {
        freelancerId: req.user.id,
        projectId: id,
      },
    },
  });

  if (existingSave) {
    return sendSuccess(res, existingSave, 'Project already saved.');
  }

  const saved = await prisma.savedProject.create({
    data: {
      freelancerId: req.user.id,
      projectId: id,
    },
  });

  return sendSuccess(res, saved, 'Project saved successfully.');
});

export const unsaveProject = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;

  if (req.user?.role !== 'FREELANCER') {
    return next(new AppError('Only freelancers can unsave projects.', 403));
  }

  await prisma.savedProject.delete({
    where: {
      freelancerId_projectId: {
        freelancerId: req.user.id,
        projectId: id,
      },
    },
  });

  return sendSuccess(res, null, 'Project unsaved successfully.');
});
