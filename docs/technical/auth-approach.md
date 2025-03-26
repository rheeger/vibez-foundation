# 🌴 VIBEZ FOUNDATION: Authentication & Authorization Approach 🏝️

This document outlines the authentication and authorization strategy for the VIBEZ FOUNDATION platform.

## Authentication Flow

```
┌─────────────┐      ┌─────────────┐      ┌─────────────┐      ┌─────────────┐
│   Client    │      │  Auth API   │      │   Database  │      │  Redis      │
└─────┬───────┘      └─────┬───────┘      └─────┬───────┘      └─────┬───────┘
      │                    │                    │                    │
      │  Login Request     │                    │                    │
      │ ─────────────────> │                    │                    │
      │                    │  Validate User     │                    │
      │                    │ ─────────────────> │                    │
      │                    │  User Data         │                    │
      │                    │ <───────────────── │                    │
      │                    │                    │                    │
      │                    │  Store Tokens      │                    │
      │                    │ ─────────────────────────────────────> │
      │                    │  Success           │                    │
      │                    │ <───────────────────────────────────── │
      │  Tokens            │                    │                    │
      │ <───────────────── │                    │                    │
      │                    │                    │                    │
```

## Token-Based Authentication

The system uses JSON Web Tokens (JWT) for authentication with the following characteristics:

1. **Access Token**
   - Short-lived (15 minutes)
   - Contains user ID and permissions
   - Used for API authentication
   - Sent in `Authorization` header

2. **Refresh Token**
   - Long-lived (7 days)
   - Stored in HTTP-only secure cookie
   - Used to obtain new access tokens
   - Invalid after password change

3. **Token Storage**
   - Access tokens are stored in memory (not localStorage)
   - Refresh tokens are stored in HTTP-only cookies
   - Redis maintains a token blacklist for revoked tokens

## Authentication Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/v1/auth/register` | POST | Create new user account |
| `/api/v1/auth/login` | POST | Authenticate and get tokens |
| `/api/v1/auth/refresh` | POST | Get new access token using refresh token |
| `/api/v1/auth/logout` | POST | Invalidate tokens |
| `/api/v1/auth/me` | GET | Get current user information |
| `/api/v1/auth/password` | PATCH | Update user password |

## Authorization Model

### Role-Based Access Control (RBAC)

The system implements RBAC with the following roles:

1. **Guest** - Unauthenticated users
   - Can view public funds and organizations
   - Can register for an account

2. **User** - Standard authenticated users
   - Can create and manage their own funds
   - Can make donations
   - Can view and manage their profile

3. **Admin** - Platform administrators
   - Can manage all funds and organizations
   - Can verify organizations
   - Can view donation statistics

4. **Super Admin** - System administrators
   - Full access to all resources
   - Can manage admin accounts
   - Can access system configuration

### Permission Implementation

Permissions are implemented at multiple levels:

1. **Route-Level Authorization**
   - Middleware checks role requirements for routes
   - Prevents unauthorized access to protected endpoints

2. **Resource-Level Authorization**
   - Checks if user has permission for specific resources
   - Enforces ownership and access control policies

3. **Field-Level Authorization**
   - Filters sensitive fields based on user role
   - Prevents unauthorized data exposure

## Implementation Details

### Authentication Middleware

```typescript
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { UnauthorizedError } from '../utils/errors';
import { redisClient } from '../utils/redis';
import { prisma } from '../utils/prisma';
import config from '../config';

// Verify access token and attach user to request
export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Get token from Authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return next(new UnauthorizedError('No token provided'));
    }
    
    const token = authHeader.split(' ')[1];
    
    // Check if token is blacklisted
    const isBlacklisted = await redisClient.get(`blacklist:${token}`);
    if (isBlacklisted) {
      return next(new UnauthorizedError('Token is no longer valid'));
    }
    
    // Verify token
    const decoded = jwt.verify(token, config.jwt.secret) as { id: string };
    
    // Get user from database
    const user = await prisma.user.findUnique({
      where: { id: decoded.id }
    });
    
    if (!user) {
      return next(new UnauthorizedError('User not found'));
    }
    
    // Attach user to request object
    req.user = user;
    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      return next(new UnauthorizedError('Invalid token'));
    }
    next(error);
  }
};
```

### Authorization Middleware

```typescript
import { Request, Response, NextFunction } from 'express';
import { ForbiddenError } from '../utils/errors';

// Restrict access based on user role
export const restrictTo = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new ForbiddenError('Access denied'));
    }
    
    if (!roles.includes(req.user.role)) {
      return next(new ForbiddenError('Insufficient permissions'));
    }
    
    next();
  };
};

// Check if user owns a resource or is admin
export const checkOwnership = (resourceModel: string, paramName: string = 'id') => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        return next(new ForbiddenError('Access denied'));
      }
      
      // Admins can access any resource
      if (req.user.role === 'admin' || req.user.role === 'super_admin') {
        return next();
      }
      
      const resourceId = req.params[paramName];
      
      // Get resource from database
      const resource = await prisma[resourceModel].findUnique({
        where: { id: resourceId }
      });
      
      if (!resource) {
        return next(new ForbiddenError('Resource not found'));
      }
      
      // Check if user owns the resource
      if (resource.userId !== req.user.id) {
        return next(new ForbiddenError('You do not have permission to access this resource'));
      }
      
      next();
    } catch (error) {
      next(error);
    }
  };
};
```

## Security Considerations

1. **Password Storage**
   - Passwords are hashed using bcrypt (12+ rounds)
   - Plain text passwords are never stored or logged
   - Password reset uses time-limited tokens

2. **Brute Force Protection**
   - Rate limiting on authentication endpoints
   - Account lockout after multiple failed attempts
   - CAPTCHA for registration and password reset

3. **Token Security**
   - JWT signed with strong secret key
   - Short token lifespan
   - HTTP-only cookies for refresh tokens
   - Token rotation on suspicious activity

4. **Session Management**
   - Force logout on password change
   - Token blacklisting for logout
   - Session timeout for inactive users
   - Device tracking for suspicious activity

---

⏱️ Last Updated: May 5, 2024 