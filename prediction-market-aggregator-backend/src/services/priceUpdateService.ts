import Contract from '../models/Contract';
import { sendSMS } from './smsService';
import { Subscriber } from '../models/Subscriber';

function getRandomPriceChange(): number {
  return (Math.random() - 0.5) * 0.1; // Random change between -0.05 and 0.05
}

export async function updateContractPrices() {
  try {
    const contracts = await Contract.find();
    const updatedContracts = [];
    const bigMoves = [];
    const now = new Date();

    for (const contract of contracts) {
      const currentPrice = contract.currentPrice;
      const priceChange = getRandomPriceChange();
      const newPrice = Math.max(0, Math.min(1, currentPrice + priceChange));

      const percentageChange = ((newPrice - currentPrice) / currentPrice) * 100;

      if (Math.abs(percentageChange) >= 5) {
        bigMoves.push({
          contractName: contract.name,
          oldPrice: currentPrice,
          newPrice: newPrice,
          percentageChange: percentageChange,
        });
      }

      const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);
      const twentyFourHoursAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
      const oneHourPrice = contract.priceHistory.find(ph => ph.timestamp >= oneHourAgo)?.price || currentPrice;
      const twentyFourHourPrice = contract.priceHistory.find(ph => ph.timestamp >= twentyFourHoursAgo)?.price || currentPrice;
      const oneHourChange = ((newPrice - oneHourPrice) / oneHourPrice) * 100;
      const twentyFourHourChange = ((newPrice - twentyFourHourPrice) / twentyFourHourPrice) * 100;

      await Contract.updateOne(
        { _id: contract._id },
        {
          $set: {
            currentPrice: newPrice,
            oneHourChange: oneHourChange,
            twentyFourHourChange: twentyFourHourChange,
            lastUpdated: now,
          },
          $push: {
            priceHistory: {
              $each: [{ price: newPrice, timestamp: now }],
              $slice: -100
            }
          }
        }
      );

      updatedContracts.push({
        ...contract.toObject(),
        currentPrice: newPrice,
        oneHourChange: oneHourChange,
        twentyFourHourChange: twentyFourHourChange,
        lastUpdated: now,
      });
    }

    if (bigMoves.length > 0) {
      console.log('Big moves detected:', bigMoves);
      const subscriberQuery = { 
        alertTypes: { $in: ['bigmove', 'Big Move'] },
        isConfirmed: true,
        status: 'subscribed'
      };
      console.log('Subscriber query:', subscriberQuery);
      
      const subscribers = await Subscriber.find(subscriberQuery);
      console.log('Subscribers for big move alert:', subscribers);
      
      if (subscribers.length === 0) {
        console.log('No subscribers found matching the criteria');
        // Log all subscribers to check their current state
        const allSubscribers = await Subscriber.find();
        console.log('All subscribers:', allSubscribers);
      }

      for (const subscriber of subscribers) {
        const message = `Big moves detected:\n${bigMoves
          .map(
            (move) =>
              `${move.contractName}: ${move.oldPrice.toFixed(2)} -> ${move.newPrice.toFixed(
                2
              )} (${move.percentageChange.toFixed(2)}%)`
          )
          .join('\n')}`;
        try {
          await sendSMS(subscriber.phoneNumber, message);
          console.log(`SMS sent to ${subscriber.phoneNumber}`);
        } catch (error) {
          console.error(`Failed to send SMS to ${subscriber.phoneNumber}:`, error);
        }
      }
    } else {
      console.log('No big moves detected');
    }

    console.log(`Updated prices for ${updatedContracts.length} contracts`);
    return updatedContracts;
  } catch (error) {
    console.error('Error updating contract prices:', error);
    throw error;
  }
}

export async function schedulePriceUpdates(interval: number) {
  setInterval(async () => {
    await updateContractPrices();
  }, interval);
}