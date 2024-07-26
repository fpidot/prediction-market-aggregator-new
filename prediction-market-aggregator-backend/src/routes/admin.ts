import express from 'express';
import { adminAuth } from '../middleware/adminAuth';
import * as adminController from '../controllers/adminController';
import * as authController from '../controllers/authController';

const router = express.Router();

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

export default router;