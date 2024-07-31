import axios from 'axios';
import cron from 'node-cron';
import { Contract } from '../models/Contract';
import logger from '../utils/logger';
import { PredictItAPI } from './marketInterfaces/PredictItAPI';
import { KalshiAPI } from './marketInterfaces/KalshiAPI';
import { PolymarketAPI } from './marketInterfaces/PolymarketAPI';
import { ManifoldMarketsAPI } from './marketInterfaces/ManifoldMarketsAPI';

class MarketDiscoveryService {
  private predictItAPI: PredictItAPI;
  private kalshiAPI: KalshiAPI;
  private polymarketAPI: PolymarketAPI;
  private manifoldAPI: ManifoldMarketsAPI;

  constructor() {
    this.predictItAPI = new PredictItAPI();
    this.kalshiAPI = new KalshiAPI();
    // Fetch the private key from an environment variable
    const polymarketPrivateKey = process.env.POLYGON_PRIVATE_KEY;
    if (!polymarketPrivateKey) {
      throw new Error('Polymarket private key not found in environment variables');
    }
    this.polymarketAPI = new PolymarketAPI(polymarketPrivateKey);
    this.manifoldAPI = new ManifoldMarketsAPI();
  }

  async discoverMarkets(): Promise<any[]> {
    try {
      const predictItMarkets = await this.predictItAPI.fetchMarkets();
      const kalshiMarkets = await this.kalshiAPI.fetchMarkets();
      const polymarketMarkets = await this.polymarketAPI.fetchMarkets();
      const manifoldMarkets = await this.manifoldAPI.fetchMarkets();

      const allMarkets = [
        ...this.formatPredictItMarkets(predictItMarkets),
        ...this.formatKalshiMarkets(kalshiMarkets),
        ...this.formatPolymarketMarkets(polymarketMarkets),
        ...this.formatManifoldMarkets(manifoldMarkets)
      ];

      for (const market of allMarkets) {
        await this.saveMarket(market);
      }

      logger.info(`Discovered ${allMarkets.length} markets`);
      return allMarkets;
    } catch (error) {
      logger.error('Error during market discovery:', error);
      throw error;
    }
  }

  private formatPredictItMarkets(markets: any[]): any[] {
    // Convert PredictIt market format to our standard format
    return markets.map(market => ({
      name: market.name,
      platform: 'PredictIt',
      category: market.category,
      externalId: market.id,
      currentPrice: market.contracts[0].lastTradePrice, // Assuming we're interested in the first contract
    }));
  }

  private formatKalshiMarkets(markets: any[]): any[] {
    // Convert Kalshi market format to our standard format
    return markets.map(market => ({
      name: market.title,
      platform: 'Kalshi',
      category: market.category,
      externalId: market.ticker,
      currentPrice: market.last_price,
    }));
  }

  private formatPolymarketMarkets(markets: any[]): any[] {
    // Convert Polymarket market format to our standard format
    return markets.map(market => ({
      name: market.question,
      platform: 'Polymarket',
      category: market.category || 'Uncategorized', // Assuming Polymarket has categories
      externalId: market.id,
      currentPrice: market.probability,
    }));
  }

  private formatManifoldMarkets(markets: any[]): any[] {
    // Convert Manifold market format to our standard format
    return markets.map(market => ({
      name: market.question,
      platform: 'Manifold',
      category: market.groupSlugs[0] || 'Uncategorized', // Using the first group as category
      externalId: market.id,
      currentPrice: market.probability,
    }));
  }

  private async saveMarket(marketData: any) {
    try {
      const existingContract = await Contract.findOne({ 
        platform: marketData.platform, 
        externalId: marketData.externalId 
      });

      if (!existingContract) {
        const newContract = new Contract({
          ...marketData,
          discoveredAt: new Date(),
          lastUpdated: new Date(),
          isTracked: false,
          isDisplayed: false
        });
        await newContract.save();
        logger.info(`New market saved: ${newContract.name}`);
      }
    } catch (error) {
      logger.error('Error saving market:', error);
    }
  }

  scheduleDiscovery() {
    cron.schedule('0 */6 * * *', () => {
      logger.info('Running scheduled market discovery');
      this.discoverMarkets();
    });
  }

  async manualDiscovery(keyword?: string, category?: string): Promise<any[]> {
    try {
      const allMarkets = await this.discoverMarkets();
      return allMarkets.filter((market: any) => 
        (!keyword || market.name.toLowerCase().includes(keyword.toLowerCase())) &&
        (!category || market.category.toLowerCase() === category.toLowerCase())
      );
    } catch (error) {
      logger.error('Error during manual discovery:', error);
      throw error;
    }
  }
}

export const marketDiscoveryService = new MarketDiscoveryService();