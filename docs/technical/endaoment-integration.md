# 🌴 VIBEZ FOUNDATION: Endaoment DAAS Integration 🏝️

This document outlines the approach for integrating with Endaoment's Donor-Advised Funds as a Service (DAAS) platform.

## Integration Overview

```
┌─────────────────┐      ┌─────────────────┐      ┌─────────────────┐
│  VIBEZ API      │      │  VIBEZ Service  │      │  Endaoment DAAS │
│  Controllers    │──────▶  Layer          │──────▶  API            │
└─────────────────┘      └─────────────────┘      └─────────────────┘
         │                       │                        │
         ▼                       ▼                        ▼
┌─────────────────┐      ┌─────────────────┐      ┌─────────────────┐
│  VIBEZ Database │      │  Redis Cache    │      │  Webhook        │
│  (Prisma)       │◀─────┤  Layer          │◀─────┤  Handlers       │
└─────────────────┘      └─────────────────┘      └─────────────────┘
```

## Integration Points

### Key Functionality

1. **Fund Management**
   - Create Endaoment DAFs for users
   - Update fund details
   - Query fund balances and activity
   - Close/deactivate funds

2. **Organization Management**
   - Verify nonprofit eligibility
   - Get organization details
   - Track organization metrics

3. **Donation Processing**
   - Process contributions to funds
   - Track donation status
   - Generate donation receipts

4. **Grant Management**
   - Create grant recommendations
   - Track grant approval status
   - Receive grant completion notifications

## Service Implementation

### EndaomentService Class

This service abstracts all interactions with the Endaoment DAAS API.

```typescript
import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import { Fund, Organization, Donation, Grant } from '@prisma/client';
import { ExternalServiceError } from '../utils/errors';
import config from '../config';
import logger from '../utils/logger';
import { redisClient } from '../utils/redis';

export class EndaomentService {
  private client: AxiosInstance;
  private baseUrl: string;
  
  constructor() {
    this.baseUrl = config.endaoment.apiUrl;
    
    this.client = axios.create({
      baseURL: this.baseUrl,
      headers: {
        'Authorization': `Bearer ${config.endaoment.apiKey}`,
        'Content-Type': 'application/json',
        'X-API-Version': config.endaoment.apiVersion,
        'User-Agent': 'VIBEZ-Foundation/1.0'
      },
      timeout: 10000 // 10 second timeout
    });
    
    // Add request interceptor for logging
    this.client.interceptors.request.use((config) => {
      logger.debug('Endaoment API request', {
        method: config.method?.toUpperCase(),
        url: config.url
      });
      return config;
    });
    
    // Add response interceptor for error handling
    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        this.handleApiError(error);
      }
    );
  }
  
  /**
   * Create a new Donor-Advised Fund in Endaoment
   */
  async createFund(fundData: Partial<Fund>): Promise<{ id: string; status: string }> {
    try {
      const response = await this.client.post('/funds', {
        name: fundData.name,
        description: fundData.description,
        // Additional required fields
      });
      
      return {
        id: response.data.id,
        status: response.data.status
      };
    } catch (error) {
      // Error handling is done in the interceptor
      throw error;
    }
  }
  
  /**
   * Retrieve fund details from Endaoment
   */
  async getFund(endaomentFundId: string): Promise<any> {
    try {
      // Try to get from cache first
      const cacheKey = `endaoment:fund:${endaomentFundId}`;
      const cachedData = await redisClient.get(cacheKey);
      
      if (cachedData) {
        return JSON.parse(cachedData);
      }
      
      // If not in cache, get from API
      const response = await this.client.get(`/funds/${endaomentFundId}`);
      
      // Cache the result for 5 minutes
      await redisClient.set(cacheKey, JSON.stringify(response.data), 'EX', 300);
      
      return response.data;
    } catch (error) {
      throw error;
    }
  }
  
  /**
   * Update fund details in Endaoment
   */
  async updateFund(endaomentFundId: string, updateData: Partial<Fund>): Promise<any> {
    try {
      const response = await this.client.patch(`/funds/${endaomentFundId}`, {
        name: updateData.name,
        description: updateData.description
        // Other updateable fields
      });
      
      // Invalidate cache
      await redisClient.del(`endaoment:fund:${endaomentFundId}`);
      
      return response.data;
    } catch (error) {
      throw error;
    }
  }
  
  /**
   * Process a donation to a fund
   */
  async processDonation(donationData: {
    fundId: string;
    amount: number;
    currency?: string;
    paymentMethod?: string;
  }): Promise<any> {
    try {
      const response = await this.client.post('/donations', {
        fundId: donationData.fundId,
        amount: donationData.amount,
        currency: donationData.currency || 'USD',
        paymentMethod: donationData.paymentMethod || 'card'
      });
      
      // Invalidate fund cache since balance will change
      await redisClient.del(`endaoment:fund:${donationData.fundId}`);
      
      return response.data;
    } catch (error) {
      throw error;
    }
  }
  
  /**
   * Get organization details from Endaoment
   */
  async getOrganization(ein: string): Promise<any> {
    try {
      // Try to get from cache first
      const cacheKey = `endaoment:org:${ein}`;
      const cachedData = await redisClient.get(cacheKey);
      
      if (cachedData) {
        return JSON.parse(cachedData);
      }
      
      // If not in cache, get from API
      const response = await this.client.get(`/organizations?ein=${ein}`);
      
      // Cache the result for 1 day (org data changes infrequently)
      await redisClient.set(cacheKey, JSON.stringify(response.data), 'EX', 86400);
      
      return response.data;
    } catch (error) {
      throw error;
    }
  }
  
  /**
   * Process a grant recommendation
   */
  async createGrant(grantData: {
    fundId: string;
    organizationId: string;
    amount: number;
    message?: string;
  }): Promise<any> {
    try {
      const response = await this.client.post('/grants', {
        fundId: grantData.fundId,
        organizationId: grantData.organizationId,
        amount: grantData.amount,
        message: grantData.message || ''
      });
      
      // Invalidate fund cache since balance will change
      await redisClient.del(`endaoment:fund:${grantData.fundId}`);
      
      return response.data;
    } catch (error) {
      throw error;
    }
  }
  
  /**
   * Get grant details
   */
  async getGrant(grantId: string): Promise<any> {
    try {
      const response = await this.client.get(`/grants/${grantId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
  
  /**
   * Handle API errors with proper mapping to our error types
   */
  private handleApiError(error: any): never {
    const errorResponse = error.response;
    
    // Log the error
    logger.error('Endaoment API error', {
      status: errorResponse?.status,
      method: error.config?.method?.toUpperCase(),
      url: error.config?.url,
      data: errorResponse?.data
    });
    
    // Define error message and details
    const message = errorResponse?.data?.message || 'Error communicating with Endaoment API';
    const details = {
      endaomentError: errorResponse?.data,
      requestUrl: error.config?.url,
      requestMethod: error.config?.method?.toUpperCase()
    };
    
    // Map HTTP status codes to our error types
    switch (errorResponse?.status) {
      case 400:
        throw new ExternalServiceError('Invalid request to Endaoment API', details);
      case 401:
      case 403:
        throw new ExternalServiceError('Authentication error with Endaoment API', details);
      case 404:
        throw new ExternalServiceError('Resource not found in Endaoment API', details);
      case 429:
        throw new ExternalServiceError('Rate limit exceeded with Endaoment API', details);
      default:
        throw new ExternalServiceError(message, details);
    }
  }
}

// Export singleton instance
export const endaomentService = new EndaomentService();
```

## Webhook Implementation

Endaoment DAAS provides webhooks for asynchronous updates. These should be handled as follows:

```typescript
import { Request, Response, NextFunction } from 'express';
import crypto from 'crypto';
import { prisma } from '../utils/prisma';
import logger from '../utils/logger';
import config from '../config';
import { BadRequestError, UnauthorizedError } from '../utils/errors';

/**
 * Verify Endaoment webhook signature
 */
const verifySignature = (payload: string, signature: string): boolean => {
  const hmac = crypto.createHmac('sha256', config.endaoment.webhookSecret);
  const calculatedSignature = hmac.update(payload).digest('hex');
  return crypto.timingSafeEqual(
    Buffer.from(calculatedSignature),
    Buffer.from(signature)
  );
};

/**
 * Handle Endaoment webhooks
 */
export const handleEndaomentWebhook = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Get signature from headers
    const signature = req.headers['x-endaoment-signature'] as string;
    
    if (!signature) {
      throw new UnauthorizedError('Missing webhook signature');
    }
    
    // Verify signature
    const payload = JSON.stringify(req.body);
    if (!verifySignature(payload, signature)) {
      throw new UnauthorizedError('Invalid webhook signature');
    }
    
    // Get event type
    const { event, data } = req.body;
    
    if (!event || !data) {
      throw new BadRequestError('Invalid webhook payload');
    }
    
    logger.info(`Endaoment webhook received: ${event}`, { data });
    
    // Handle different event types
    switch (event) {
      case 'fund.created':
        await handleFundCreated(data);
        break;
      case 'fund.updated':
        await handleFundUpdated(data);
        break;
      case 'donation.completed':
        await handleDonationCompleted(data);
        break;
      case 'grant.approved':
        await handleGrantApproved(data);
        break;
      case 'grant.completed':
        await handleGrantCompleted(data);
        break;
      default:
        logger.warn(`Unhandled Endaoment webhook event: ${event}`);
    }
    
    // Return success
    res.status(200).json({ success: true });
  } catch (error) {
    next(error);
  }
};

/**
 * Handle fund created event
 */
async function handleFundCreated(data: any) {
  // Update local database with Endaoment fund data
  await prisma.fund.update({
    where: { endaomentFundId: data.id },
    data: {
      isActive: true,
      // Other fields to update
    }
  });
}

/**
 * Handle fund updated event
 */
async function handleFundUpdated(data: any) {
  // Update local database with changes
  await prisma.fund.update({
    where: { endaomentFundId: data.id },
    data: {
      raisedAmount: data.balance || 0,
      // Other fields to update
    }
  });
}

/**
 * Handle donation completed event
 */
async function handleDonationCompleted(data: any) {
  // Update donation status in local database
  await prisma.donation.update({
    where: { transactionId: data.transactionId },
    data: {
      status: 'completed',
      // Other fields to update
    }
  });
  
  // Update fund balance
  if (data.fundId) {
    const fund = await prisma.fund.findFirst({
      where: { endaomentFundId: data.fundId }
    });
    
    if (fund) {
      await prisma.fund.update({
        where: { id: fund.id },
        data: {
          raisedAmount: {
            increment: parseFloat(data.amount)
          }
        }
      });
    }
  }
}

/**
 * Handle grant approved event
 */
async function handleGrantApproved(data: any) {
  // Update grant status in local database
  const grant = await prisma.donation.findFirst({
    where: { transactionId: data.id }
  });
  
  if (grant) {
    await prisma.donation.update({
      where: { id: grant.id },
      data: {
        status: 'approved'
      }
    });
  }
}

/**
 * Handle grant completed event
 */
async function handleGrantCompleted(data: any) {
  // Update grant status in local database
  const grant = await prisma.donation.findFirst({
    where: { transactionId: data.id }
  });
  
  if (grant) {
    await prisma.donation.update({
      where: { id: grant.id },
      data: {
        status: 'completed'
      }
    });
  }
}
```

## Data Synchronization Strategy

### Initial Setup

1. **Local-First Approach**
   - Create records in VIBEZ database first
   - Then create corresponding resources in Endaoment
   - Update local records with Endaoment IDs

2. **Background Processing**
   - Use job queues for non-critical operations
   - Implement retry logic for failed API calls
   - Log and alert on persistent failures

### Ongoing Synchronization

1. **Webhook-Driven Updates**
   - Primary method for data synchronization
   - Update local database on webhook events
   - Validate webhook data before processing

2. **Scheduled Reconciliation**
   - Daily job to reconcile data with Endaoment
   - Fix any discrepancies between systems
   - Generate alerts for manual review if needed

3. **On-Demand Refresh**
   - API endpoints to force data refresh
   - Admin dashboard with reconciliation tools
   - User-triggered refresh for specific resources

## Error Handling and Recovery

1. **Transactional Operations**
   - Use database transactions where appropriate
   - Record operation states for recovery
   - Implement idempotent operations

2. **Failure Recovery**
   - Automated retry for transient failures
   - Manual intervention tools for permanent failures
   - Notification system for critical errors

3. **Data Integrity Verification**
   - Checksum validation for webhook data
   - Balance reconciliation for funds
   - Audit logs for all Endaoment operations

## Security Considerations

1. **API Key Management**
   - Store API keys in secure environment variables
   - Rotate keys periodically
   - Different keys for different environments

2. **Webhook Verification**
   - Verify webhook signatures using HMAC
   - Validate webhook data format
   - Implement IP-based filtering

3. **PII Handling**
   - Minimize PII sent to Endaoment
   - Encrypt sensitive user data
   - Implement proper data deletion procedures

---

⏱️ Last Updated: May 5, 2024 