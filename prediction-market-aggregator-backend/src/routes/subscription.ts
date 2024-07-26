import express from 'express';
import { sendSMS } from '../services/smsService';
import { Subscriber } from '../models/Subscriber';

const router = express.Router();

router.post('/subscribe', async (req, res) => {
    try {
      const { phoneNumber, categories, alertTypes } = req.body;
      
      let subscriber = await Subscriber.findOne({ phoneNumber });
      
      const confirmationCode = Math.floor(100000 + Math.random() * 900000).toString();
      
      if (subscriber) {
        subscriber.categories = categories;
        subscriber.alertTypes = alertTypes;
        subscriber.status = 'pending';
        subscriber.confirmationCode = confirmationCode;
      } else {
        subscriber = new Subscriber({ 
          phoneNumber, 
          categories, 
          alertTypes, 
          status: 'pending', 
          confirmationCode 
        });
      }
      
      await subscriber.save();
      
      await sendSMS(phoneNumber, `Your confirmation code is: ${confirmationCode}`);
      
      res.status(200).json({ message: 'Please confirm your subscription with the code sent to your phone.' });
    } catch (error) {
      console.error('Error processing subscription:', error);
      res.status(500).json({ 
        message: 'Error processing subscription', 
        error: error instanceof Error ? error.message : 'An unknown error occurred' 
      });
    }
  });

router.post('/confirm', async (req, res) => {
    try {
      const { phoneNumber, confirmationCode } = req.body;
      
      const subscriber = await Subscriber.findOne({ phoneNumber });
      
      if (!subscriber) {
        return res.status(404).json({ success: false, message: 'Subscriber not found' });
      }
  
      // Here, you should compare the received confirmation code with the one stored for this subscriber
      // For this example, let's assume we store the code in a `confirmationCode` field on the subscriber document
      if (subscriber.confirmationCode !== confirmationCode) {
        return res.status(400).json({ success: false, message: 'Invalid confirmation code' });
      }
  
      subscriber.status = 'subscribed';
      subscriber.confirmationCode = undefined; // Clear the confirmation code after successful confirmation
      await subscriber.save();
      
      // Send welcome message
      await sendSMS(phoneNumber, 'Welcome! You are now subscribed to alerts. Reply STOP to unsubscribe, PAUSE to mute for a day, or RESUME to resume alerts.');
      
      res.status(200).json({ success: true, message: 'Subscription confirmed' });
    } catch (error) {
      console.error('Error confirming subscription:', error);
      res.status(500).json({ success: false, message: 'Error confirming subscription' });
    }
  });

export default router;