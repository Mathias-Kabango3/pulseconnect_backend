import { Response, Request, NextFunction } from 'express';

const adminMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  // Check if user is admin
  if (!req.user || typeof req.user !== 'object' || req.user.role !== 'ADMIN') {
    res.status(403).json({ message: 'Forbidden' });
    return;
  }

  // Continue with the request
  next();
};

export default adminMiddleware;
