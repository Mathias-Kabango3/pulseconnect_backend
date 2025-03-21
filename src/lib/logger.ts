import winston from 'winston';
import 'winston-mongodb';

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.printf(({ timestamp, level, message }) => {
      return `${timestamp} ${level}: ${message}`;
    })
  ),
  defaultMeta: { service: 'user-service' },
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      ),
    }),

    new winston.transports.File({
      filename: 'logs/error.log',
      level: 'error',
      maxsize: 5242880,
      maxFiles: 5,
    }),

    new winston.transports.MongoDB({
      db: 'mongodb://localhost:27017/logs',
      collection: 'error_logs',
      level: 'error',
      options: {
        useUnifiedTopology: true,
      },
      storeHost: true,
    }),
  ],
});

export default logger;
