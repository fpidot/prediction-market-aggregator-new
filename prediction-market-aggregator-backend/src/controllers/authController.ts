import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { AdminUser } from '../models/AdminUser';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export const login = async (req: Request, res: Response) => {
  console.log('Login attempt received');
  const { email, password } = req.body;

  console.log('Received password length:', password.length);

  try {
    console.log('Searching for admin user with email:', email);
    const user = await AdminUser.findOne({ email });
    
    if (!user) {
      console.log('No user found with email:', email);
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    console.log('User found:', user.email);

    console.log('Comparing passwords');
    const isPasswordValid = await user.comparePassword(password);

    console.log('Password validity:', isPasswordValid);

    if (!isPasswordValid) {
      console.log('Password is invalid');
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    console.log('Password is valid, generating token');
    const token = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, { expiresIn: '1d' });
    console.log('Token generated successfully');
    res.json({ token });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ message: 'Error logging in', error: error instanceof Error ? error.message : 'Unknown error' });
  }
};