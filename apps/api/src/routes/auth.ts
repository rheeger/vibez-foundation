import { Router, Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import bcrypt from 'bcrypt';
import jwt, { SignOptions } from 'jsonwebtoken';
import { PrismaClient, User } from '@prisma/client';
import config from '../config';
import logger from '../utils/logger';
import { jwtAuthenticate } from '../middlewares/auth';

const router = Router();
const prisma = new PrismaClient();

// Define user with roles interface
interface UserWithRoles extends User {
  roles: string[];
}

// Validation rules
const registerValidation = [
  body('email').isEmail().withMessage('Must be a valid email address'),
  body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
  body('firstName').notEmpty().withMessage('First name is required'),
  body('lastName').notEmpty().withMessage('Last name is required'),
];

const loginValidation = [
  body('email').isEmail().withMessage('Must be a valid email address'),
  body('password').notEmpty().withMessage('Password is required'),
];

/**
 * Generate JWT token for a user
 */
const generateToken = (user: UserWithRoles): string => {
  const payload = {
    id: user.id,
    email: user.email,
    roles: user.roles || ['user'],
  };

  // Use proper typing for JSON Web Token signing
  const options: jwt.SignOptions = { 
    expiresIn: config.auth.jwtExpiration as jwt.SignOptions['expiresIn']
  };
  
  return jwt.sign(
    payload, 
    config.auth.jwtSecret, 
    options
  );
};

/**
 * @route POST /api/auth/register
 * @desc Register a new user
 * @access Public
 */
router.post('/register', registerValidation, async (req: Request, res: Response): Promise<void> => {
  // Validate request
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ 
      success: false,
      errors: errors.array() 
    });
    return;
  }

  try {
    const { email, password, firstName, lastName } = req.body;

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      res.status(400).json({
        success: false,
        message: 'User with this email already exists'
      });
      return;
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = await prisma.user.create({
      data: {
        email,
        firstName,
        lastName,
        hashedPassword,
      }
    });

    // Generate token
    const userWithRoles = { ...newUser, roles: ['user'] };
    const token = generateToken(userWithRoles);

    // Return user data and token
    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        user: {
          id: newUser.id,
          email: newUser.email,
          firstName: newUser.firstName,
          lastName: newUser.lastName,
          isVerified: newUser.isVerified,
        },
        token
      }
    });
  } catch (error) {
    logger.error('User registration error:', { error });
    res.status(500).json({
      success: false,
      message: 'An error occurred during registration'
    });
  }
});

/**
 * @route POST /api/auth/login
 * @desc Authenticate user & get token
 * @access Public
 */
router.post('/login', loginValidation, async (req: Request, res: Response): Promise<void> => {
  // Validate request
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ 
      success: false,
      errors: errors.array() 
    });
    return;
  }

  try {
    const { email, password } = req.body;

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
      return;
    }

    // Check if user is active
    if (!user.isActive) {
      res.status(401).json({
        success: false,
        message: 'Account is inactive'
      });
      return;
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.hashedPassword);
    if (!isPasswordValid) {
      res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
      return;
    }

    // Generate token
    const userWithRoles = { ...user, roles: ['user'] };
    const token = generateToken(userWithRoles);

    // Return user data and token
    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          profileImageUrl: user.profileImageUrl,
          isVerified: user.isVerified,
        },
        token
      }
    });
  } catch (error) {
    logger.error('User login error:', { error });
    res.status(500).json({
      success: false,
      message: 'An error occurred during login'
    });
  }
});

/**
 * @route GET /api/auth/me
 * @desc Get current user profile
 * @access Private
 */
router.get('/me', jwtAuthenticate, async (req: Request, res: Response): Promise<void> => {
  try {
    res.status(200).json({
      success: true,
      data: {
        user: req.user
      }
    });
  } catch (error) {
    logger.error('Get user profile error:', { error });
    res.status(500).json({
      success: false,
      message: 'An error occurred while fetching user profile'
    });
  }
});

export default router; 