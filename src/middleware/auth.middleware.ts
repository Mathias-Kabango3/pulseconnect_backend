import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { Request, Response, NextFunction, RequestHandler } from 'express';

// Load environment variables
dotenv.config();

const ACCESS_TOKEN_SECRET = process.env.JWT_ACCESS_TOKEN;

if (!ACCESS_TOKEN_SECRET) {
  throw new Error('Access Token not provided in environment variables');
}

// Extend Request type to include user property
import { JwtPayload } from 'jsonwebtoken';

declare module 'express-serve-static-core' {
  interface Request {
    user?: string | JwtPayload;
  }
}

// Middleware to authenticate JWT token
export const authenticateToken: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const token = req.header('Authorization')?.split(' ')[1]; // Extract Bearer Token

  if (!token) {
    res.status(401).json({ message: 'Access denied. No token provided.' });
    return;
  }

  try {
    const decoded = jwt.verify(token, ACCESS_TOKEN_SECRET);
    req.user = decoded; // Attach decoded user to request
    next();
  } catch {
    res.status(403).json({ message: 'Invalid or expired token.' });
  }
};
