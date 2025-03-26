import { createLogger, format, transports } from 'winston';
import config from '../config';

// Define log format
const logFormat = format.printf((info) => {
  const { level, message, timestamp, ...metadata } = info;
  let msg = `${timestamp} [${level}]: ${message}`;
  
  if (Object.keys(metadata).length > 0) {
    msg += ` ${JSON.stringify(metadata)}`;
  }
  
  return msg;
});

// Create the logger
const logger = createLogger({
  level: config.isDevelopment ? 'debug' : 'info',
  format: format.combine(
    format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    format.errors({ stack: true }),
    format.splat(),
    format.json()
  ),
  defaultMeta: { service: 'api' },
  transports: [
    // Write all logs to console
    new transports.Console({
      format: format.combine(
        format.colorize(),
        logFormat
      ),
    }),
  ],
});

// Add file transport in production
if (config.isProduction) {
  logger.add(
    new transports.File({ 
      filename: 'logs/error.log', 
      level: 'error',
      maxsize: 10485760, // 10MB
      maxFiles: 5
    })
  );
  
  logger.add(
    new transports.File({ 
      filename: 'logs/combined.log',
      maxsize: 10485760, // 10MB
      maxFiles: 5
    })
  );
}

export default logger; 