import axios from 'axios';
import { ethers } from 'ethers';
import { IMarket } from '../../models/Market';

export class PolymarketAPI {
  private baseUrl = 'https://clob.polymarket.com';
  private signer: ethers.Wallet;

  constructor(privateKey: string) {
    if (!privateKey || privateKey.trim() === '') {
      throw new Error('Invalid private key provided to PolymarketAPI');
    }
    this.signer = new ethers.Wallet(privateKey);
  }

  private async getAuthHeaders(): Promise<Record<string, string>> {
    const timestamp = Math.floor(Date.now() / 1000).toString();
    const nonce = 0; 

    const domain = {
      name: "ClobAuthDomain",
      version: "1",
      chainId: 137, 
    };

    const types = {
      ClobAuth: [
        { name: "address", type: "address" },
        { name: "timestamp", type: "string" },
        { name: "nonce", type: "uint256" },
        { name: "message", type: "string" },
      ],
    };

    const value = {
      address: await this.signer.getAddress(),
      timestamp: timestamp,
      nonce: nonce,
      message: "This message attests that I control the given wallet",
    };

    const signature = await this.signer.signTypedData(domain, types, value);

    return {
      'POLY_ADDRESS': await this.signer.getAddress(),
      'POLY_SIGNATURE': signature,
      'POLY_TIMESTAMP': timestamp,
      'POLY_NONCE': nonce.toString(),
    };
  }

  async fetchMarkets(): Promise<Partial<IMarket>[]> {
    try {
      const headers = await this.getAuthHeaders();
      const response = await axios.get(`${this.baseUrl}/markets`, { headers });
      
      console.log('API Response structure:', JSON.stringify(response.data, null, 2));

      if (!response.data || !response.data.data) {
        console.error('Unexpected data structure from Polymarket API');
        return [];
      }

      const markets = response.data.data;
      if (!Array.isArray(markets)) {
        console.error('Markets data is not an array:', markets);
        return [];
      }

      console.log(`Fetched ${markets.length} markets from Polymarket API`);

      return markets.map(this.transformMarket);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('Axios error fetching markets from Polymarket:', error.message);
        if (error.response) {
          console.error('Error response:', error.response.data);
          console.error('Error status:', error.response.status);
        } else if (error.request) {
          console.error('No response received:', error.request);
        }
      } else {
        console.error('Error fetching markets from Polymarket:', error);
      }
      return [];
    }
  }

  private transformMarket = (market: any): Partial<IMarket> => {
    try {
      const volume = market.volume ? parseFloat(market.volume) : 0;
      return {
        platformId: market.condition_id || '',
        platform: 'Polymarket',
        name: market.question || 'Unknown Market',
        url: market.market_slug ? `https://polymarket.com/event/${market.market_slug}` : '',
        type: 'binary',
        outcomes: [
          {
            name: 'Yes',
            currentPrice: market.yes_price ? parseFloat(market.yes_price) / 100 : 0.5,
            volume: volume / 2
          },
          {
            name: 'No',
            currentPrice: market.no_price ? parseFloat(market.no_price) / 100 : 0.5,
            volume: volume / 2
          }
        ],
        totalVolume: volume,
        lastUpdated: market.updated_at ? new Date(market.updated_at) : new Date()
      };
    } catch (error) {
      console.error('Error transforming market:', error);
      console.error('Market data:', market);
      return {
        platformId: '',
        platform: 'Polymarket',
        name: 'Unknown',
        url: '',
        type: 'binary',
        outcomes: [
          { name: 'Yes', currentPrice: 0.5, volume: 0 },
          { name: 'No', currentPrice: 0.5, volume: 0 }
        ],
        totalVolume: 0,
        lastUpdated: new Date()
      };
    }
  }
}