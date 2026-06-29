import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcrypt';
import { prisma } from '../lib/prisma';
import { asyncHandler } from '../utils/asyncHandler';
import { AppError, sendSuccess } from '../utils/apiResponse';
import { registerSchema, loginSchema, forgotPasswordSchema, resetPasswordSchema } from '../validators/auth';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from '../utils/jwt';
import { sendEmail } from '../utils/email';
import { UserRole } from '@prisma/client';

export const register = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const parsed = registerSchema.parse(req.body);

  if (parsed.role === 'ADMIN') {
    return next(new AppError('Administrator registration is restricted.', 403));
  }

  const existingUser = await prisma.user.findUnique({
    where: { email: parsed.email.toLowerCase() },
  });

  if (existingUser) {
    return next(new AppError('A user with this email address already exists.', 409));
  }

  const hashedPassword = await bcrypt.hash(parsed.password, 12);

  const user = await prisma.$transaction(async (tx) => {
    const newUser = await tx.user.create({
      data: {
        name: parsed.name,
        email: parsed.email.toLowerCase(),
        password: hashedPassword,
        role: parsed.role,
        isVerified: parsed.role === 'ADMIN', // Auto verify admin accounts for simplicity
        avatar: `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(parsed.name)}`,
        skills: parsed.skills || [],
        hourlyRate: parsed.hourlyRate || null,
        availability: true,
        profileCompleted: true,
      },
    });

    if (parsed.role === 'CLIENT') {
      await tx.clientProfile.create({
        data: {
          userId: newUser.id,
          companyName: parsed.companyName || null,
          website: parsed.website || null,
        },
      });
    } else if (parsed.role === 'FREELANCER') {
      await tx.freelancerProfile.create({
        data: {
          userId: newUser.id,
          title: parsed.title || null,
          skills: parsed.skills || [],
          hourlyRate: parsed.hourlyRate || null,
          availableForWork: true,
        },
      });
    } else if (parsed.role === 'ADMIN') {
      await tx.adminProfile.create({
        data: {
          userId: newUser.id,
          permissions: ['SUPER_ADMIN'],
          department: 'Platform Management',
        },
      });
    }

    return newUser;
  });

  // Create verification email mock token
  const verificationToken = Math.random().toString(36).substring(2, 15);
  await prisma.emailVerificationToken.create({
    data: {
      token: verificationToken,
      userId: user.id,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
    },
  });

  await sendEmail({
    email: user.email,
    subject: 'Welcome to Innovexa Catalyst - Verify your email',
    message: `Hello ${user.name},\n\nWelcome to Innovexa Catalyst. Please verify your email using this token: ${verificationToken}`,
  });

  const authUserPayload = {
    id: user.id,
    email: user.email,
    role: user.role,
    isVerified: user.isVerified,
  };

  const accessToken = generateAccessToken(authUserPayload);
  const refreshToken = generateRefreshToken(authUserPayload);

  // Save refresh token to db
  await prisma.refreshToken.create({
    data: {
      token: refreshToken,
      userId: user.id,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    },
  });

  return sendSuccess(
    res,
    {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        isVerified: user.isVerified,
        avatar: user.avatar,
      },
      accessToken,
      refreshToken,
    },
    'User registered successfully. Verification email sent.',
    211 // 201 Created but wait, let's return 201 standard
  );
});

export const login = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const parsed = loginSchema.parse(req.body);

  const user = await prisma.user.findUnique({
    where: { email: parsed.email.toLowerCase() },
  });

  if (!user || !(await bcrypt.compare(parsed.password, user.password))) {
    return next(new AppError('Invalid email or password.', 401));
  }

  if (user.isBanned) {
    return next(new AppError('Your account has been suspended by an administrator.', 403));
  }

  const authUserPayload = {
    id: user.id,
    email: user.email,
    role: user.role,
    isVerified: user.isVerified,
  };

  const accessToken = generateAccessToken(authUserPayload);
  const refreshToken = generateRefreshToken(authUserPayload);

  // Save refresh token to database
  await prisma.refreshToken.create({
    data: {
      token: refreshToken,
      userId: user.id,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    },
  });

  return sendSuccess(
    res,
    {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        isVerified: user.isVerified,
        avatar: user.avatar,
      },
      accessToken,
      refreshToken,
    },
    'Logged in successfully.'
  );
});

export const refresh = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return next(new AppError('Refresh token is required.', 400));
  }

  const tokenRecord = await prisma.refreshToken.findUnique({
    where: { token: refreshToken },
  });

  if (!tokenRecord || tokenRecord.revoked || tokenRecord.expiresAt < new Date()) {
    return next(new AppError('Refresh token is invalid, revoked, or expired.', 401));
  }

  const decoded = verifyRefreshToken(refreshToken);

  const user = await prisma.user.findUnique({
    where: { id: decoded.id },
  });

  if (!user || user.isBanned) {
    return next(new AppError('User is not available or has been suspended.', 401));
  }

  const authUserPayload = {
    id: user.id,
    email: user.email,
    role: user.role,
    isVerified: user.isVerified,
  };

  const newAccessToken = generateAccessToken(authUserPayload);

  return sendSuccess(
    res,
    {
      accessToken: newAccessToken,
    },
    'Token refreshed successfully.'
  );
});

export const logout = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const { refreshToken } = req.body;

  if (refreshToken) {
    await prisma.refreshToken.updateMany({
      where: { token: refreshToken },
      data: { revoked: true },
    });
  }

  return sendSuccess(res, null, 'Logged out successfully.');
});

export const getMe = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    return next(new AppError('User session not found.', 401));
  }

  const user = await prisma.user.findUnique({
    where: { id: req.user.id },
    include: {
      clientProfile: true,
      freelancerProfile: true,
      adminProfile: true,
    },
  });

  if (!user) {
    return next(new AppError('User not found.', 404));
  }

  return sendSuccess(res, { user }, 'User profile retrieved successfully.');
});

export const forgotPassword = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const parsed = forgotPasswordSchema.parse(req.body);

  const user = await prisma.user.findUnique({
    where: { email: parsed.email.toLowerCase() },
  });

  if (!user) {
    // Return standard success to prevent email enumeration
    return sendSuccess(res, null, 'If that email exists, a password reset token has been sent.');
  }

  const resetToken = Math.random().toString(36).substring(2, 15);
  await prisma.passwordResetToken.create({
    data: {
      token: resetToken,
      userId: user.id,
      expiresAt: new Date(Date.now() + 1 * 60 * 60 * 1000), // 1 hour
    },
  });

  await sendEmail({
    email: user.email,
    subject: 'Innovexa Catalyst - Reset Password Link',
    message: `Hello ${user.name},\n\nYou requested a password reset. Use this token to reset your password: ${resetToken}\n\nThis token will expire in 1 hour.`,
  });

  return sendSuccess(res, null, 'Password reset token has been sent to your email.');
});

export const resetPassword = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const parsed = resetPasswordSchema.parse(req.body);

  const tokenRecord = await prisma.passwordResetToken.findUnique({
    where: { token: parsed.token },
  });

  if (!tokenRecord || tokenRecord.used || tokenRecord.expiresAt < new Date()) {
    return next(new AppError('Password reset token is invalid or expired.', 400));
  }

  const hashedPassword = await bcrypt.hash(parsed.password, 12);

  await prisma.$transaction([
    prisma.user.update({
      where: { id: tokenRecord.userId },
      data: { password: hashedPassword },
    }),
    prisma.passwordResetToken.update({
      where: { id: tokenRecord.id },
      data: { used: true },
    }),
  ]);

  return sendSuccess(res, null, 'Password reset successfully. You can now log in.');
});

export const verifyEmail = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const { token } = req.body;

  if (!token) {
    return next(new AppError('Verification token is required.', 400));
  }

  const tokenRecord = await prisma.emailVerificationToken.findFirst({
    where: {
      token: token.trim(),
      used: false,
    },
  });

  if (!tokenRecord) {
    return next(new AppError('Verification token is invalid or has already been used.', 400));
  }

  if (tokenRecord.expiresAt < new Date()) {
    return next(new AppError('Verification token has expired. Please request a new one.', 400));
  }

  await prisma.$transaction([
    prisma.user.update({
      where: { id: tokenRecord.userId },
      data: { isVerified: true },
    }),
    prisma.emailVerificationToken.update({
      where: { id: tokenRecord.id },
      data: { used: true },
    }),
  ]);

  return sendSuccess(res, null, 'Email verified successfully. Please login.');
});

export const resendVerification = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const { email } = req.body;

  if (!email) {
    return next(new AppError('Email address is required.', 400));
  }

  const user = await prisma.user.findUnique({
    where: { email: email.toLowerCase() },
  });

  if (!user) {
    return next(new AppError('No account found with this email address.', 404));
  }

  if (user.isVerified) {
    return next(new AppError('This email address is already verified.', 400));
  }

  // Revoke/delete existing tokens for this user
  await prisma.emailVerificationToken.deleteMany({
    where: { userId: user.id },
  });

  const verificationToken = Math.random().toString(36).substring(2, 15);
  await prisma.emailVerificationToken.create({
    data: {
      token: verificationToken,
      userId: user.id,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
    },
  });

  await sendEmail({
    email: user.email,
    subject: 'Innovexa Catalyst - Verify your email',
    message: `Hello ${user.name},\n\nPlease verify your email using this token: ${verificationToken}\n\nThis token will expire in 24 hours.`,
  });

  return sendSuccess(res, null, 'Verification email sent. Please check your inbox.');
});

