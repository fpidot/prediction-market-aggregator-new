import Contract from '../models/Contract';
import Subscriber from '../models/Subscriber';
import { sendSMS } from './smsService';

const BIG_MOVE_THRESHOLD = 0.1; // 10% change

export async function checkForBigMoves() {
  const contracts = await Contract.find();
  
  for (const contract of contracts) {
    const currentPrice = contract.currentPrice;
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
    const priceOneHourAgo = contract.priceHistory.find(pp => pp.timestamp >= oneHourAgo)?.price || currentPrice;

    const priceChange = (currentPrice - priceOneHourAgo) / priceOneHourAgo;
    
    if (Math.abs(priceChange) >= BIG_MOVE_THRESHOLD) {
      const message = `Big move alert: ${contract.name} has moved ${(priceChange * 100).toFixed(2)}% in the last hour.`;
      const subscribers = await Subscriber.find({ 
        status: 'subscribed', 
        categories: contract.category, 
        alertTypes: 'bigMove' 
      });
      
      for (const subscriber of subscribers) {
        try {
          await sendSMS(subscriber.phoneNumber, message);
        } catch (error) {
          console.error(`Failed to send alert to ${subscriber.phoneNumber}:`, error);
        }
      }
    }
  }
}