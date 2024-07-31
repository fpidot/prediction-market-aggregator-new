import { Request, Response } from 'express';
import { marketDiscoveryService } from '../services/marketDiscovery';
import logger from '../utils/logger';

export const discoveryController = {
  async triggerDiscovery(req: Request, res: Response) {
    try {
      await marketDiscoveryService.discoverMarkets();
      res.status(200).json({ message: 'Market discovery triggered successfully' });
    } catch (error) {
      logger.error('Error triggering market discovery:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  async manualDiscovery(req: Request, res: Response) {
    try {
      const { keyword, category } = req.query;
      const results = await marketDiscoveryService.manualDiscovery(
        keyword as string | undefined,
        category as string | undefined
      );
      res.status(200).json(results);
    } catch (error) {
      logger.error('Error during manual market discovery:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
};