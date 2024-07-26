import express from 'express';
import twilio from 'twilio';
import Subscriber from '../models/Subscriber';
import { sendSMS } from '../services/smsService';

const router = express.Router();

router.post('/sms', twilio.webhook(), async (req, res) => {
  const { Body, From } = req.body;
  const command = Body.trim().toUpperCase();
  const phoneNumber = From.replace('whatsapp:', ''); // Remove 'whatsapp:' prefix if present

  try {
    const subscriber = await Subscriber.findOne({ phoneNumber });

    if (!subscriber) {
      return res.status(404).send('Subscriber not found');
    }

    switch (command) {
      case 'STOP':
        subscriber.status = 'stopped';
        await subscriber.save();
        await sendSMS(phoneNumber, 'You have been unsubscribed from all alerts.');
        break;
      case 'PAUSE':
        subscriber.status = 'paused';
        await subscriber.save();
        await sendSMS(phoneNumber, 'Your alerts have been paused for 24 hours.');
        break;
      case 'RESUME':
        subscriber.status = 'subscribed';
        await subscriber.save();
        await sendSMS(phoneNumber, 'Your alerts have been resumed.');
        break;
      default:
        await sendSMS(phoneNumber, 'Invalid command. Available commands: STOP, PAUSE, RESUME');
    }

    res.status(200).send('OK');
  } catch (error) {
    console.error('Error processing SMS command:', error);
    res.status(500).send('Error processing command');
  }
});

export default router;