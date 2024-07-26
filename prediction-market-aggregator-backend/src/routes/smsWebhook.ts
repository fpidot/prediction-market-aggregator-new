import express from 'express';
import { handleSmsCommand } from '../services/smsCommandService';

const router = express.Router();

router.post('/webhook', async (req, res) => {
  const { Body, From } = req.body;
  try {
    const result = await handleSmsCommand(Body, From);
    res.status(200).send(result);
  } catch (error) {
    console.error('Error handling SMS command:', error);
    res.status(500).send('Error processing command');
  }
});

export default router;