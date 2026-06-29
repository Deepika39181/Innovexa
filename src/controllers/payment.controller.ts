import { Request, Response, NextFunction } from "express";
import { prisma } from "../lib/prisma";
import { asyncHandler } from "../utils/asyncHandler";
import { AppError, sendSuccess } from "../utils/apiResponse";
import { PaymentStatus, PaymentMethod, UserRole, Prisma } from "@prisma/client";

export const fundProjectEscrow = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { contractId, amount, paymentMethod } = req.body;

    if (req.user?.role !== UserRole.CLIENT && req.user?.role !== UserRole.ADMIN) {
      return next(new AppError("Only clients can fund escrows.", 403));
    }

    if (!contractId || !amount || amount <= 0) {
      return next(new AppError("Contract ID and valid amount are required.", 400));
    }

    const contract = await prisma.contract.findUnique({
      where: { id: contractId },
    });

    if (!contract) {
      return next(new AppError("Contract not found.", 404));
    }

    if (req.user.role === UserRole.CLIENT && contract.clientId !== req.user.id) {
      return next(new AppError("You can fund only your own contract.", 403));
    }

    const platformFee = Number((amount * 0.05).toFixed(2));
    const tax = Number((amount * 0.18).toFixed(2));
    const transactionId = `TXN_${Date.now()}_${Math.random()
      .toString(36)
      .substring(2, 8)
      .toUpperCase()}`;

    const payment = await prisma.payment.create({
      data: {
        amount,
        platformFee,
        tax,
        currency: "INR",
        status: PaymentStatus.ESCROWED,
        paymentMethod: paymentMethod || PaymentMethod.ESCROW,
        transactionId,
        payerId: req.user.id,
        receiverId: contract.freelancerId,
        contractId: contract.id,
        escrowedAt: new Date(),
        paidAt: new Date(),
      },
    });

    await prisma.user.update({
      where: { id: req.user.id },
      data: {
        totalSpent: {
          increment: amount + platformFee + tax,
        },
      },
    });

    return sendSuccess(
      res,
      payment,
      "Escrow funded successfully. Funds are locked securely.",
      201
    );
  }
);

export const releaseEscrowFunds = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { paymentId } = req.body;

    if (!paymentId) {
      return next(new AppError("Payment ID is required.", 400));
    }

    const payment = await prisma.payment.findUnique({
      where: { id: paymentId },
      include: { contract: true },
    });

    if (!payment) {
      return next(new AppError("Payment transaction not found.", 404));
    }

    if (
      payment.contract?.clientId !== req.user?.id &&
      req.user?.role !== UserRole.ADMIN
    ) {
      return next(new AppError("Only project client can release escrow.", 403));
    }

    if (payment.status !== PaymentStatus.ESCROWED) {
      return next(new AppError("Only escrowed funds can be released.", 400));
    }

    const updated = await prisma.$transaction(
      async (tx: Prisma.TransactionClient) => {
        const updatedPayment = await tx.payment.update({
          where: { id: paymentId },
          data: {
            status: PaymentStatus.RELEASED,
            releasedAt: new Date(),
          },
        });

        if (payment.receiverId) {
          await tx.user.update({
            where: { id: payment.receiverId },
            data: {
              totalEarnings: {
                increment: payment.amount,
              },
            },
          });
        }

        await tx.platformCommission.create({
          data: {
            amount: payment.platformFee,
            percentage: 5.0,
            currency: "INR",
            paymentId: payment.id,
          },
        });

        return updatedPayment;
      }
    );

    return sendSuccess(
      res,
      updated,
      "Escrow payout released successfully to freelancer balance."
    );
  }
);

export const withdrawEarnings = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { amount, details } = req.body;

    if (req.user?.role !== UserRole.FREELANCER) {
      return next(new AppError("Only freelancers can withdraw earnings.", 403));
    }

    if (!amount || amount <= 0) {
      return next(new AppError("Valid withdrawal amount is required.", 400));
    }

    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: { totalEarnings: true },
    });

    if (!user || user.totalEarnings < amount) {
      return next(new AppError("Insufficient balance.", 400));
    }

    const withdrawal = await prisma.$transaction(
      async (tx: Prisma.TransactionClient) => {
        await tx.user.update({
          where: { id: req.user!.id },
          data: {
            totalEarnings: {
              decrement: amount,
            },
          },
        });

        const transactionId = `WD_${Date.now()}_${Math.random()
          .toString(36)
          .substring(2, 8)
          .toUpperCase()}`;

        return tx.payment.create({
          data: {
            amount,
            status: PaymentStatus.RELEASED,
            paymentMethod: PaymentMethod.BANK_TRANSFER,
            currency: "INR",
            transactionId,
            payerId: req.user!.id,
            receiverId: req.user!.id,
            paidAt: new Date(),
            releasedAt: new Date(),
            gatewayResponse: {
              withdrawalDetails: details || "Bank transfer",
            },
          },
        });
      }
    );

    return sendSuccess(
      res,
      withdrawal,
      "Withdrawal initiated successfully."
    );
  }
);

export const getPaymentHistory = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new AppError("Unauthorized", 401));
    }

    const whereClause: any = {};

    if (req.user.role === UserRole.CLIENT) {
      whereClause.payerId = req.user.id;
    }

    if (req.user.role === UserRole.FREELANCER) {
      whereClause.receiverId = req.user.id;
    }

    const history = await prisma.payment.findMany({
      where: whereClause,
      include: {
        contract: {
          select: {
            id: true,
            project: {
              select: { title: true },
            },
          },
        },
        payer: {
          select: { id: true, name: true, email: true, avatar: true },
        },
        receiver: {
          select: { id: true, name: true, email: true, avatar: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return sendSuccess(res, history, "Payment history fetched successfully.");
  }
);

export const getEarningsBreakdown = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    if (req.user?.role !== UserRole.FREELANCER) {
      return next(new AppError("Only freelancers can view earnings.", 403));
    }

    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: { totalEarnings: true },
    });

    const payments = await prisma.payment.findMany({
      where: {
        receiverId: req.user.id,
        status: PaymentStatus.RELEASED,
      },
    });

    

   type EarningsBreakdown = {
  gross: number;
  fees: number;
  tax: number;
  net: number;
};

const breakdown: EarningsBreakdown = payments.reduce(
  (acc: EarningsBreakdown, item: any) => {
    acc.gross += item.amount;
    acc.fees += item.platformFee;
    acc.tax += item.tax;
    acc.net += item.amount - item.platformFee - item.tax;
    return acc;
  },
  {
    gross: 0,
    fees: 0,
    tax: 0,
    net: 0,
  }
);

    return sendSuccess(
      res,
      {
        currentBalance: user?.totalEarnings || 0,
        breakdown,
      },
      "Earnings breakdown fetched successfully."
    );
  }
);

export const getInvoiceById = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    const payment = await prisma.payment.findUnique({
      where: { id },
      include: {
        contract: {
          include: { project: true },
        },
        payer: true,
        receiver: true,
      },
    });

    if (!payment) {
      return next(new AppError("Payment not found.", 404));
    }

    if (
      payment.payerId !== req.user?.id &&
      payment.receiverId !== req.user?.id &&
      req.user?.role !== UserRole.ADMIN
    ) {
      return next(new AppError("Access denied to invoice.", 403));
    }

    const invoice = {
      invoiceNumber: `INV-${
        payment.transactionId || payment.id.substring(0, 8).toUpperCase()
      }`,
      date: payment.paidAt || payment.createdAt,
      dueDate: payment.releasedAt || payment.updatedAt,
      sender: {
        name: payment.receiver?.name || "Freelancer",
        email: payment.receiver?.email,
        phone: payment.receiver?.phone,
      },
      recipient: {
        name: payment.payer?.name || "Client",
        email: payment.payer?.email,
      },
      lineItems: [
        {
          description: `Freelancer services for project: ${
            payment.contract?.project?.title || "Milestone delivery"
          }`,
          amount: payment.amount,
        },
        {
          description: "Platform service charge",
          amount: payment.platformFee,
        },
        {
          description: "Tax / GST",
          amount: payment.tax,
        },
      ],
      summary: {
        grossAmount: payment.amount,
        platformFee: payment.platformFee,
        tax: payment.tax,
        totalAmount: payment.amount + payment.platformFee + payment.tax,
        freelancerNetAmount:
          payment.amount - payment.platformFee - payment.tax,
      },
      paymentDetails: {
        status: payment.status,
        method: payment.paymentMethod,
        transactionId: payment.transactionId,
      },
    };

    return sendSuccess(res, invoice, "Invoice generated successfully.");
  }
);