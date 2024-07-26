import cron from 'node-cron';
import { Subscriber } from '../models/Subscriber';
import { Contract } from '../models/Contract';
import { sendSMS } from './smsService';

export async function generateDailyUpdate(): Promise<string> {
  const contracts = await Contract.find().sort({ currentPrice: -1 }).limit(5);
  let message = "Daily Update:\n";
  contracts.forEach((contract, index) => {
    message += `${index + 1}. ${contract.name}: ${contract.currentPrice.toFixed(2)}\n`;
  });
  return message;
}

export async function scheduleDailyUpdates() {
  console.log('Sending daily updates...');
  const update = await generateDailyUpdate();
  const activeSubscribers = await Subscriber.find({ status: 'subscribed' });
  
  for (const subscriber of activeSubscribers) {
    try {
      await sendSMS(subscriber.phoneNumber, update);
    } catch (error) {
      console.error(`Failed to send update to ${subscriber.phoneNumber}:`, error);
    }
  }
}

export function initScheduler() {
  cron.schedule('0 9 * * *', scheduleDailyUpdates, {
    scheduled: true,
    timezone: "UTC"
  });
}