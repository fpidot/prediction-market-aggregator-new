import { sendSMS } from './smsService';
import Subscriber, { ISubscriber } from '../models/Subscriber';

export const sendDailyUpdates = async () => {
  const subscribers = await Subscriber.find({ 
    status: 'subscribed', 
    alertTypes: 'daily' 
  });

  for (const subscriber of subscribers) {
    const message = generateDailyUpdateMessage(subscriber);
    await sendSMS(subscriber.phoneNumber, message);
    subscriber.lastAlertSent = new Date();
    await subscriber.save();
  }
};

export const sendBigMoveAlerts = async (category: string, contractName: string, priceChange: number) => {
  const subscribers = await Subscriber.find({ 
    status: 'subscribed', 
    alertTypes: 'bigMove',
    categories: category
  });

  for (const subscriber of subscribers) {
    const message = `Big move alert: ${contractName} in ${category} has moved ${priceChange}%.`;
    await sendSMS(subscriber.phoneNumber, message);
    subscriber.lastAlertSent = new Date();
    await subscriber.save();
  }
};

const generateDailyUpdateMessage = (subscriber: ISubscriber): string => {
  // Implement logic to generate a personalized daily update message
  // based on the subscriber's preferences
  return `Here's your daily update for ${subscriber.categories.join(', ')}...`;
};