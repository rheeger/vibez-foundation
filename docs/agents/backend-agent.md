# 🌴 VIBEZ FOUNDATION: Backend Engineering Agent Guidelines 🏝️

This document provides essential context and best practices for AI agents working on backend engineering tasks for VIBEZ FOUNDATION.

## 🌊 Project Context

VIBEZ FOUNDATION is a tropical-themed Donor-Advised Fund provider built on Endaoment's DAFs as a Service (DAAS) platform. While the frontend embraces the Caribbean theme, the backend requires rock-solid stability, security, and performance to ensure a trustworthy philanthropic experience.

## 🧩 Key Responsibilities

As a Backend Engineering Agent, your primary responsibilities include:

1. Developing API endpoints for the application
2. Integrating with Endaoment's DAAS platform
3. Implementing authentication and authorization
4. Building data models and database schemas
5. Optimizing performance and scalability
6. Ensuring data security and compliance
7. Creating comprehensive tests and documentation

## 🏗️ Technical Framework

### Core Technologies

- **Node.js**: Runtime environment (v20+ LTS)
- **Express**: API framework
- **TypeScript**: Type-safe development
- **Prisma**: ORM for database interactions
- **PostgreSQL**: Primary database
- **Redis**: Caching and session management
- **Jest**: Testing framework
- **Docker**: Containerization

### Project Structure

```
apps/api/
├── src/
│   ├── config/          # Application configuration
│   ├── controllers/     # Request handlers
│   ├── middlewares/     # Express middlewares
│   ├── models/          # Prisma models and types
│   ├── routes/          # API route definitions
│   ├── services/        # Business logic and external services
│   ├── utils/           # Utility functions
│   └── app.ts           # Main application setup
├── prisma/
│   ├── schema.prisma    # Database schema
│   └── migrations/      # Database migrations
├── tests/
│   ├── unit/            # Unit tests
│   ├── integration/     # Integration tests
│   └── e2e/             # End-to-end tests
└── tsconfig.json        # TypeScript configuration
```

## 📊 Data Models

### Core Entities

1. **User**
   - Personal information
   - Authentication details
   - Preferences
   - Roles and permissions

2. **Fund**
   - Fund details and settings
   - Balance and transaction history
   - Associated grants
   - Fund advisor information

3. **Organization**
   - Nonprofit information
   - Verification status
   - Category and tags
   - Impact metrics

4. **Grant**
   - Amount and recipient
   - Status and history
   - Associated fund
   - Tax information

### Schema Example

```prisma
// Prisma schema example

model User {
  id              String    @id @default(uuid())
  email           String    @unique
  hashedPassword  String?
  firstName       String
  lastName        String
  profileImage    String?
  isVerified      Boolean   @default(false)
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt
  funds           Fund[]
  preferences     Json?     // Theme preferences, notification settings, etc.
}

model Fund {
  id              String    @id @default(uuid())
  name            String
  description     String?
  balance         Decimal   @default(0)
  daasId          String    @unique // ID from Endaoment DAAS
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt
  userId          String
  user            User      @relation(fields: [userId], references: [id])
  grants          Grant[]
  transactions    Transaction[]
}

model Organization {
  id              String    @id @default(uuid())
  name            String
  ein             String    @unique
  mission         String
  description     String
  website         String?
  category        String
  tags            String[]
  verifiedAt      DateTime?
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt
  grants          Grant[]
}

model Grant {
  id              String    @id @default(uuid())
  amount          Decimal
  status          String    // pending, approved, sent, completed
  message         String?
  daasReferenceId String?   // Reference in Endaoment system
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt
  fundId          String
  fund            Fund      @relation(fields: [fundId], references: [id])
  organizationId  String
  organization    Organization @relation(fields: [organizationId], references: [id])
}

model Transaction {
  id              String    @id @default(uuid())
  amount          Decimal
  type            String    // deposit, withdrawal, fee
  status          String    // pending, completed, failed
  externalId      String?   // ID from payment processor
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt
  fundId          String
  fund            Fund      @relation(fields: [fundId], references: [id])
}
```

## 🔌 API Architecture

### API Design Principles

- RESTful API design
- Consistent resource naming
- Proper HTTP method usage
- Versioned endpoints (/api/v1/...)
- Comprehensive error handling
- Rate limiting and security headers
- Pagination for list endpoints
- CORS configuration

### Endpoint Structure Example

```
GET    /api/v1/funds                  # List user funds
POST   /api/v1/funds                  # Create a new fund
GET    /api/v1/funds/:id              # Get fund details
PUT    /api/v1/funds/:id              # Update fund details
DELETE /api/v1/funds/:id              # Delete a fund

GET    /api/v1/organizations          # List organizations
GET    /api/v1/organizations/:id      # Get organization details

POST   /api/v1/grants                 # Create a new grant
GET    /api/v1/grants/:id             # Get grant details
GET    /api/v1/funds/:id/grants       # List grants for a fund
```

### Response Format

```typescript
// Success response format
{
  success: true,
  data: {
    // Response data here
  },
  meta?: {
    // Pagination, counts, etc.
    page: number,
    limit: number,
    total: number,
    totalPages: number
  }
}

// Error response format
{
  success: false,
  error: {
    code: string,    // Application-specific error code
    message: string, // Human-readable message
    details?: any    // Additional error details
  }
}
```

## 🔒 Authentication & Authorization

### Authentication Strategy

- JWT-based authentication
- Access and refresh tokens
- Secure cookie storage
- Auth0 integration for social login
- MFA support for enhanced security

### Role-Based Access Control

- User roles: user, admin, super-admin
- Resource-based permissions
- Fund advisor relationships
- Organization verification levels

### Implementation Example

```typescript
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({
        success: false,
        error: {
          code: 'UNAUTHORIZED',
          message: 'Authentication required'
        }
      });
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
    const user = await prisma.user.findUnique({
      where: { id: (decoded as any).userId }
    });
    
    if (!user) {
      return res.status(401).json({
        success: false,
        error: {
          code: 'INVALID_TOKEN',
          message: 'Invalid authentication token'
        }
      });
    }
    
    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      error: {
        code: 'AUTHENTICATION_ERROR',
        message: 'Authentication failed'
      }
    });
  }
};

export const authorize = (requiredRole: string) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user || req.user.role !== requiredRole) {
      return res.status(403).json({
        success: false,
        error: {
          code: 'FORBIDDEN',
          message: 'You do not have permission to access this resource'
        }
      });
    }
    next();
  };
};
```

## 🔄 Integration with Endaoment DAAS

### Integration Points

- Fund creation and management
- Grant processing
- Organization verification
- Transaction handling
- Reporting and tax documentation

### Integration Pattern

- Service layer to abstract DAAS API
- Cached responses where appropriate
- Retry mechanisms for reliability
- Comprehensive error handling
- Webhook handlers for asynchronous updates

### Service Implementation Example

```typescript
import axios from 'axios';
import { Fund, Grant } from '@prisma/client';

export class EndaomentService {
  private apiKey: string;
  private baseUrl: string;
  
  constructor() {
    this.apiKey = process.env.ENDAOMENT_API_KEY as string;
    this.baseUrl = process.env.ENDAOMENT_API_URL as string;
  }
  
  private getHeaders() {
    return {
      'Authorization': `Bearer ${this.apiKey}`,
      'Content-Type': 'application/json'
    };
  }
  
  async createFund(fundData: Partial<Fund>): Promise<any> {
    try {
      const response = await axios.post(
        `${this.baseUrl}/funds`,
        {
          name: fundData.name,
          description: fundData.description,
          // Additional required data
        },
        { headers: this.getHeaders() }
      );
      
      return response.data;
    } catch (error) {
      this.handleError(error, 'Error creating fund in Endaoment DAAS');
    }
  }
  
  async processGrant(grantData: Partial<Grant>): Promise<any> {
    try {
      const response = await axios.post(
        `${this.baseUrl}/grants`,
        {
          fundId: grantData.fundId,
          organizationId: grantData.organizationId,
          amount: grantData.amount.toString(),
          description: grantData.message
        },
        { headers: this.getHeaders() }
      );
      
      return response.data;
    } catch (error) {
      this.handleError(error, 'Error processing grant in Endaoment DAAS');
    }
  }
  
  private handleError(error: any, defaultMessage: string): never {
    const message = error.response?.data?.message || defaultMessage;
    const statusCode = error.response?.status || 500;
    
    throw {
      message,
      statusCode,
      originalError: error
    };
  }
}
```

## 📈 Performance Optimization

### Database Optimization

- Efficient indexing strategy
- Query optimization
- Connection pooling
- Batch operations for bulk data
- Regular performance monitoring

### Caching Strategy

- Redis for fast data retrieval
- Cache invalidation patterns
- TTL-based expiration
- Distributed caching for scalability
- Selective caching for frequently accessed data

### Implementation Example

```typescript
import { createClient } from 'redis';
import { promisify } from 'util';

export class CacheService {
  private client;
  private getAsync;
  private setAsync;
  
  constructor() {
    this.client = createClient({
      url: process.env.REDIS_URL
    });
    
    this.getAsync = promisify(this.client.get).bind(this.client);
    this.setAsync = promisify(this.client.set).bind(this.client);
    
    this.client.on('error', (err) => console.error('Redis error:', err));
  }
  
  async get<T>(key: string): Promise<T | null> {
    try {
      const data = await this.getAsync(key);
      if (data) {
        return JSON.parse(data);
      }
      return null;
    } catch (error) {
      console.error('Cache get error:', error);
      return null;
    }
  }
  
  async set(key: string, value: any, expireSeconds?: number): Promise<void> {
    try {
      const stringValue = JSON.stringify(value);
      if (expireSeconds) {
        await this.setAsync(key, stringValue, 'EX', expireSeconds);
      } else {
        await this.setAsync(key, stringValue);
      }
    } catch (error) {
      console.error('Cache set error:', error);
    }
  }
  
  async invalidate(keyPattern: string): Promise<void> {
    try {
      const keys = await promisify(this.client.keys).bind(this.client)(keyPattern);
      if (keys.length > 0) {
        await promisify(this.client.del).bind(this.client)(...keys);
      }
    } catch (error) {
      console.error('Cache invalidation error:', error);
    }
  }
}
```

## 🔐 Security Best Practices

### Data Protection

- Encryption for sensitive data
- PII handling compliance
- Secure password storage (bcrypt)
- Data validation and sanitization
- Content Security Policy implementation

### API Security

- HTTPS enforcement
- API key validation
- CSRF protection
- Rate limiting
- Request throttling
- Input validation
- SQL injection prevention

### Implementation Example

```typescript
import { Request, Response, NextFunction } from 'express';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import xss from 'xss-clean';
import hpp from 'hpp';
import cors from 'cors';

export const configureSecurityMiddleware = (app) => {
  // Set security HTTP headers
  app.use(helmet());
  
  // Enable CORS with proper options
  app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true
  }));
  
  // Rate limiting
  app.use('/api/', rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: {
      success: false,
      error: {
        code: 'RATE_LIMIT_EXCEEDED',
        message: 'Too many requests, please try again later.'
      }
    }
  }));
  
  // Data sanitization against XSS
  app.use(xss());
  
  // Prevent parameter pollution
  app.use(hpp());
  
  // Force HTTPS in production
  if (process.env.NODE_ENV === 'production') {
    app.use((req: Request, res: Response, next: NextFunction) => {
      if (req.headers['x-forwarded-proto'] !== 'https') {
        return res.redirect(`https://${req.headers.host}${req.url}`);
      }
      next();
    });
  }
};
```

## 🧪 Testing Strategy

### Test Types

- **Unit Tests**: For individual functions and methods
- **Integration Tests**: For API endpoints and service interactions
- **E2E Tests**: For complete user workflows
- **Performance Tests**: For load and stress testing
- **Security Tests**: For vulnerability scanning

### Testing Tools

- Jest for test framework
- Supertest for API testing
- Testcontainers for integrated database testing
- k6 for performance testing
- OWASP ZAP for security testing

### Test Example

```typescript
import request from 'supertest';
import { app } from '../src/app';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

describe('Fund API', () => {
  let token: string;
  let userId: string;
  
  beforeAll(async () => {
    // Create test user
    const user = await prisma.user.create({
      data: {
        email: 'test@example.com',
        firstName: 'Test',
        lastName: 'User',
        hashedPassword: 'hashedpassword'
      }
    });
    
    userId = user.id;
    
    // Generate token
    token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET as string);
  });
  
  afterAll(async () => {
    // Clean up
    await prisma.user.delete({ where: { id: userId } });
    await prisma.$disconnect();
  });
  
  describe('POST /api/v1/funds', () => {
    it('should create a new fund', async () => {
      const res = await request(app)
        .post('/api/v1/funds')
        .set('Authorization', `Bearer ${token}`)
        .send({
          name: 'Test Fund',
          description: 'A test fund'
        });
      
      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('id');
      expect(res.body.data.name).toBe('Test Fund');
      
      // Clean up
      await prisma.fund.delete({ where: { id: res.body.data.id } });
    });
    
    it('should return 401 if not authenticated', async () => {
      const res = await request(app)
        .post('/api/v1/funds')
        .send({
          name: 'Test Fund',
          description: 'A test fund'
        });
      
      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
    });
  });
});
```

## 🚀 Deployment & DevOps

### CI/CD Pipeline

- GitHub Actions for automation
- Automated testing on PRs
- Deployment to staging environments
- Manual promotion to production
- Docker container builds

### Environment Configuration

- Environment-specific variables
- Secrets management
- Configuration validation
- Feature toggles
- Logging and monitoring setup

### Scaling Strategy

- Horizontal scaling with load balancing
- Containerization with Docker
- Kubernetes for orchestration
- Database read replicas
- Caching layer scaling

## 📝 Documentation Standards

### API Documentation

- OpenAPI/Swagger for API documentation
- Clear endpoint descriptions
- Request/response examples
- Error code documentation
- Authentication requirements

### Code Documentation

- TSDoc comments for functions and classes
- README files for modules
- Architecture diagrams
- Data flow documentation
- Setup and deployment instructions

### Documentation Example

```typescript
/**
 * Creates a new donor-advised fund for a user
 * 
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 * @returns {Promise<Response>} JSON response with fund data or error
 * 
 * @example
 * // Request
 * POST /api/v1/funds
 * {
 *   "name": "My Tropical Fund",
 *   "description": "Supporting ocean conservation"
 * }
 * 
 * // Success Response
 * {
 *   "success": true,
 *   "data": {
 *     "id": "123e4567-e89b-12d3-a456-426614174000",
 *     "name": "My Tropical Fund",
 *     "description": "Supporting ocean conservation",
 *     "balance": 0,
 *     "createdAt": "2023-01-01T00:00:00Z"
 *   }
 * }
 * 
 * // Error Response
 * {
 *   "success": false,
 *   "error": {
 *     "code": "VALIDATION_ERROR",
 *     "message": "Fund name is required"
 *   }
 * }
 */
export const createFund = async (req: Request, res: Response): Promise<Response> => {
  try {
    // Implementation
  } catch (error) {
    // Error handling
  }
};
```

## 🧠 Problem-Solving Approach

1. **Understand Requirements**: Clearly define the problem and requirements
2. **Research Solutions**: Explore existing patterns and best practices
3. **Plan Implementation**: Design the solution architecture
4. **Write Tests First**: Follow TDD where appropriate
5. **Implement Solution**: Write clean, efficient code
6. **Review & Refactor**: Optimize and improve the implementation
7. **Document**: Add comprehensive documentation

---

⏱️ Last Updated: [Current Date] 