// src/services/marketInterfaces/PolymarketAPI.ts

import puppeteer from 'puppeteer';
import { IMarket } from '../../models/Market';
import logger from '../../utils/logger';

export class PolymarketAPI {
  async fetchMarkets(): Promise<Partial<IMarket>[]> {
    return this.fetchMarketsViaScraping();
  }

  async fetchMarketsViaScraping(): Promise<Partial<IMarket>[]> {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
  
    try {
      console.log('Navigating to Polymarket...');
      await page.goto('https://polymarket.com', { waitUntil: 'networkidle0', timeout: 60000 });
      console.log('Page loaded. URL:', page.url());
  
      await page.waitForSelector('body', { timeout: 30000 });
      console.log('Body selector found');
  
      const html = await page.content();
      console.log('Page content:', html.substring(0, 500) + '...'); // Log first 500 characters
  

      const markets = await page.evaluate(() => {
        const marketElements = document.querySelectorAll('[data-testid="market-card"]');
        return Array.from(marketElements).map(element => {
          const title = element.querySelector('[data-testid="market-title"]')?.textContent?.trim() || '';
          const url = element.querySelector('a')?.href || '';
          const volume = element.querySelector('[data-testid="volume"]')?.textContent?.replace('$', '').trim() || '0';
          const outcomes = Array.from(element.querySelectorAll('[data-testid="outcome-option"]')).map(outcome => ({
            name: outcome.querySelector('[data-testid="outcome-name"]')?.textContent?.trim() || '',
            currentPrice: parseFloat(outcome.querySelector('[data-testid="outcome-price"]')?.textContent?.trim() || '0') / 100,
          }));

          return { title, url, volume: parseFloat(volume), outcomes };
        });
      });

      logger.info(`Scraped ${markets.length} markets from Polymarket.`);

      await browser.close();

      return markets.map(market => ({
        platformId: market.url.split('/').pop() || '',
        platform: 'Polymarket',
        name: market.title,
        url: market.url,
        type: market.outcomes.length > 2 ? 'multi' : 'binary',
        outcomes: market.outcomes.map(outcome => ({
          name: outcome.name,
          currentPrice: outcome.currentPrice,
          volume: market.volume / market.outcomes.length // Approximating volume per outcome
        })),
        totalVolume: market.volume,
        lastUpdated: new Date()
      }));
    } catch (error) {
      logger.error('Error scraping data from Polymarket:', error);
      await browser.close();
      return [];
    }
  }
}