declare global {
    namespace Express {
      interface Request {
        user?: any;
      }
    }
  }
  
  import { Request, Response, NextFunction } from 'express';
  import { verifyToken } from '../services/authService';
  import jwt from 'jsonwebtoken';
  
  export const adminAuth = (req: Request, res: Response, next: NextFunction) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');
  
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }
  
    try {
      const decoded = verifyToken(token);
      
      // Check if the decoded token has an admin role
      if (decoded.role !== 'admin') {
        return res.status(403).json({ message: 'Access denied. Admin privileges required.' });
      }
  
      req.user = decoded;
      next();
    } catch (error) {
      res.status(401).json({ message: 'Invalid token' });
    }
  };