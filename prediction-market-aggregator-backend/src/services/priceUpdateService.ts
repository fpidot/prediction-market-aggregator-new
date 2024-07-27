import Contract from '../models/Contract';

// Utility function to generate random price change
function getRandomPriceChange(): number {
  const change = (Math.random() - 0.5) * 0.1; // Random change between -0.05 and 0.05
  return Number(change.toFixed(4)); // Round to 4 decimal places
}

export async function updateContractPrices() {
  try {
    const contracts = await Contract.find();
    const updatedContracts = [];

    for (const contract of contracts) {
      const currentPrice = contract.currentPrice;
      const priceChange = getRandomPriceChange();
      const newPrice = Math.max(0, Math.min(1, currentPrice + priceChange));

      contract.currentPrice = newPrice;
      contract.lastUpdated = new Date();
      contract.priceHistory.push({ price: newPrice, timestamp: new Date() });

      // Ensure all required fields are present
      if (!contract.description) {
        contract.description = 'No description available';
      }
      if (!contract.marketplace) {
        contract.marketplace = 'Unknown';
      }
      if (!contract.category) {
        contract.category = 'Uncategorized';
      }

      updatedContracts.push(contract);
    }

    // Use bulkWrite for efficient batch updates
    await Contract.bulkWrite(
      updatedContracts.map((contract) => ({
        updateOne: {
          filter: { _id: contract._id },
          update: {
            $set: {
              currentPrice: contract.currentPrice,
              lastUpdated: contract.lastUpdated,
              description: contract.description,
              marketplace: contract.marketplace,
              category: contract.category,
            },
            $push: {
              priceHistory: {
                $each: [{ price: contract.currentPrice, timestamp: contract.lastUpdated }],
                $slice: -100 // Keep only the last 100 price history entries
              }
            }
          }
        }
      }))
    );

    console.log(`Updated prices for ${updatedContracts.length} contracts`);
  } catch (error) {
    console.error('Error updating contract prices:', error);
  }
}

export async function schedulePriceUpdates(interval: number) {
  setInterval(async () => {
    await updateContractPrices();
  }, interval);
}