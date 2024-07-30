// src/services/marketInterfaces/KalshiAPI.ts

import axios from 'axios';
import { IMarket } from './models/Market';
import logger from './utils/logger';

export class KalshiAPI {
  private baseUrl = 'https://trading-api.kalshi.com/trade-api/v2';
  private email: string;
  private password: string;
  private token: string | null = null;

constructor() {
  this.email = process.env.KALSHI_EMAIL || '';
  this.password = process.env.KALSHI_PASSWORD || '';
  console.log('Kalshi Email:', this.email);
  console.log('Kalshi Password:', this.password ? '[REDACTED]' : 'Not set');
}

  private async login(): Promise<void> {
    try {
      logger.info(`Attempting to log in to Kalshi with email: ${this.email}`);
      const response = await axios.post(`${this.baseUrl}/login`, {
        email: this.email,
        password: this.password
      });
      this.token = response.data.token;
      logger.info('Successfully logged in to Kalshi');
    } catch (error: any) {
      logger.error('Error logging in to Kalshi:', error.response?.data || error.message);
      throw error;
    }
  }

  async fetchMarkets(): Promise<Partial<IMarket>[]> {
    try {
      if (!this.token) {
        await this.login();
      }
      
      const response = await axios.get(`${this.baseUrl}/markets`, {
        headers: {
          'Authorization': `Bearer ${this.token}`
        }
      });
      
      logger.info(`Fetched ${response.data.markets.length} markets from Kalshi API.`);
      return response.data.markets.map(this.mapAPIResponseToMarket);
    } catch (error: any) {
      logger.error('Error fetching data from Kalshi API:', error.response?.data || error.message);
      return [];
    }
  }

  private mapAPIResponseToMarket(market: any): Partial<IMarket> {
    return {
      platformId: market.ticker,
      platform: 'Kalshi',
      name: market.title,
      url: `https://kalshi.com/markets/${market.ticker}`,
      type: 'binary', // Kalshi markets are typically binary
      outcomes: [
        {
          name: 'Yes',
          currentPrice: market.yes_bid / 100, // Kalshi prices are in cents
          volume: market.volume / 2 // Approximating volume per outcome
        },
        {
          name: 'No',
          currentPrice: market.no_bid / 100,
          volume: market.volume / 2
        }
      ],
      totalVolume: market.volume,
      lastUpdated: new Date(market.last_updated)
    };
  }
}