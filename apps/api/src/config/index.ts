import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

interface Config {
  port: number;
  nodeEnv: string;
  isDevelopment: boolean;
  isProduction: boolean;
  database: {
    url: string;
  };
  redis: {
    url: string | null;
    enabled: boolean;
  };
  auth: {
    jwtSecret: string;
    jwtExpiration: string;
  };
  endaoment: {
    apiUrl: string;
    apiKey: string;
  };
}

const config: Config = {
  port: parseInt(process.env.PORT || '3001', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  isDevelopment: (process.env.NODE_ENV || 'development') === 'development',
  isProduction: process.env.NODE_ENV === 'production',
  
  database: {
    url: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/vibez_foundation',
  },
  
  redis: {
    url: process.env.REDIS_URL || null,
    enabled: !!process.env.REDIS_URL,
  },
  
  auth: {
    jwtSecret: process.env.JWT_SECRET || 'development-secret-key',
    jwtExpiration: process.env.JWT_EXPIRATION || '1d',
  },
  
  endaoment: {
    apiUrl: process.env.ENDAOMENT_API_URL || 'https://api.endaoment.org',
    apiKey: process.env.ENDAOMENT_API_KEY || '',
  },
};

export default config; 