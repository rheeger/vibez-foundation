import { Request, Response, NextFunction } from 'express';
import passport from 'passport';
import { Strategy as JwtStrategy, ExtractJwt, StrategyOptions } from 'passport-jwt';
import { PrismaClient } from '@prisma/client';
import config from '../../config';
import logger from '../../utils/logger';

const prisma = new PrismaClient();

// Define JWT payload interface
interface JwtPayload {
  id: string;
  email: string;
  roles?: string[];
  [key: string]: any;
}

// JWT options
const jwtOptions: StrategyOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: config.auth.jwtSecret,
};

// Configure JWT strategy
passport.use(
  new JwtStrategy(jwtOptions, async (jwtPayload: JwtPayload, done) => {
    try {
      // Find the user by ID from the JWT payload
      const user = await prisma.user.findUnique({
        where: { id: jwtPayload.id },
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          profileImageUrl: true,
          isVerified: true,
          isActive: true,
        },
      });

      if (!user) {
        return done(null, false);
      }

      if (!user.isActive) {
        logger.warn(`Authentication attempt from inactive user: ${user.id}`);
        return done(null, false);
      }

      // Add user roles for authorization
      const userWithRoles = {
        ...user,
        roles: jwtPayload.roles || ['user'], // Default to 'user' role if none specified
      };

      return done(null, userWithRoles);
    } catch (error) {
      logger.error('JWT verification error:', { error });
      return done(error, false);
    }
  })
);

/**
 * Middleware to authenticate a user using JWT
 * Attaches the user object to the request if authenticated
 */
export const jwtAuthenticate = (req: Request, res: Response, next: NextFunction): void | Response => {
  passport.authenticate('jwt', { session: false }, (err: Error | null, user: Express.User | false, info: any) => {
    if (err) {
      logger.error('Authentication error:', { error: err.message });
      return next(err);
    }
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized: Invalid or expired token',
      });
    }
    
    // Attach the authenticated user to the request object
    req.user = user;
    return next();
  })(req, res, next);
}; 