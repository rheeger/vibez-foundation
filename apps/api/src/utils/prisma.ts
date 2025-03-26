import { PrismaClient } from '@prisma/client';
import logger from './logger';

// Create a singleton instance of PrismaClient
const prismaClientSingleton = () => {
  return new PrismaClient({
    log: [
      {
        emit: 'event',
        level: 'query',
      },
      {
        emit: 'event',
        level: 'error',
      },
      {
        emit: 'event',
        level: 'info',
      },
      {
        emit: 'event',
        level: 'warn',
      },
    ],
  });
};

// Global type for PrismaClient
type PrismaClientSingleton = ReturnType<typeof prismaClientSingleton>;

// Define global variable for PrismaClient
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClientSingleton | undefined;
};

// Export the PrismaClient singleton
export const prisma = globalForPrisma.prisma ?? prismaClientSingleton();

// Set up logging for Prisma queries in development
if (process.env.NODE_ENV !== 'production') {
  prisma.$on('query', (e: any) => {
    logger.debug('Prisma Query', {
      query: e.query,
      params: e.params,
      duration: `${e.duration}ms`,
    });
  });
}

prisma.$on('error', (e: any) => {
  logger.error('Prisma Error', {
    message: e.message,
    target: e.target,
  });
});

// Only in development, reset the global variable when the module is reloaded
if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
} 