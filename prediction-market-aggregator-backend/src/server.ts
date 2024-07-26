import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import http from 'http';
import { WebSocketServer, WebSocket } from 'ws';
import contractsRouter from './routes/contracts';
import { updatePrices, getContractsWithChanges } from './services/priceUpdateService';
import subscriptionRoutes from './routes/subscription';
import smsHandlerRoutes from './routes/smsHandler';
import { scheduleDailyUpdates } from './services/dailyUpdateService';
import smsWebhookRouter from './routes/smsWebhook';
import dashboardRoutes from './routes/dashboard';
import { getDashboardMetrics } from './controllers/dashboardController';
import logger from './utils/logger';

dotenv.config();

console.log('TWILIO_ACCOUNT_SID:', process.env.TWILIO_ACCOUNT_SID);
console.log('TWILIO_AUTH_TOKEN:', process.env.TWILIO_AUTH_TOKEN ? 'Set' : 'Not set');
console.log('TWILIO_PHONE_NUMBER:', process.env.TWILIO_PHONE_NUMBER);

const app = express();

app.use(cors());
app.use(express.json());
app.use('/api/subscription', subscriptionRoutes);
app.use('/api/sms', smsHandlerRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/contracts', contractsRouter);
app.use('/api/sms', smsWebhookRouter);

const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/prediction_market_aggregator')
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('Error connecting to MongoDB:', err));

scheduleDailyUpdates();

app.get('/', (req, res) => {
  res.send('Prediction Market Aggregator API');
});

const server = http.createServer(app);
const wss = new WebSocketServer({ server });

wss.on('listening', () => {
  console.log('WebSocket server is listening');
});

wss.on('connection', (ws) => {
  console.log('Client connected to WebSocket');
  
  ws.on('error', (error) => {
    console.error('WebSocket error:', error);
  });

  ws.on('close', () => console.log('Client disconnected from WebSocket'));
  
  // Send initial data immediately upon connection
  broadcastUpdate(ws);

  // Set up interval for this specific client
  const intervalId = setInterval(() => broadcastUpdate(ws), 30000);

  ws.on('close', () => {
    clearInterval(intervalId);
  });
});

// Function to broadcast updates to a specific client or all clients
const broadcastUpdate = async (ws?: WebSocket) => {
    try {
      const updatedContracts = await updatePrices();
      const contractsWithChanges = await getContractsWithChanges();
      const dashboardMetrics = await getDashboardMetrics();
  
      const dataToSend = JSON.stringify({
        contracts: contractsWithChanges,
        dashboardMetrics: dashboardMetrics
      });
  
      if (ws) {
        if (ws.readyState === WebSocket.OPEN) {
          ws.send(dataToSend);
        }
      } else {
        wss.clients.forEach((client) => {
          if (client.readyState === WebSocket.OPEN) {
            client.send(dataToSend);
          }
        });
      }
    } catch (error) {
      logger.error('Error in broadcastUpdate:', error);
    }
  };

// Update prices and broadcast every minute to all clients
setInterval(() => broadcastUpdate(), 60000);

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});