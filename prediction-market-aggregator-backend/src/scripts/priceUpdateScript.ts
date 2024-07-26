import { updatePrices } from '../services/priceUpdateService';

async function runPriceUpdate() {
  try {
    await updatePrices();
    console.log('Prices updated successfully');
  } catch (error) {
    console.error('Error updating prices:', error);
  }
}

setInterval(runPriceUpdate, 60000); // Run every minute
runPriceUpdate(); // Run immediately on start