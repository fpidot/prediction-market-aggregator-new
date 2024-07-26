// src/controllers/dashboardController.ts

import { Request, Response } from 'express';
import SMS from '../models/SMS';
import Subscriber from '../models/Subscriber';

export const getSMSLogs = async (req: Request, res: Response) => {
  try {
    const logs = await SMS.find().sort({ createdAt: -1 }).limit(100);
    res.json(logs);
  } catch (error) {
    console.error('Error fetching SMS logs:', error);
    res.status(500).json({ message: 'Error fetching SMS logs' });
  }
};

export const getSubscriberStats = async (req: Request, res: Response) => {
  try {
    const totalSubscribers = await Subscriber.countDocuments();
    const activeSubscribers = await Subscriber.countDocuments({ isActive: true });
    const inactiveSubscribers = totalSubscribers - activeSubscribers;

    res.json({
      totalSubscribers,
      activeSubscribers,
      inactiveSubscribers
    });
  } catch (error) {
    console.error('Error fetching subscriber stats:', error);
    res.status(500).json({ message: 'Error fetching subscriber stats' });
  }
};

export const getDashboardMetrics = async (req?: Request, res?: Response) => {
  try {
    const totalSMS = await SMS.countDocuments();
    const totalSubscribers = await Subscriber.countDocuments();
    const activeSubscribers = await Subscriber.countDocuments({ isActive: true });
    const recentSMS = await SMS.find().sort({ createdAt: -1 }).limit(5);

    const metrics = {
      totalSMS,
      totalSubscribers,
      activeSubscribers,
      recentSMS
    };

    if (res) {
      res.json(metrics);
    } else {
      return metrics;
    }
  } catch (error) {
    console.error('Error fetching dashboard metrics:', error);
    if (res) {
      res.status(500).json({ message: 'Error fetching dashboard metrics' });
    } else {
      throw error;
    }
  }
};