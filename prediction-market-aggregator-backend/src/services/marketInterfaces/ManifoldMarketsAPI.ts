// src/services/marketInterfaces/ManifoldMarketsAPI.ts

import axios from 'axios';
import { IMarket } from '../../models/Market';
import logger from '../../utils/logger';

export class ManifoldMarketsAPI {
  private baseUrl = 'https://manifold.markets/api/v0';

  async fetchMarkets(): Promise<Partial<IMarket>[]> {
  try {
    const response = await axios.get(`${this.baseUrl}/markets`);
    
    return response.data.map((market: any) => ({
      platformId: market.id,
      platform: 'Manifold Markets',
      name: market.question,
      url: market.url,
      type: market.outcomeType === 'BINARY' ? 'binary' : 'multi',
      outcomes: market.outcomeType === 'BINARY' 
        ? [
            {
              name: 'Yes',
              currentPrice: market.probability,
              volume: market.volume
            },
            {
              name: 'No',
              currentPrice: 1 - market.probability,
              volume: market.volume
            }
          ]
        : (market.answers || []).map((answer: any) => ({
            name: answer.text,
            currentPrice: answer.probability,
            volume: market.volume // Manifold doesn't provide per-outcome volume
          })),
      totalVolume: market.volume,
      lastUpdated: new Date(market.createdTime) // Using createdTime as lastUpdated is not available
    }));
  } catch (error: any) {
    console.error('Error fetching data from Manifold Markets:', error.message);
    if (axios.isAxiosError(error)) {
      if (error.response) {
        console.error('Error status:', error.response.status);
        console.error('Error data:', error.response.data);
        console.error('Error headers:', error.response.headers);
      } else if (error.request) {
        console.error('No response received:', error.request);
      } else {
        console.error('Error setting up the request:', error.message);
      }
      console.error('Error config:', error.config);
    } else {
      console.error('Unexpected error:', error);
    }
    return [];
  }
}
}