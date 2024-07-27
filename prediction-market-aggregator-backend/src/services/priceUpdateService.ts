import Contract from '../models/Contract';
import { sendSMS } from './smsService';
import { Subscriber } from '../models/Subscriber';

function getRandomPriceChange(): number {
  return (Math.random() - 0.5) * 0.1; // Random change between -0.05 and 0.05
}

export async function updateContractPrices() {
  try {
    const contracts = await Contract.find();
    const bigMoves = [];
    const now = new Date();

    for (const contract of contracts) {
      const currentPrice = contract.currentPrice;
      const priceChange = getRandomPriceChange();
      const newPrice = Math.max(0, Math.min(1, currentPrice + priceChange));

      const percentageChange = Math.abs((newPrice - currentPrice) / currentPrice) * 100;

      if (percentageChange >= 5) {
        bigMoves.push({
          contractName: contract.name,
          oldPrice: currentPrice,
          newPrice: newPrice,
          percentageChange: percentageChange,
        });
      }

      // Calculate one hour and 24 hour changes
      const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);
      const twentyFourHoursAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
      const oneHourPrice = contract.priceHistory.find(ph => ph.timestamp >= oneHourAgo)?.price || currentPrice;
      const twentyFourHourPrice = contract.priceHistory.find(ph => ph.timestamp >= twentyFourHoursAgo)?.price || currentPrice;
      const oneHourChange = ((newPrice - oneHourPrice) / oneHourPrice) * 100;
      const twentyFourHourChange = ((newPrice - twentyFourHourPrice) / twentyFourHourPrice) * 100;

      // Update the contract
      await Contract.updateOne(
        { _id: contract._id },
        {
          $set: {
            currentPrice: newPrice,
            lastUpdated: now,
            oneHourChange: oneHourChange,
            twentyFourHourChange: twentyFourHourChange
          },
          $push: {
            priceHistory: {
              $each: [{ price: newPrice, timestamp: now }],
              $slice: -100 // Keep only the last 100 entries
            }
          }
        }
      );
    }

    if (bigMoves.length > 0) {
      const subscribers = await Subscriber.find({ alertTypes: { $regex: /^bigmove$/i } });
      console.log('Subscribers for big move alert:', subscribers);
      for (const subscriber of subscribers) {
        const message = `Big moves detected:\n${bigMoves
          .map(
            (move) =>
              `${move.contractName}: ${move.oldPrice.toFixed(2)} -> ${move.newPrice.toFixed(
                2
              )} (${move.percentageChange.toFixed(2)}%)`
          )
          .join('\n')}`;
        await sendSMS(subscriber.phoneNumber, message);
      }
    }

    console.log(`Updated prices for ${contracts.length} contracts`);
    return contracts;
  } catch (error) {
    console.error('Error updating contract prices:', error);
    throw error;
  }
}

// ... rest of the file remains the same

export async function schedulePriceUpdates(interval: number) {
  setInterval(async () => {
    await updateContractPrices();
  }, interval);
}

export async function sendDailyUpdate() {
  try {
    const contracts = await Contract.find().sort({ currentPrice: -1 }).limit(5);
    const subscribers = await Subscriber.find({ 
      alertTypes: { $regex: /^dailyupdate$/i } 
    });
    console.log('Sending daily update to subscribers:', subscribers);

    const message = `Daily Update:\nTop 5 Contracts:\n${contracts
      .map((contract) => `${contract.name}: ${contract.currentPrice.toFixed(2)}`)
      .join('\n')}`;

    for (const subscriber of subscribers) {
      console.log(`Attempting to send SMS to ${subscriber.phoneNumber}`);
      try {
        await sendSMS(subscriber.phoneNumber, message);
        console.log(`Successfully sent SMS to ${subscriber.phoneNumber}`);
      } catch (error) {
        console.error(`Failed to send SMS to ${subscriber.phoneNumber}:`, error);
      }
    }

    console.log('Daily update process completed');
  } catch (error) {
    console.error('Error in sendDailyUpdate:', error);
  }
}