import dotenv from 'dotenv';
dotenv.config();
import { PredictItAPI } from '../../services/marketInterfaces/PredictItAPI';
import { KalshiAPI } from '../../services/marketInterfaces/KalshiAPI';
import { PolymarketAPI } from '../../services/marketInterfaces/PolymarketAPI';
import { ManifoldMarketsAPI } from '../../services/marketInterfaces/ManifoldMarketsAPI';
import logger from '../../utils/logger';

const polygonPrivateKey = process.env.POLYGON_PRIVATE_KEY;
if (!polygonPrivateKey) {
  throw new Error('POLYGON_PRIVATE_KEY is not set in the environment variables');
}

const polymarketAPI = new PolymarketAPI(polygonPrivateKey);

async function testAPIs() {
  const apis = {
    PredictIt: new PredictItAPI(),
    Kalshi: new KalshiAPI(),
    Polymarket: polymarketAPI,
    ManifoldMarkets: new ManifoldMarketsAPI()
  };

  for (const [name, api] of Object.entries(apis)) {
    try {
      console.log(`[INFO] Testing ${name} API...`);
      const markets = await api.fetchMarkets();
      console.log(`[INFO] ${name} API fetched ${markets.length} markets.`);
      if (markets.length > 0) {
        console.log(`[INFO] Sample market from ${name}:`, JSON.stringify(markets[0], null, 2));
      } else {
        console.log(`[WARN] No markets fetched from ${name} API.`);
      }
    } catch (error) {
      console.error(`[ERROR] Error testing ${name} API:`, error);
    }
  }
}

testAPIs().then(() => logger.info('API tests completed'));