import { Request, Response, NextFunction } from "express";
import { prisma } from "../lib/prisma";
import { asyncHandler } from "../utils/asyncHandler";
import { AppError, sendSuccess } from "../utils/apiResponse";
import {
  createBidSchema,
  updateBidSchema,
  updateBidStatusSchema,
} from "../validators/bid";
import { BidStatus, UserRole } from "@prisma/client";

export const createBid = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id: projectId } = req.params;

    if (req.user?.role !== UserRole.FREELANCER) {
      return next(new AppError("Only freelancers can bid on projects.", 403));
    }

    const parsed = createBidSchema.parse(req.body);

    const project = await prisma.project.findUnique({
      where: { id: projectId },
    });

    if (!project) {
      return next(new AppError("Project not found.", 404));
    }

    const existingBid = await prisma.bid.findFirst({
      where: {
        projectId,
        freelancerId: req.user.id,
      },
    });

    if (existingBid) {
      return next(
        new AppError("You have already submitted a bid for this project.", 400)
      );
    }

    const bid = await prisma.bid.create({
      data: {
        amount: parsed.amount,
        proposal: parsed.proposal,
        deliveryDays: parsed.deliveryDays,
        coverLetter: parsed.coverLetter || null,
        attachmentUrl: parsed.attachmentUrl || null,
        projectId,
        freelancerId: req.user.id,
        status: BidStatus.PENDING,
      },
    });

    return sendSuccess(res, bid, "Bid submitted successfully.", 201);
  }
);

export const getProjectBids = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id: projectId } = req.params;

    const project = await prisma.project.findUnique({
      where: { id: projectId },
    });

    if (!project) {
      return next(new AppError("Project not found.", 404));
    }

    if (req.user?.role === UserRole.FREELANCER) {
      const bids = await prisma.bid.findMany({
        where: {
          projectId,
          freelancerId: req.user.id,
        },
        include: {
          freelancer: {
            select: { id: true, name: true, avatar: true },
          },
        },
      });

      return sendSuccess(res, bids, "Your bid fetched successfully.");
    }

    if (
      req.user?.role === UserRole.CLIENT &&
      project.clientId !== req.user.id
    ) {
      return next(
        new AppError(
          "You do not have permission to view bids for this project.",
          403
        )
      );
    }

    const bids = await prisma.bid.findMany({
      where: { projectId },
      include: {
        freelancer: {
          select: {
            id: true,
            name: true,
            avatar: true,
            rating: true,
            skills: true,
            hourlyRate: true,
          },
        },
      },
      orderBy: { amount: "asc" },
    });

    return sendSuccess(res, bids, "Bids fetched successfully.");
  }
);

export const getMyBids = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    if (req.user?.role !== UserRole.FREELANCER) {
      return next(new AppError("Only freelancers have bids history.", 403));
    }

    const bids = await prisma.bid.findMany({
      where: { freelancerId: req.user.id },
      include: {
        project: {
          select: {
            id: true,
            title: true,
            budget: true,
            status: true,
            client: {
              select: { id: true, name: true, avatar: true },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return sendSuccess(res, bids, "My bids list fetched successfully.");
  }
);

export const updateBid = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const parsed = updateBidSchema.parse(req.body);

    const existingBid = await prisma.bid.findUnique({
      where: { id },
    });

    if (!existingBid) {
      return next(new AppError("Bid not found.", 404));
    }

    if (
      req.user?.role === UserRole.FREELANCER &&
      existingBid.freelancerId !== req.user.id
    ) {
      return next(new AppError("You can only edit your own bids.", 403));
    }

    if (existingBid.status !== BidStatus.PENDING) {
      return next(
        new AppError("You can only update bids with PENDING status.", 400)
      );
    }

    const updatedBid = await prisma.bid.update({
      where: { id },
      data: {
        amount: parsed.amount,
        proposal: parsed.proposal,
        deliveryDays: parsed.deliveryDays,
        coverLetter: parsed.coverLetter,
        attachmentUrl: parsed.attachmentUrl,
      },
    });

    return sendSuccess(res, updatedBid, "Bid updated successfully.");
  }
);

export const updateBidStatus = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const parsed = updateBidStatusSchema.parse(req.body);

    const existingBid = await prisma.bid.findUnique({
      where: { id },
      include: { project: true },
    });

    if (!existingBid) {
      return next(new AppError("Bid not found.", 404));
    }

    if (
      existingBid.project.clientId !== req.user?.id &&
      req.user?.role !== UserRole.ADMIN
    ) {
      return next(
        new AppError("Only the project owner can update bid status.", 403)
      );
    }

    const updatedBid = await prisma.bid.update({
      where: { id },
      data: {
        status: parsed.status,
        ...(parsed.status === BidStatus.ACCEPTED && {
          acceptedAt: new Date(),
        }),
        ...(parsed.status === BidStatus.REJECTED && {
          rejectedAt: new Date(),
        }),
      },
    });

    return sendSuccess(
      res,
      updatedBid,
      `Bid status updated to ${parsed.status}.`
    );
  }
);

export const deleteBid = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    const existingBid = await prisma.bid.findUnique({
      where: { id },
    });

    if (!existingBid) {
      return next(new AppError("Bid not found.", 404));
    }

    if (
      req.user?.role === UserRole.FREELANCER &&
      existingBid.freelancerId !== req.user.id
    ) {
      return next(
        new AppError("You can only withdraw or delete your own bids.", 403)
      );
    }

    if (
      req.user?.role !== UserRole.FREELANCER &&
      req.user?.role !== UserRole.ADMIN
    ) {
      return next(new AppError("You do not have permission.", 403));
    }

    await prisma.bid.delete({
      where: { id },
    });

    return sendSuccess(res, null, "Bid deleted successfully.");
  }
);