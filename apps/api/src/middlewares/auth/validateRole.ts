import { Request, Response, NextFunction } from 'express';
import logger from '../../utils/logger';

/**
 * Middleware to validate if the authenticated user has the required role(s)
 * @param requiredRoles - Array of roles that are allowed to access the route
 * @returns Express middleware function
 */
export const validateRole = (requiredRoles: string[]): (req: Request, res: Response, next: NextFunction) => void | Response => {
  return (req: Request, res: Response, next: NextFunction): void | Response => {
    // First check if the user is authenticated
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized: Authentication required',
      });
    }

    // Check if the user has any of the required roles
    const hasRole = requiredRoles.some(role => req.user?.roles.includes(role));
    
    if (!hasRole) {
      logger.warn(`Authorization failure: User ${req.user.id} attempted to access resource requiring roles: ${requiredRoles.join(', ')}`);
      return res.status(403).json({
        success: false,
        message: 'Forbidden: Insufficient permissions',
      });
    }

    // User has the required role, proceed
    next();
  };
}; 