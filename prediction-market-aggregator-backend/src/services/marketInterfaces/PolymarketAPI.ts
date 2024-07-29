// src/services/marketInterfaces/PolymarketAPI.ts

import axios from 'axios';
import { IMarket } from '../../models/Market';
import logger from '../../utils/logger';

export class PolymarketAPI {
  private baseUrl = 'https://clob.polymarket.com';

  async fetchMarkets(): Promise<Partial<IMarket>[]> {
    try {
      const response = await axios.get(`${this.baseUrl}/markets`);
      
      return response.data.map((market: any) => ({
        platformId: market.marketHash,
        platform: 'Polymarket',
        name: market.question,
        url: `https://polymarket.com/event/${market.slug}`,
        type: market.outcomesNames.length > 2 ? 'multi' : 'binary',
        outcomes: market.outcomesNames.map((name: string, index: number) => ({
          name: name,
          currentPrice: parseFloat(market.outcomesPrices[index]),
          volume: parseFloat(market.outcomesVolume[index])
        })),
        totalVolume: parseFloat(market.volume),
        lastUpdated: new Date(market.lastUpdateTimestamp)
      }));
    } catch (error) {
      logger.error('Error fetching data from Polymarket:', error);
      return [];
    }
  }
}