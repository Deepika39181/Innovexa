import { z } from 'zod';
import { ContractStatus } from '@prisma/client';

export const createContractSchema = z.object({
  projectId: z.string().uuid('Invalid project ID'),
  freelancerId: z.string().uuid('Invalid freelancer ID'),
  bidId: z.string().uuid('Invalid bid ID').optional(),
  agreedBudget: z.number().positive('Budget must be positive'),
  deadline: z.string().datetime().optional().or(z.literal('')),
});

export const updateContractSchema = createContractSchema.partial();

export const updateContractStatusSchema = z.object({
  status: z.nativeEnum(ContractStatus),
});
