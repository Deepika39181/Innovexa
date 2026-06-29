import { Request, Response, NextFunction } from 'express';
import { prisma } from '../lib/prisma';
import { asyncHandler } from '../utils/asyncHandler';
import { AppError, sendSuccess } from '../utils/apiResponse';
import { NotificationType, Prisma } from '@prisma/client';
import { Server } from "socket.io";
export const getConversations = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    return next(new AppError('Unauthorized', 401));
  }

  const conversations = await prisma.conversation.findMany({
    where: {
      OR: [
        { participant1Id: req.user.id },
        { participant2Id: req.user.id },
      ],
    },
    include: {
      participant1: { select: { id: true, name: true, avatar: true, role: true } },
      participant2: { select: { id: true, name: true, avatar: true, role: true } },
      project: { select: { id: true, title: true } },
      contract: { select: { id: true, agreedBudget: true, status: true } },
    },
    orderBy: { lastMessageAt: 'desc' },
  });

  return sendSuccess(res, conversations, 'Conversations list fetched successfully.');
});

export const createConversation = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const { recipientId, projectId, contractId } = req.body;

  if (!req.user) {
    return next(new AppError('Unauthorized', 401));
  }

  if (req.user.id === recipientId) {
    return next(new AppError('You cannot establish a conversation with yourself.', 400));
  }

  // Ensure recipient user exists
  const recipient = await prisma.user.findUnique({ where: { id: recipientId } });
  if (!recipient) {
    return next(new AppError('Recipient user not found.', 404));
  }

  // Check if active channel exists
  let conversation = await prisma.conversation.findFirst({
    where: {
      OR: [
        { participant1Id: req.user.id, participant2Id: recipientId, projectId: projectId || null, contractId: contractId || null },
        { participant1Id: recipientId, participant2Id: req.user.id, projectId: projectId || null, contractId: contractId || null },
      ],
    },
  });

  if (!conversation) {
    conversation = await prisma.conversation.create({
      data: {
        participant1Id: req.user.id,
        participant2Id: recipientId,
        projectId: projectId || null,
        contractId: contractId || null,
        lastMessage: 'Conversation opened',
        lastMessageAt: new Date(),
      },
    });
  }

  return sendSuccess(res, conversation, 'Conversation thread successfully loaded.', 201);
});

export const getConversationMessages = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const { id: conversationId } = req.params;

  const conversation = await prisma.conversation.findUnique({
    where: { id: conversationId },
  });

  if (!conversation) {
    return next(new AppError('Conversation thread not found.', 404));
  }

  // Verify membership
  if (conversation.participant1Id !== req.user?.id && conversation.participant2Id !== req.user?.id) {
    return next(new AppError('You do not belong to this chat room.', 403));
  }

  const messages = await prisma.message.findMany({
    where: { conversationId },
    include: {
      sender: { select: { id: true, name: true, avatar: true } },
    },
    orderBy: { createdAt: 'asc' },
  });

  // Mark all unread incoming messages as read in this conversation
  await prisma.message.updateMany({
    where: {
      conversationId,
      receiverId: req.user!.id,
      isRead: false,
    },
    data: { isRead: true },
  });

  return sendSuccess(res, messages, 'Messages history log loaded.');
});

export const sendMessage = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const { id: conversationId } = req.params;
  const { content, attachment } = req.body;

  if (!content) {
    return next(new AppError('Message payload cannot be empty.', 400));
  }

  const conversation = await prisma.conversation.findUnique({
    where: { id: conversationId },
  });

  if (!conversation) {
    return next(new AppError('Conversation thread not found.', 404));
  }

  const isUserP1 = conversation.participant1Id === req.user?.id;
  const isUserP2 = conversation.participant2Id === req.user?.id;

  if (!isUserP1 && !isUserP2) {
    return next(new AppError('You do not have access to send messages in this thread.', 403));
  }

  const receiverId = isUserP1 ? conversation.participant2Id : conversation.participant1Id;

  // Retrieve sender user details to build type-safe notification descriptions
  const senderUser = await prisma.user.findUnique({
    where: { id: req.user!.id },
    select: { name: true }
  });
  const senderName = senderUser?.name || 'Someone';

const message = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
    // Create new message
    const newMessage = await tx.message.create({
      data: {
        content,
        attachment: attachment || null,
        senderId: req.user!.id,
        receiverId,
        conversationId,
        isRead: false,
      },
      include: {
        sender: { select: { id: true, name: true, avatar: true } },
      },
    });

    // Update conversation summary
    await tx.conversation.update({
      where: { id: conversationId },
      data: {
        lastMessage: content,
        lastMessageAt: new Date(),
      },
    });

    // Also register a real-time notification alert record in the database for the recipient
    await tx.notification.create({
      data: {
        title: 'New Message',
        message: `You received a message from ${senderName}: "${content.slice(0, 45)}${content.length > 45 ? '...' : ''}"`,
        type: NotificationType.MESSAGE,
        userId: receiverId,
      }
    });

    return newMessage;
  });

  // Access the attached Socket.io instance and broadcast real-time events immediately
const io = req.app.get("io") as Server;
  if (io) {
    // 1. Emit live chat message to the room participants
    io.to(conversationId).emit('receive_message', message);

    // 2. Emit real-time notification update to recipient
    io.to(`notifications_${receiverId}`).emit('receive_notification', {
      id: `live-notif-${Date.now()}`,
      title: 'New Message',
      message: `You received a message from ${senderName}: "${content.slice(0, 45)}${content.length > 45 ? '...' : ''}"`,
      type: 'MESSAGE',
      userId: receiverId,
      isRead: false,
      createdAt: new Date().toISOString()
    });
  }

  return sendSuccess(res, message, 'Message dispatched successfully.', 201);
});

export const markMessageAsRead = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;

  const message = await prisma.message.findUnique({ where: { id } });
  if (!message) {
    return next(new AppError('Message payload not found.', 404));
  }

  if (message.receiverId !== req.user?.id) {
    return next(new AppError('You can only sign off on read receipts for messages sent to you.', 403));
  }

  const updated = await prisma.message.update({
    where: { id },
    data: { isRead: true },
  });

  return sendSuccess(res, updated, 'Message read receipt updated.');
});
