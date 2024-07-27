import express from 'express';
import http from 'http';
import WebSocket from 'ws';
import mongoose from 'mongoose';
import cors from 'cors';
import contractRoutes from './routes/contracts';
import subscriptionRoutes from './routes/subscription';
import { updateContractPrices, schedulePriceUpdates, sendDailyUpdate } from './services/priceUpdateService';
import Contract from './models/Contract';

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// CORS configuration
const corsOptions = {
  origin: 'http://localhost:3000',
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/prediction-market-aggregator')
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Error connecting to MongoDB:', err));

app.use(express.json());
app.use('/api/contracts', contractRoutes);
app.use('/api/subscriptions', subscriptionRoutes);

wss.on('connection', (ws) => {
  console.log('New WebSocket connection');
  
  ws.on('message', (message) => {
    console.log('Received message:', message);
  });
});

const UPDATE_INTERVAL = 60000; // 1 minute

schedulePriceUpdates(UPDATE_INTERVAL);

setInterval(async () => {
  const updatedContracts = await updateContractPrices();
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify({ type: 'PRICE_UPDATE', contracts: updatedContracts }));
    }
  });
}, UPDATE_INTERVAL);

// Schedule daily update
const DAILY_UPDATE_INTERVAL = 24 * 60 * 60 * 1000; // 24 hours
setInterval(sendDailyUpdate, DAILY_UPDATE_INTERVAL);

// Send initial daily update on server start
sendDailyUpdate();

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});