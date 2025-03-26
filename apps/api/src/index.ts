import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import path from 'path';
import config from './config';
import logger from './utils/logger';
import { errorHandler, notFoundHandler } from './middlewares/errorHandler';
import apiRoutes from './routes';
import { prisma } from './utils/prisma';
import { initRedis } from './utils/redis';

// Initialize Express app
const app: Express = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Simple logging middleware
app.use((req: Request, _: Response, next: NextFunction) => {
  logger.info(`${req.method} ${req.path}`, {
    ip: req.ip,
    userAgent: req.get('user-agent')
  });
  next();
});

// API Routes
app.use('/api', apiRoutes);

// Handle 404 errors for non-API routes
app.use(notFoundHandler);

// Global error handler
app.use(errorHandler);

// Initialize services
const initServices = async () => {
  try {
    // Initialize Redis
    if (config.redis.enabled && config.redis.url) {
      await initRedis();
    } else {
      logger.warn('Redis is disabled - running without cache');
    }

    // Test Prisma connection
    await prisma.$connect();
    logger.info('Database connection established');

    // Start server
    const server = app.listen(config.port, () => {
      logger.info(`Server running in ${config.nodeEnv} mode on port ${config.port}`);
      logger.info(`Health check: http://localhost:${config.port}/api/health`);
    });

    // Graceful shutdown
    const gracefulShutdown = async () => {
      logger.info('Shutting down gracefully...');
      
      // Close server
      server.close(async () => {
        try {
          // Disconnect Prisma
          await prisma.$disconnect();
          logger.info('Database disconnected');
          
          logger.info('Graceful shutdown completed');
          process.exit(0);
        } catch (error) {
          logger.error('Error during shutdown', { error: (error as Error).message });
          process.exit(1);
        }
      });
    };

    // Listen for termination signals
    process.on('SIGTERM', gracefulShutdown);
    process.on('SIGINT', gracefulShutdown);

  } catch (error) {
    logger.error('Failed to initialize services', { error: (error as Error).message });
    process.exit(1);
  }
};

// Handle unhandled rejections
process.on('unhandledRejection', (err: Error) => {
  logger.error('UNHANDLED REJECTION! Shutting down...', { error: err.message, stack: err.stack });
  process.exit(1);
});

// Handle uncaught exceptions
process.on('uncaughtException', (err: Error) => {
  logger.error('UNCAUGHT EXCEPTION! Shutting down...', { error: err.message, stack: err.stack });
  process.exit(1);
});

// Start application
initServices().catch(error => {
  logger.error('Failed to start application', { error: (error as Error).message });
  process.exit(1);
}); 