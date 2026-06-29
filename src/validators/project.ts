import { z } from 'zod';
import { ProjectVisibility } from '@prisma/client';

export const createProjectSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters'),
  description: z.string().min(20, 'Description must be at least 20 characters'),
  budget: z.number().positive('Budget must be a positive number'),
  category: z.string().optional(),
  skills: z.array(z.string()).min(1, 'Specify at least 1 required skill'),
  deadline: z.string().datetime().optional().or(z.literal('')),
  experienceLevel: z.string().optional(),
  duration: z.string().optional(),
  visibility: z.nativeEnum(ProjectVisibility).optional(),
  remote: z.boolean().optional(),
  location: z.string().optional(),
  categoryId: z.string().optional(),
});

export const updateProjectSchema = createProjectSchema.partial();
