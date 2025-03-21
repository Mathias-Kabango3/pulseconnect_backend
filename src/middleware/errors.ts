/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from 'express';
import logger from '../lib/logger';

const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  logger.error(`Error occurred: ${err.message}\nStack: ${err.stack}`);
  res.status(500).json({
    success: false,
    message: 'Internal Server Error',
    error: err.message,
  });
};

export default errorHandler;
