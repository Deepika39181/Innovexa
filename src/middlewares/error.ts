import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { AppError, sendError } from '../utils/apiResponse';

export const globalErrorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  err.statusCode = err.statusCode || 500;
  err.message = err.message || 'Internal Server Error';

  console.error('[Global Error]:', {
    message: err.message,
    stack: err.stack,
    details: err,
  });

  // Handle Zod Validation Error
  if (err instanceof ZodError) {
    const formattedErrors = err.issues.map((e) => ({
      field: e.path.join('.'),
      message: e.message,
    }));
    return sendError(res, 'Validation Failed', 400, formattedErrors);
  }

  // Handle Prisma Known Request Errors
  if (err.code && err.code.startsWith('P')) {
    if (err.code === 'P2002') {
      // Unique constraint failed
      const fields = err.meta?.target || 'field';
      return sendError(res, `A record with this ${fields} already exists.`, 409);
    }
    if (err.code === 'P2025') {
      // Record not found
      return sendError(res, err.meta?.cause || 'Record not found.', 444);
    }
  }

  // Handle JWT errors
  if (err.name === 'JsonWebTokenError') {
    return sendError(res, 'Invalid token. Please log in again.', 401);
  }
  if (err.name === 'TokenExpiredError') {
    return sendError(res, 'Your session has expired. Please log in again.', 401);
  }

  // Standard AppError
  if (err instanceof AppError) {
    return sendError(res, err.message, err.statusCode);
  }

  // Fallback
  return sendError(
    res,
    process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong on the server',
    err.statusCode
  );
};
