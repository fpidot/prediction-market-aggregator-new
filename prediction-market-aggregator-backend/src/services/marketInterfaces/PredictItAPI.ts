// src/services/marketInterfaces/PredictItAPI.ts

import axios from 'axios';
import { IMarket } from '../../models/Market';
import logger from '../../utils/logger';

export class PredictItAPI {
  private baseUrl = 'https://www.predictit.org/api/marketdata/all/';

  async fetchMarkets(): Promise<Partial<IMarket>[]> {
    try {
      const response = await axios.get(this.baseUrl);
      return response.data.markets.map((market: any) => ({
        platformId: market.id.toString(),
        platform: 'PredictIt',
        name: market.name,
        url: `https://www.predictit.org/markets/detail/${market.id}`,
        type: market.contracts.length > 2 ? 'multi' : 'binary',
        outcomes: market.contracts.map((contract: any) => ({
          name: contract.name,
          currentPrice: contract.lastTradePrice,
          volume: contract.volume
        })),
        totalVolume: market.contracts.reduce((sum: number, contract: any) => sum + contract.volume, 0),
        lastUpdated: new Date()
      }));
    } catch (error) {
      logger.error('Error fetching data from PredictIt:', error);
      return [];
    }
  }
}