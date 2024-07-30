// src/tests/apiTest.ts

import { PredictItAPI } from '../../services/marketInterfaces/PredictItAPI';
import { KalshiAPI } from '../../services/marketInterfaces/KalshiAPI';
import { PolymarketAPI } from '../../services/marketInterfaces/PolymarketAPI';
import { ManifoldMarketsAPI } from '../../services/marketInterfaces/ManifoldMarketsAPI';
import logger from '../../utils/logger';

async function testAPIs() {
  const apis = {
    PredictIt: new PredictItAPI(),
    Kalshi: new KalshiAPI(),
    Polymarket: new PolymarketAPI(),
    ManifoldMarkets: new ManifoldMarketsAPI()
  };

  for (const [name, api] of Object.entries(apis)) {
    try {
      logger.info(`Testing ${name} API...`);
      const markets = await api.fetchMarkets();
      logger.info(`${name} API fetched ${markets.length} markets.`);
      if (markets.length > 0) {
        logger.info(`Sample market from ${name}:`, JSON.stringify(markets[0], null, 2));
      }
    } catch (error) {
      logger.error(`Error testing ${name} API:`, error);
    }
  }
}

testAPIs().then(() => logger.info('API tests completed'));