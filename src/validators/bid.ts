import { z } from 'zod';
import { BidStatus } from '@prisma/client';

export const createBidSchema = z.object({
  amount: z.number().positive('Bid amount must be positive'),
  proposal: z.string().min(20, 'Proposal description must be at least 20 characters'),
  deliveryDays: z.number().int().positive('Delivery days must be a positive integer'),
  coverLetter: z.string().optional(),
  attachmentUrl: z.string().optional(),
});

export const updateBidSchema = createBidSchema.partial();

export const updateBidStatusSchema = z.object({
  status: z.nativeEnum(BidStatus),
});
