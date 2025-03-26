import { createClient, RedisClientType } from 'redis';
import config from '../config';
import logger from './logger';

// Create Redis client
let redisClient: RedisClientType | null = null;

/**
 * Initialize Redis client
 */
export const initRedis = async () => {
  if (!config.redis.enabled || !config.redis.url) {
    logger.info('Redis is disabled');
    return null;
  }

  try {
    redisClient = createClient({ url: config.redis.url });

    // Log redis errors
    redisClient.on('error', (err) => {
      logger.error('Redis error', { error: err.message });
    });
    
    // Connect to Redis
    await redisClient.connect();
    logger.info('Redis connected');
    
    return redisClient;
  } catch (error) {
    logger.error('Redis connection failed', { error: (error as Error).message });
    return null;
  }
};

/**
 * Get Redis client
 */
export const getRedisClient = async (): Promise<RedisClientType | null> => {
  if (!config.redis.enabled || !config.redis.url) {
    return null;
  }

  if (!redisClient) {
    return await initRedis();
  }
  
  // If client is not ready, reconnect
  if (!redisClient.isReady) {
    try {
      await redisClient.connect();
    } catch (error) {
      logger.error('Redis reconnection failed', { error: (error as Error).message });
      return null;
    }
  }
  
  return redisClient;
};

/**
 * Get cached data
 */
export const getCached = async <T>(key: string): Promise<T | null> => {
  if (!config.redis.enabled) return null;

  try {
    const client = await getRedisClient();
    if (!client) return null;
    
    const data = await client.get(key);
    
    if (!data) return null;
    
    return JSON.parse(data) as T;
  } catch (error) {
    logger.error('Redis get error', { error: (error as Error).message, key });
    return null;
  }
};

/**
 * Set data in cache
 */
export const setCached = async <T>(
  key: string, 
  data: T, 
  expirationInSeconds?: number
): Promise<boolean> => {
  if (!config.redis.enabled) return false;

  try {
    const client = await getRedisClient();
    if (!client) return false;
    
    const serialized = JSON.stringify(data);
    
    if (expirationInSeconds) {
      await client.setEx(key, expirationInSeconds, serialized);
    } else {
      await client.set(key, serialized);
    }
    
    return true;
  } catch (error) {
    logger.error('Redis set error', { error: (error as Error).message, key });
    return false;
  }
};

/**
 * Delete cached data
 */
export const deleteCached = async (key: string): Promise<boolean> => {
  if (!config.redis.enabled) return false;

  try {
    const client = await getRedisClient();
    if (!client) return false;
    
    await client.del(key);
    return true;
  } catch (error) {
    logger.error('Redis delete error', { error: (error as Error).message, key });
    return false;
  }
};

/**
 * Clear entire cache
 */
export const clearCache = async (): Promise<boolean> => {
  if (!config.redis.enabled) return false;

  try {
    const client = await getRedisClient();
    if (!client) return false;
    
    await client.flushAll();
    return true;
  } catch (error) {
    logger.error('Redis flush error', { error: (error as Error).message });
    return false;
  }
}; 