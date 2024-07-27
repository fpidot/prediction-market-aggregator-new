import express from 'express';
import Contract from '../models/Contract';


const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const contracts = await Contract.find();
    res.json(contracts);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching contracts', error });
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