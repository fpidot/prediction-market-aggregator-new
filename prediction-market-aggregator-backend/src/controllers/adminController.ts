import { Request, Response } from 'express';
import { AdminUser, IAdminUser } from '../models/AdminUser';
import Contract, { IContract } from '../models/Contract';
import { Subscriber, ISubscriber } from '../models/Subscriber';
import { BigMoveThreshold, IBigMoveThreshold } from '../models/BigMoveThreshold';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import Settings from '../models/Settings';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export const getSettings = async (req: Request, res: Response) => {
  try {
    const settings = await Settings.findOne();
    if (!settings) {
      const defaultSettings = new Settings();
      await defaultSettings.save();
      return res.json(defaultSettings);
    }
    res.json(settings);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching settings' });
  }
};

export const updateSettings = async (req: Request, res: Response) => {
  try {
    const updatedSettings = await Settings.findOneAndUpdate({}, req.body, { new: true, upsert: true });
    res.json(updatedSettings);
  } catch (error) {
    res.status(500).json({ message: 'Error updating settings' });
  }
};

export const checkAuth = async (req: Request, res: Response) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    console.log('Received token:', token);

    if (!token) {
      console.log('No token provided');
      return res.status(401).json({ isAuthenticated: false, message: 'No token provided' });
    }

    const decoded = jwt.verify(token, JWT_SECRET) as { id: string; email: string; role: string };
    console.log('Decoded token:', decoded);

    if (decoded.role !== 'admin') {
      console.log('User is not an admin');
      return res.status(403).json({ isAuthenticated: false, message: 'Admin privileges required' });
    }

    const admin = await AdminUser.findById(decoded.id);
    if (!admin) {
      console.log('Admin not found');
      return res.status(401).json({ isAuthenticated: false, message: 'Admin not found' });
    }

    console.log('Authentication successful');
    res.json({ isAuthenticated: true, user: { id: admin._id, email: admin.email, role: 'admin' } });
  } catch (error) {
    console.error('Check auth error:', error);
    res.status(401).json({ isAuthenticated: false, message: 'Invalid token' });
  }
};

export const refreshToken = async (req: Request, res: Response) => {
  try {
    const { token } = req.body;
    if (!token) {
      return res.status(400).json({ message: 'No token provided' });
    }

    const decoded = jwt.verify(token, JWT_SECRET) as { id: string; email: string; role: string };
    const admin = await AdminUser.findById(decoded.id);

    if (!admin) {
      return res.status(401).json({ message: 'Admin not found' });
    }

    const newToken = jwt.sign({ id: admin._id, email: admin.email, role: 'admin' }, JWT_SECRET, {
      expiresIn: '1h',
    });

    res.json({ token: newToken });
  } catch (error) {
    console.error('Refresh token error:', error);
    res.status(401).json({ message: 'Invalid or expired token' });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const admin = await AdminUser.findOne({ email });

    if (!admin || !(await admin.comparePassword(password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: admin._id, email: admin.email, role: 'admin' }, JWT_SECRET, {
      expiresIn: '1h',
    });

    res.json({ token, user: { id: admin._id, email: admin.email, role: 'admin' } });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getAllContracts = async (req: Request, res: Response) => {
  try {
    const contracts = await Contract.find();
    res.json(contracts);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching contracts', error });
  }
};

export const createContract = async (req: Request, res: Response) => {
  try {
    const newContract = new Contract(req.body);
    const savedContract = await newContract.save();
    res.status(201).json(savedContract);
  } catch (error) {
    res.status(500).json({ message: 'Error creating contract', error });
  }
};

export const updateContract = async (req: Request, res: Response) => {
  try {
    const updatedContract = await Contract.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedContract) {
      return res.status(404).json({ message: 'Contract not found' });
    }
    res.json(updatedContract);
  } catch (error) {
    res.status(500).json({ message: 'Error updating contract', error });
  }
};

export const deleteContract = async (req: Request, res: Response) => {
  try {
    const deletedContract = await Contract.findByIdAndDelete(req.params.id);
    if (!deletedContract) {
      return res.status(404).json({ message: 'Contract not found' });
    }
    res.json({ message: 'Contract deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting contract', error });
  }
};

export const getAllSubscriptions = async (req: Request, res: Response) => {
  try {
    const subscriptions = await Subscriber.find();
    res.json(subscriptions);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching subscriptions', error });
  }
};

export const updateSubscription = async (req: Request, res: Response) => {
  try {
    const updatedSubscription = await Subscriber.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedSubscription) {
      return res.status(404).json({ message: 'Subscription not found' });
    }
    res.json(updatedSubscription);
  } catch (error) {
    res.status(500).json({ message: 'Error updating subscription', error });
  }
};

export const getThresholds = async (req: Request, res: Response) => {
  try {
    const thresholds = await BigMoveThreshold.findOne();
    res.json(thresholds);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching thresholds', error });
  }
};

export const updateThresholds = async (req: Request, res: Response) => {
  try {
    const updatedThresholds = await BigMoveThreshold.findOneAndUpdate({}, req.body, { new: true, upsert: true });
    res.json(updatedThresholds);
  } catch (error) {
    res.status(500).json({ message: 'Error updating thresholds', error });
  }
};