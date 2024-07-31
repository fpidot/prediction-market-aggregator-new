import express from 'express';
import { Subscriber } from '../models/Subscriber';
import { adminAuth } from '../middleware/adminAuth';
import * as adminController from '../controllers/adminController';
import * as authController from '../controllers/authController';
import Contract from '../models/Contract';
import { getSettings, updateSettings } from '../controllers/adminController';
import { discoveryController } from '../controllers/discoveryController';

const router = express.Router();

router.get('/settings', adminAuth, getSettings);
router.put('/settings', adminAuth, updateSettings);

// Admin Authentication
router.post('/login', authController.login);
router.get('/check-auth', adminAuth, adminController.checkAuth);
router.post('/refresh-token', adminAuth, adminController.refreshToken);

// Contracts
router.get('/contracts', adminAuth, adminController.getAllContracts);
router.post('/contracts', adminAuth, adminController.createContract);
router.put('/contracts/:id', adminAuth, adminController.updateContract);
router.delete('/contracts/:id', adminAuth, adminController.deleteContract);

// User Subscriptions
router.get('/subscriptions', adminAuth, adminController.getAllSubscriptions);
router.put('/subscriptions/:id', adminAuth, adminController.updateSubscription);

// Big Move Thresholds
router.get('/thresholds', adminAuth, adminController.getThresholds);
router.put('/thresholds', adminAuth, adminController.updateThresholds);

// Discovery Routes
router.post('/discovery/trigger', adminAuth, discoveryController.triggerDiscovery);
router.get('/discovery/manual', adminAuth, discoveryController.manualDiscovery);

router.get('/dashboard-metrics', async (req, res) => {
  try {
    const totalSubscribers = await Subscriber.countDocuments();
    const activeSubscribers = await Subscriber.countDocuments({ 
      status: 'subscribed', 
      isConfirmed: true 
    });
    const totalContracts = await Contract.countDocuments();
    const totalSMS = 0; // Placeholder, implement actual SMS counting logic

    console.log('Dashboard metrics:', {
      totalSubscribers,
      activeSubscribers,
      totalSMS,
      totalContracts
    });

    res.json({
      totalSubscribers,
      activeSubscribers,
      totalSMS,
      totalContracts,
      recentSMS: [] // Implement this based on your SMS tracking system
    });
  } catch (error) {
    console.error('Error fetching dashboard metrics:', error);
    res.status(500).json({ message: 'Error fetching dashboard metrics' });
  }
});

export default router;