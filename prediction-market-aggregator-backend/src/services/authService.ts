import jwt from 'jsonwebtoken';
import { AdminUser, IAdminUser } from '../models/AdminUser';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export const generateToken = (user: IAdminUser): string => {
  return jwt.sign({ id: user._id, username: user.email }, JWT_SECRET, { expiresIn: '1d' });
};

export const verifyToken = (token: string): any => {
  return jwt.verify(token, JWT_SECRET);
};