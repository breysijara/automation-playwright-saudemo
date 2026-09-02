import * as winston from 'winston';
import * as path from 'path';
import * as fs from 'fs-extra';

const logDir = path.resolve(process.cwd(), 'logs');
fs.ensureDirSync(logDir);

export const Logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.errors({ stack: true }),
    winston.format.printf(({ timestamp, level, message, stack }) => {
      return `[${timestamp}] [${level.toUpperCase()}]: ${stack || message}`;
    })
  ),
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.printf(({ timestamp, level, message, stack }) => {
          return `[${timestamp}] [${level}]: ${stack || message}`;
        })
      ),
    }),
    new winston.transports.File({
      filename: path.join(logDir, 'execution.log'),
      maxsize: 5242880, // 5MB
      maxFiles: 5,
    }),
  ],
});
