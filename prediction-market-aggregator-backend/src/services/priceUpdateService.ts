import Contract from '../models/Contract';
import { checkForBigMoves } from './bigMoveAlertService';

interface VersionError extends Error {
    name: string;
    version: number;
    modifiedPaths: string[];
  }
  
  export async function updatePrices() {
    const contracts = await Contract.find();
    const updatedContracts = [];
  
    for (const contract of contracts) {
      try {
        // Fetch the latest version of the contract
        const latestContract = await Contract.findById(contract._id);
        if (!latestContract) {
          console.log(`Contract not found: ${contract._id}`);
          continue;
        }
  
        // Simulate fetching new price from third-party platform
        const newPrice = latestContract.currentPrice + (Math.random() - 0.5) * 0.1;
        
        // Add new price point to history
        latestContract.priceHistory.push({ price: newPrice, timestamp: new Date() });
  
        // Keep only last 24 hours of price history
        const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
        latestContract.priceHistory = latestContract.priceHistory.filter(pp => pp.timestamp >= oneDayAgo);
  
        // Update current price
        latestContract.currentPrice = newPrice;
  
        // Save with optimistic concurrency control
        await latestContract.save();
        updatedContracts.push(latestContract);
      } catch (error: unknown) {
        if (error instanceof Error) {
          if (error.name === 'VersionError') {
            console.log(`Concurrency issue updating contract ${contract._id}, will retry on next cycle`);
          } else {
            console.error(`Error updating contract ${contract._id}:`, error.message);
          }
        } else {
          console.error(`Unknown error updating contract ${contract._id}`);
        }
      }
    }
  
    console.log('Prices updated:', updatedContracts.map(c => ({ name: c.name, price: c.currentPrice })));
    await checkForBigMoves();
    return updatedContracts;
  }

export async function getContractsWithChanges() {
  const contracts = await Contract.find();
  return contracts.map(contract => {
    const latestPrice = contract.currentPrice;
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

    const oneHourAgoPrice = contract.priceHistory.find(pp => pp.timestamp <= oneHourAgo)?.price ?? latestPrice;
    const twentyFourHoursAgoPrice = contract.priceHistory.find(pp => pp.timestamp <= twentyFourHoursAgo)?.price ?? latestPrice;

    const oneHourChange = latestPrice - oneHourAgoPrice;
    const twentyFourHourChange = latestPrice - twentyFourHoursAgoPrice;

    return {
      _id: contract._id,
      name: contract.name,
      category: contract.category,
      currentPrice: latestPrice,
      oneHourChange,
      twentyFourHourChange
    };
  });
}