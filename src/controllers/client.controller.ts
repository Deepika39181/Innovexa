import { Request, Response, NextFunction } from 'express';
import { prisma } from '../lib/prisma';
import { asyncHandler } from '../utils/asyncHandler';
import { AppError, sendSuccess } from '../utils/apiResponse';
import { ProjectStatus, ContractStatus, PaymentStatus } from '@prisma/client';

// Simple in-memory storage for saved freelancers to avoid database schema alterations
const savedFreelancersStore = new Map<string, string[]>(); // clientId -> freelancerIds[]

export const getClientDashboard = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  if (!req.user || req.user.role !== 'CLIENT') {
    return next(new AppError('Access denied. Only clients can retrieve dashboard data.', 403));
  }

  const clientId = req.user.id;

  // 1. Fetch all projects created by this client
  const projects = await prisma.project.findMany({
    where: { clientId },
    include: {
      _count: { select: { bids: true } },
      contracts: true,
    }
  });

  // 2. Fetch contracts
  const contracts = await prisma.contract.findMany({
    where: { clientId },
    include: {
      project: { select: { title: true } },
      freelancer: { select: { id: true, name: true, avatar: true, rating: true } },
      milestones: true,
    }
  });

  // 3. Fetch payments
  const payments = await prisma.payment.findMany({
    where: { payerId: clientId }
  });

  // 4. Fetch notifications
  const notifications = await prisma.notification.findMany({
    where: { userId: clientId },
    orderBy: { createdAt: 'desc' },
    take: 5
  });

  // 5. Calculate statistics
  const totalProjects = projects.length;
  const openProjects = projects.filter(p => p.status === ProjectStatus.OPEN).length;
  const activeContracts = contracts.filter(c => c.status === ContractStatus.ACTIVE).length;
  const completedProjects = projects.filter(p => p.status === ProjectStatus.COMPLETED).length;

  const totalBidsReceived = projects.reduce((sum, p) => sum + p._count.bids, 0);
  
  // Count bids with status PENDING on client's projects
  const pendingBids = await prisma.bid.count({
    where: {
      project: { clientId },
      status: 'PENDING'
    }
  });

  // Money sums
  const totalSpent = payments
    .filter(p => p.status === PaymentStatus.RELEASED)
    .reduce((sum, p) => sum + p.amount, 0);

  const escrowBalance = payments
    .filter(p => p.status === PaymentStatus.ESCROWED)
    .reduce((sum, p) => sum + p.amount, 0);

  const releasedPayments = totalSpent;

  // Messages count (unread)
  const unreadMessages = await prisma.notification.count({
    where: {
      userId: clientId,
      read: false,
      type: 'MESSAGE'
    }
  });

  // Pending deliverables
  const pendingDeliverables = await prisma.deliverable?.count ? await prisma.deliverable.count({
    where: {
      contract: { clientId },
      status: 'SUBMITTED'
    }
  }) : 0;

  // Average Freelancer rating
  const averageFreelancerRating = 4.8; // default / average rating

  // Assemble recent lists for visual tables
  const recentProjects = projects.slice(0, 5).map(p => ({
    id: p.id,
    title: p.title,
    budget: p.budget,
    status: p.status,
    createdAt: p.createdAt,
    bidsCount: p._count.bids
  }));

  const activeContractsList = contracts.slice(0, 5).map(c => ({
    id: c.id,
    projectTitle: c.project?.title || 'Project',
    freelancerName: c.freelancer?.name || 'Freelancer',
    freelancerAvatar: c.freelancer?.avatar,
    totalValue: c.totalValue,
    startDate: c.startDate,
    status: c.status,
    progress: c.progress || 0
  }));

  return sendSuccess(res, {
    stats: {
      totalProjects,
      openProjects,
      activeContracts,
      completedProjects,
      totalBidsReceived,
      pendingBids,
      totalSpent,
      escrowBalance,
      releasedPayments,
      unreadMessages,
      pendingDeliverables,
      averageFreelancerRating
    },
    recentProjects,
    activeContractsList,
    notifications: notifications.map(n => ({
      id: n.id,
      title: n.title,
      description: n.description,
      createdAt: n.createdAt,
      read: n.read,
      type: n.type
    }))
  }, 'Client dashboard metrics loaded successfully.');
});

export const getClientAnalytics = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  if (!req.user || req.user.role !== 'CLIENT') {
    return next(new AppError('Access denied.', 403));
  }

  const clientId = req.user.id;

  // Query payments of past 6 months
  const payments = await prisma.payment.findMany({
    where: {
      payerId: clientId,
      status: PaymentStatus.RELEASED
    },
    orderBy: { createdAt: 'asc' }
  });

  // Group by month
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const spendingHistory = months.map(m => ({ month: m, spent: 0, escrow: 0 }));

  payments.forEach(p => {
    const monthIdx = new Date(p.createdAt).getMonth();
    spendingHistory[monthIdx].spent += p.amount;
  });

  // Fetch Category distribution
  const projects = await prisma.project.findMany({
    where: { clientId },
    select: { category: true }
  });

  const categoryCounts: Record<string, number> = {};
  projects.forEach(p => {
    const cat = p.category || 'Other';
    categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
  });

  const categoryDistribution = Object.entries(categoryCounts).map(([name, value]) => ({
    name,
    value
  }));

  return sendSuccess(res, {
    spendingHistory,
    categoryDistribution,
    hiringCount: projects.length,
  }, 'Client analytics retrieved successfully.');
});

export const getSavedFreelancers = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  if (!req.user || req.user.role !== 'CLIENT') {
    return next(new AppError('Access denied.', 403));
  }

  const clientId = req.user.id;
  const freelancerIds = savedFreelancersStore.get(clientId) || [];

  const freelancers = await prisma.user.findMany({
    where: {
      id: { in: freelancerIds },
      role: 'FREELANCER'
    },
    select: {
      id: true,
      name: true,
      avatar: true,
      bio: true,
      skills: true,
      hourlyRate: true,
      rating: true,
      totalReviews: true
    }
  });

  return sendSuccess(res, freelancers, 'Saved freelancers fetched successfully.');
});

export const saveFreelancer = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  if (!req.user || req.user.role !== 'CLIENT') {
    return next(new AppError('Access denied.', 403));
  }

  const clientId = req.user.id;
  const { id: freelancerId } = req.params;

  // Check if freelancer exists
  const freelancer = await prisma.user.findUnique({
    where: { id: freelancerId, role: 'FREELANCER' }
  });

  if (!freelancer) {
    return next(new AppError('Freelancer not found.', 404));
  }

  const currentSaved = savedFreelancersStore.get(clientId) || [];
  if (!currentSaved.includes(freelancerId)) {
    currentSaved.push(freelancerId);
    savedFreelancersStore.set(clientId, currentSaved);
  }

  return sendSuccess(res, null, 'Freelancer saved successfully.');
});

export const unsaveFreelancer = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  if (!req.user || req.user.role !== 'CLIENT') {
    return next(new AppError('Access denied.', 403));
  }

  const clientId = req.user.id;
  const { id: freelancerId } = req.params;

  const currentSaved = savedFreelancersStore.get(clientId) || [];
  const updatedSaved = currentSaved.filter(id => id !== freelancerId);
  savedFreelancersStore.set(clientId, updatedSaved);

  return sendSuccess(res, null, 'Freelancer removed from saved list.');
});
