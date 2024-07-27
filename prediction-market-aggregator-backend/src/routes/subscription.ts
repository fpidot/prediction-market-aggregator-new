import express from 'express';
import { Subscriber } from '../models/Subscriber';
import { sendSMS } from '../services/smsService';

const router = express.Router();

const generateConfirmationCode = () => Math.floor(100000 + Math.random() * 900000).toString();

router.post('/subscribe', async (req, res) => {
  try {
    const { phoneNumber, categories, alertTypes } = req.body;
    
    let subscriber = await Subscriber.findOne({ phoneNumber });

    if (subscriber) {
      // Update existing subscriber
      subscriber.categories = categories;
      subscriber.alertTypes = alertTypes;
      subscriber.status = 'subscribed';
      await subscriber.save();
      res.status(200).json({ message: 'Subscription updated', subscriber });
    } else {
      // Create new subscriber
      const confirmationCode = generateConfirmationCode();
      subscriber = new Subscriber({
        phoneNumber,
        categories,
        alertTypes,
        status: 'subscribed',
        isActive: true,
        confirmationCode,
        isConfirmed: false
      });
      await subscriber.save();
      
      // Send confirmation SMS
      await sendSMS(phoneNumber, `Your confirmation code is: ${confirmationCode}`);
      
      res.status(201).json({ message: 'Please confirm your subscription', awaitingConfirmation: true });
    }
  } catch (error) {
    console.error('Error in subscription:', error);
    res.status(500).json({ message: 'Error processing subscription', error: (error as Error).message });
  }
});

router.post('/confirm', async (req, res) => {
  try {
    const { phoneNumber, confirmationCode } = req.body;
    
    const subscriber = await Subscriber.findOne({ phoneNumber });

    if (!subscriber) {
      return res.status(404).json({ message: 'Subscriber not found' });
    }

    if (subscriber.isConfirmed) {
      return res.status(200).json({ message: 'Subscription already confirmed' });
    }

    if (subscriber.confirmationCode === confirmationCode) {
      subscriber.isConfirmed = true;
      subscriber.confirmationCode = undefined;
      await subscriber.save();
      return res.status(200).json({ message: 'Subscription confirmed successfully' });
    } else {
      return res.status(400).json({ message: 'Invalid confirmation code' });
    }
  } catch (error) {
    console.error('Error in confirmation:', error);
    res.status(500).json({ message: 'Error confirming subscription', error: (error as Error).message });
  }
});

// Helper function to compare arrays
function arraysEqual(a: any[], b: any[]) {
  if (a.length !== b.length) return false;
  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) return false;
  }
  return true;
}

export default router;