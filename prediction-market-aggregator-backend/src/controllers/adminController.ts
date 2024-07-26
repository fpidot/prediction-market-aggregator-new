import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { IAdminUser } from '../models/AdminUser';
import { IContract } from '../models/Contract';
import { ISubscriber } from '../models/Subscriber';
import { IBigMoveThreshold } from '../models/BigMoveThreshold';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const JWT_EXPIRES_IN = '1h';

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const admin = await IAdminUser.findOne({ email });

    if (!admin || !(await bcrypt.compare(password, admin.password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: admin._id, email: admin.email, role: 'admin' }, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN,
    });

    res.json({ token, user: { id: admin._id, email: admin.email, role: 'admin' } });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const checkAuth = (req: Request, res: Response) => {
  res.json({ isAuthenticated: true });
};

export const refreshToken = (req: Request, res: Response) => {
  const user = req.user;
  const token = jwt.sign({ id: user.id, email: user.email, role: 'admin' }, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  });
  res.json({ token });
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
    await newContract.save();
    res.status(201).json(newContract);
  } catch (error) {
    res.status(400).json({ message: 'Error creating contract', error });
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
    res.status(400).json({ message: 'Error updating contract', error });
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
    res.status(400).json({ message: 'Error updating subscription', error });
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
    res.status(400).json({ message: 'Error updating thresholds', error });
  }
};