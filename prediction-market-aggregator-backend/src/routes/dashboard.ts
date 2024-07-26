// src/routes/dashboard.ts

import express from 'express';
import { getSMSLogs, getSubscriberStats, getDashboardMetrics } from '../controllers/dashboardController';

const router = express.Router();

router.get('/sms-logs', getSMSLogs);
router.get('/subscriber-stats', getSubscriberStats);
router.get('/metrics', getDashboardMetrics);

export default router;