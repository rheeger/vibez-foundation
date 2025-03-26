import { Request, Response, NextFunction } from 'express';

/**
 * Middleware to authenticate a user using JWT
 * Attaches the user object to the request if authenticated
 */
export declare function jwtAuthenticate(req: Request, res: Response, next: NextFunction): void | Response; 