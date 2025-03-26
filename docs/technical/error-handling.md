# 🌴 VIBEZ FOUNDATION: Error Handling Standards 🏝️

This document outlines the standardized approach to error handling across the VIBEZ FOUNDATION API.

## Error Architecture

```
┌─────────────────┐      ┌─────────────────┐      ┌─────────────────┐
│  Custom Errors  │      │  Error Handlers │      │  Error Response │
│                 │──────▶                 │──────▶                 │
└─────────────────┘      └─────────────────┘      └─────────────────┘
```

## Error Classification

Errors in the system are classified into two types:

1. **Operational Errors** - Expected errors that occur during normal operation
   - Authentication failures
   - Validation errors
   - Resource not found
   - Permission errors
   - Rate limiting

2. **Programming Errors** - Unexpected bugs or issues
   - Syntax errors
   - Reference errors
   - Type errors
   - Unhandled exceptions

## Error Response Format

All API errors follow a consistent JSON structure:

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error message",
    "details": {
      // Optional additional details
    }
  }
}
```

Where:
- `success` is always `false` for errors
- `code` is a standardized error code (uppercase with underscores)
- `message` provides a human-readable explanation
- `details` contains optional additional information (only in development)

## HTTP Status Codes

| Status Code | Category | Usage |
|-------------|----------|-------|
| 400 | Bad Request | Invalid request format or parameters |
| 401 | Unauthorized | Missing or invalid authentication |
| 403 | Forbidden | Authentication valid but insufficient permissions |
| 404 | Not Found | Resource does not exist |
| 409 | Conflict | Request conflicts with current state |
| 422 | Unprocessable Entity | Validation errors |
| 429 | Too Many Requests | Rate limit exceeded |
| 500 | Internal Server Error | Unexpected server error |
| 503 | Service Unavailable | Server temporarily unavailable |

## Standard Error Codes

| Error Code | HTTP Status | Description |
|------------|-------------|-------------|
| `BAD_REQUEST` | 400 | Invalid request syntax or parameters |
| `UNAUTHORIZED` | 401 | Authentication required |
| `ACCESS_DENIED` | 403 | Insufficient permissions |
| `RESOURCE_NOT_FOUND` | 404 | Requested resource not found |
| `METHOD_NOT_ALLOWED` | 405 | HTTP method not allowed for resource |
| `RESOURCE_CONFLICT` | 409 | Resource conflict (e.g., duplicate entry) |
| `VALIDATION_ERROR` | 422 | Request validation failed |
| `RATE_LIMIT_EXCEEDED` | 429 | Too many requests |
| `INTERNAL_ERROR` | 500 | Unexpected server error |
| `SERVICE_UNAVAILABLE` | 503 | Service temporarily unavailable |
| `DATABASE_ERROR` | 500 | Database operation failed |
| `EXTERNAL_SERVICE_ERROR` | 502 | External service failure |

## Error Handling Implementation

### Base Error Class

```typescript
export class AppError extends Error {
  code: string;
  statusCode: number;
  isOperational: boolean;
  details?: Record<string, any>;
  
  constructor(message: string, statusCode: number, code: string, isOperational = true, details?: Record<string, any>) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.isOperational = isOperational;
    this.details = details;
    
    Error.captureStackTrace(this, this.constructor);
  }
}
```

### Error Classes

```typescript
export class BadRequestError extends AppError {
  constructor(message = 'Bad request', details?: Record<string, any>) {
    super(message, 400, 'BAD_REQUEST', true, details);
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = 'Authentication required', details?: Record<string, any>) {
    super(message, 401, 'UNAUTHORIZED', true, details);
  }
}

export class ForbiddenError extends AppError {
  constructor(message = 'Access denied', details?: Record<string, any>) {
    super(message, 403, 'ACCESS_DENIED', true, details);
  }
}

export class NotFoundError extends AppError {
  constructor(message = 'Resource not found', details?: Record<string, any>) {
    super(message, 404, 'RESOURCE_NOT_FOUND', true, details);
  }
}

export class ValidationError extends AppError {
  constructor(message = 'Validation failed', details?: Record<string, any>) {
    super(message, 422, 'VALIDATION_ERROR', true, details);
  }
}

export class ConflictError extends AppError {
  constructor(message = 'Resource conflict', details?: Record<string, any>) {
    super(message, 409, 'RESOURCE_CONFLICT', true, details);
  }
}

export class RateLimitError extends AppError {
  constructor(message = 'Rate limit exceeded', details?: Record<string, any>) {
    super(message, 429, 'RATE_LIMIT_EXCEEDED', true, details);
  }
}

export class InternalError extends AppError {
  constructor(message = 'Internal server error', details?: Record<string, any>) {
    super(message, 500, 'INTERNAL_ERROR', false, details);
  }
}

export class DatabaseError extends AppError {
  constructor(message = 'Database operation failed', details?: Record<string, any>) {
    super(message, 500, 'DATABASE_ERROR', false, details);
  }
}

export class ExternalServiceError extends AppError {
  constructor(message = 'External service error', details?: Record<string, any>) {
    super(message, 502, 'EXTERNAL_SERVICE_ERROR', true, details);
  }
}
```

### Global Error Handler

```typescript
import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/errors';
import logger from '../utils/logger';
import config from '../config';

export const errorHandler = (
  err: Error | AppError,
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  // Default error values
  let statusCode = 500;
  let errorCode = 'INTERNAL_ERROR';
  let message = 'Something went wrong';
  let details: Record<string, any> = {};
  let isOperational = false;

  // If it's our custom AppError
  if (err instanceof AppError) {
    statusCode = err.statusCode;
    errorCode = err.code;
    message = err.message;
    details = err.details || {};
    isOperational = err.isOperational;
  }

  // In development, include more details
  if (config.isDevelopment && !isOperational) {
    details = {
      ...details,
      stack: err.stack,
    };
  }

  // Log the error
  if (statusCode >= 500) {
    logger.error(`[${errorCode}] ${message}`, {
      path: req.path,
      method: req.method,
      requestId: req.id,
      stack: err.stack,
      isOperational
    });
  } else {
    logger.warn(`[${errorCode}] ${message}`, {
      path: req.path,
      method: req.method,
      requestId: req.id
    });
  }

  // Hide internal details in production
  const responseDetails = config.isProduction && !isOperational
    ? undefined
    : Object.keys(details).length > 0 ? details : undefined;

  // Send error response
  res.status(statusCode).json({
    success: false,
    error: {
      code: errorCode,
      message: config.isProduction && !isOperational
        ? 'An unexpected error occurred'
        : message,
      ...(responseDetails && { details: responseDetails })
    }
  });
};
```

## Error Handling Best Practices

1. **Always use custom error classes** - Don't throw generic errors
   ```typescript
   // Bad
   throw new Error('User not found');
   
   // Good
   throw new NotFoundError('User not found');
   ```

2. **Include contextual details** - Add relevant error information
   ```typescript
   throw new ValidationError('Invalid user data', {
     fields: {
       email: 'Must be a valid email address',
       name: 'Required field'
     }
   });
   ```

3. **Catch specific errors** - Handle different error types appropriately
   ```typescript
   try {
     await someFunction();
   } catch (error) {
     if (error instanceof ValidationError) {
       // Handle validation errors
     } else if (error instanceof DatabaseError) {
       // Handle database errors
     } else {
       // Handle unknown errors
       throw new InternalError('Unknown error', { originalError: error.message });
     }
   }
   ```

4. **Async error handling** - Always use try/catch with async/await
   ```typescript
   export const createUser = async (req: Request, res: Response, next: NextFunction) => {
     try {
       // Function logic
     } catch (error) {
       next(error); // Pass to error handler
     }
   };
   ```

5. **Validate inputs early** - Catch validation errors at the beginning
   ```typescript
   export const createFund = async (req: Request, res: Response, next: NextFunction) => {
     try {
       // Validate request body
       const { error, value } = fundSchema.validate(req.body);
       if (error) {
         throw new ValidationError('Invalid fund data', { details: error.details });
       }
       
       // Continue with validated data
     } catch (error) {
       next(error);
     }
   };
   ```

6. **Handle Prisma errors** - Map database errors to application errors
   ```typescript
   try {
     const user = await prisma.user.create({ data });
     return user;
   } catch (error) {
     if (error.code === 'P2002') {
       throw new ConflictError('Email already in use');
     }
     throw new DatabaseError('Failed to create user', { originalError: error.message });
   }
   ```

7. **Don't expose sensitive information** - Sanitize error details
   ```typescript
   // Bad
   throw new DatabaseError(`Failed to connect to DB: ${process.env.DATABASE_URL}`);
   
   // Good
   throw new DatabaseError('Database connection failed', { 
     sanitized: true,
     dbInstance: 'primary'
   });
   ```

8. **Log appropriately** - Different levels for different error types
   ```typescript
   try {
     // Code
   } catch (error) {
     if (error.isOperational) {
       logger.warn(`Operational error: ${error.message}`);
     } else {
       logger.error(`Programming error: ${error.message}`, { stack: error.stack });
     }
     throw error;
   }
   ```

---

⏱️ Last Updated: May 5, 2024 