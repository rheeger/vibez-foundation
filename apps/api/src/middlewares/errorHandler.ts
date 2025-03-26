import { Request, Response, NextFunction, ErrorRequestHandler } from 'express';
import { AppError } from '../utils/errors';
import logger from '../utils/logger';
import config from '../config';

/**
 * Global error handling middleware
 */
export const errorHandler: ErrorRequestHandler = (
  err: Error | AppError,
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  // Set default status and message
  let statusCode = 500;
  let message = 'Internal Server Error';
  let errorDetails = {};
  let isOperational = false;

  // If it's our custom AppError
  if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
    isOperational = err.isOperational;
  }

  // Only include stack trace in development
  if (config.isDevelopment) {
    errorDetails = {
      stack: err.stack,
      ...(err as any).details,
    };
  }

  // Log the error
  if (statusCode >= 500) {
    logger.error(`${statusCode} - ${message}`, {
      path: req.path,
      method: req.method,
      error: err.message,
      stack: err.stack,
      isOperational
    });
  } else {
    logger.warn(`${statusCode} - ${message}`, {
      path: req.path,
      method: req.method
    });
  }

  // Send response
  res.status(statusCode).json({
    status: 'error',
    message: config.isProduction && !isOperational ? 'Something went wrong' : message,
    ...(Object.keys(errorDetails).length > 0 && { details: errorDetails })
  });
};

/**
 * Catch 404 errors for routes that don't exist
 */
export const notFoundHandler = (req: Request, res: Response, next: NextFunction) => {
  const err = new AppError(`Not Found - ${req.originalUrl}`, 404);
  next(err);
}; 