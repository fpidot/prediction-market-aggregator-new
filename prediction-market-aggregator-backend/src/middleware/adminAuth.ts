import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../services/authService';

declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

export const adminAuth = (req: Request, res: Response, next: NextFunction) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    console.log('No token provided');
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    const decoded = verifyToken(token);
    
    // Check if the decoded token has an admin role
    if (decoded.role !== 'admin') {
      console.log('Access denied: User is not an admin');
      return res.status(403).json({ message: 'Access denied. Admin privileges required.' });
    }

    console.log('Admin authenticated successfully');
    req.user = decoded;
    next();
  } catch (error) {
    console.error('Token verification failed:', error);
    res.status(401).json({ message: 'Invalid token' });
  }
};