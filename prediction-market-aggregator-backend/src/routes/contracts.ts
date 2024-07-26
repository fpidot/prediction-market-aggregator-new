import express from 'express';
import Contract from '../models/Contract';
import { getContractsWithChanges } from '../services/priceUpdateService';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const contractsWithChanges = await getContractsWithChanges();
    res.json(contractsWithChanges);
  } catch (error) {
    console.error('Error fetching contracts:', error);
    res.status(500).json({ message: 'Error fetching contracts' });
  }
});

// Keep the original route as a separate endpoint, just in case it's needed
router.get('/basic', async (req, res) => {
  try {
    const contracts = await Contract.find().select('name currentPrice category lastUpdated');
    res.json(contracts);
  } catch (error) {
    console.error('Error fetching basic contracts:', error);
    res.status(500).json({ message: 'Error fetching basic contracts' });
  }
});

export default router;