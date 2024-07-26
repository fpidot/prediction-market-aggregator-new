import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Contract from '../models/Contract';

dotenv.config();

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/prediction_market_aggregator');

    await Contract.deleteMany({});

    const sampleContracts = [
      { name: 'US Presidential Election 2024', currentPrice: 0.5, category: 'Elections' },
      { name: 'UK General Election 2024', currentPrice: 0.6, category: 'Elections' },
      { name: 'French Presidential Election 2027', currentPrice: 0.4, category: 'Elections' },
      { name: 'US GDP Growth > 3% in 2024', currentPrice: 0.3, category: 'Economics' },
      { name: 'Euro-USD Parity by End of 2024', currentPrice: 0.2, category: 'Economics' },
      { name: 'Federal Reserve to Cut Rates in 2024', currentPrice: 0.7, category: 'Economics' },
      { name: 'China-Taiwan Conflict Escalation by 2025', currentPrice: 0.1, category: 'Geopolitics' },
      { name: 'New NATO Member Added in 2024', currentPrice: 0.4, category: 'Geopolitics' },
      { name: 'Major Cyber Attack on US Infrastructure in 2024', currentPrice: 0.3, category: 'Geopolitics' }
    ];

    await Contract.insertMany(sampleContracts);

    console.log('Database seeded successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();