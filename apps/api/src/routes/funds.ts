import { Router, Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import { PrismaClient } from '@prisma/client';
import config from '../config';
import logger from '../utils/logger';
import { jwtAuthenticate } from '../middlewares/auth';

const router = Router();
const prisma = new PrismaClient();

// Validation rules for DAF creation
const createDafValidation = [
  body('name').notEmpty().withMessage('Fund name is required'),
  body('description').notEmpty().withMessage('Fund description is required'),
  body('fundAdvisor.firstName').notEmpty().withMessage('Advisor first name is required'),
  body('fundAdvisor.lastName').notEmpty().withMessage('Advisor last name is required'),
  body('fundAdvisor.email').isEmail().withMessage('Valid advisor email is required'),
  body('fundAdvisor.address.line1').notEmpty().withMessage('Advisor address line 1 is required'),
  body('fundAdvisor.address.city').notEmpty().withMessage('Advisor city is required'),
  body('fundAdvisor.address.state').notEmpty().withMessage('Advisor state is required'),
  body('fundAdvisor.address.zip').notEmpty().withMessage('Advisor zip code is required'),
  body('fundAdvisor.address.country').notEmpty().withMessage('Advisor country is required')
];

/**
 * @route POST /api/funds
 * @desc Create a new Donor-Advised Fund using Endaoment DAAS API
 * @access Private
 */
router.post('/', jwtAuthenticate, createDafValidation, async (req: Request, res: Response): Promise<void> => {
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
    const {
      name,
      description,
      fundAdvisor
    } = req.body;

    // Check if the user has the token needed for Endaoment
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
      return;
    }

    // Retrieve the user's Endaoment token from our database or session
    // For this implementation, we're assuming we have access to the user's Endaoment token
    // In a real implementation, you would store this token when the user connects their Endaoment account
    
    // This is just a placeholder - in reality, you'd get this from your database
    // or from a token exchange with Endaoment
    const endaomentToken = req.headers.authorization?.split(' ')[1] || '';

    if (!endaomentToken) {
      res.status(401).json({
        success: false,
        message: 'Missing Endaoment authorization token'
      });
      return;
    }

    // Send a request to Endaoment API to create the DAF
    try {
      logger.info('Creating DAF on Endaoment API', { fundName: name });
      
      const fundCreationResponse = await fetch(`${config.endaoment.apiUrl}/v1/funds`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${endaomentToken}`,
        },
        body: JSON.stringify({
          fundInput: {
            name,
            description,
            fundAdvisor,
          }
        }),
      });

      const endaomentResponseData = await fundCreationResponse.json();

      // Check if the response was successful
      if (!fundCreationResponse.ok) {
        logger.error('Endaoment DAF creation failed', { 
          statusCode: fundCreationResponse.status,
          error: endaomentResponseData 
        });
        
        res.status(fundCreationResponse.status).json({
          success: false,
          message: 'Failed to create DAF on Endaoment',
          error: endaomentResponseData
        });
        return;
      }

      // Create the fund in our database with a reference to the Endaoment fund ID
      const newFund = await prisma.fund.create({
        data: {
          name,
          description,
          endaomentFundId: endaomentResponseData.id,
          userId: req.user.id,
          // Optional fields
          imageUrl: req.body.imageUrl,
          goalAmount: req.body.goalAmount ? parseFloat(req.body.goalAmount) : null,
        }
      });

      // Return success response with fund details
      res.status(201).json({
        success: true,
        message: 'DAF created successfully',
        data: {
          fund: {
            id: newFund.id,
            name: newFund.name,
            description: newFund.description,
            endaomentFundId: newFund.endaomentFundId,
            createdAt: newFund.createdAt,
            imageUrl: newFund.imageUrl,
            goalAmount: newFund.goalAmount,
          },
          endaomentData: endaomentResponseData
        }
      });
      
    } catch (error) {
      logger.error('Error communicating with Endaoment API', { error });
      res.status(500).json({
        success: false,
        message: 'Error communicating with Endaoment API'
      });
    }
  } catch (error) {
    logger.error('DAF creation error:', { error });
    res.status(500).json({
      success: false,
      message: 'An error occurred during DAF creation'
    });
  }
});

/**
 * @route GET /api/funds/mine
 * @desc Get all funds created by the current user
 * @access Private
 */
router.get('/mine', jwtAuthenticate, async (req: Request, res: Response): Promise<void> => {
  try {
    // Get all funds created by the current user
    const funds = await prisma.fund.findMany({
      where: {
        userId: req.user?.id,
        isActive: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    res.status(200).json({
      success: true,
      data: {
        funds
      }
    });
  } catch (error) {
    logger.error('Error fetching user funds:', { error });
    res.status(500).json({
      success: false,
      message: 'An error occurred while fetching funds'
    });
  }
});

export default router; 