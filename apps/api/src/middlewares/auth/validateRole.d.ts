import { Request, Response, NextFunction } from 'express';

/**
 * Middleware to validate if the authenticated user has the required role(s)
 * @param requiredRoles - Array of roles that are allowed to access the route
 * @returns Express middleware function
 */
export declare function validateRole(requiredRoles: string[]): (req: Request, res: Response, next: NextFunction) => void | Response; 