// src/services/marketInterfaces/KalshiAPI.ts

import axios from 'axios';
import { IMarket } from '../../models/Market';
import logger from '../../utils/logger';

export class KalshiAPI {
  private baseUrl = 'https://trading-api.kalshi.com/trade-api/v2';
  private email: string;
  private password: string;

  constructor() {
    this.email = process.env.KALSHI_EMAIL || '';
    this.password = process.env.KALSHI_PASSWORD || '';
  }

  private async getAuthToken(): Promise<string> {
    try {
      const response = await axios.post(`${this.baseUrl}/login`, {
        email: this.email,
        password: this.password
      });
      return response.data.token;
    } catch (error) {
      logger.error('Error getting Kalshi auth token:', error);
      throw error;
    }
  }

  async fetchMarkets(): Promise<Partial<IMarket>[]> {
    try {
      const token = await this.getAuthToken();
      const response = await axios.get(`${this.baseUrl}/exchange/markets`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      return response.data.markets.map((market: any) => ({
        platformId: market.ticker,
        platform: 'Kalshi',
        name: market.title,
        url: `https://kalshi.com/markets/${market.ticker}`,
        type: 'binary', // Kalshi markets are binary
        outcomes: [
          {
            name: 'Yes',
            currentPrice: market.latest_price / 100, // Kalshi prices are in cents
            volume: market.volume
          },
          {
            name: 'No',
            currentPrice: 1 - (market.latest_price / 100),
            volume: market.volume
          }
        ],
        totalVolume: market.volume,
        lastUpdated: new Date(market.last_update)
      }));
    } catch (error) {
      logger.error('Error fetching data from Kalshi:', error);
      return [];
    }
  }
}