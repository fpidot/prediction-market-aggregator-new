import express from 'express';
import Contract from '../models/Contract';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const contracts = await Contract.find();
    res.json(contracts);
  } catch (error) {
    console.error('Error fetching contracts:', error);
    res.status(500).json({ message: 'Error fetching contracts', error: (error as Error).message });
  }
});

export default router;