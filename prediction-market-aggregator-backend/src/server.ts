import express from 'express';
import cors from 'cors';
import http from 'http';
import WebSocket from 'ws';
import mongoose from 'mongoose';
import contractRoutes from './routes/contracts';
import subscriptionRoutes from './routes/subscription';
import { updateContractPrices, schedulePriceUpdates } from './services/priceUpdateService';

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/prediction-market-aggregator')
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Error connecting to MongoDB:', err));

app.use(express.json());
app.use('/api/contracts', contractRoutes);
app.use('/api/subscriptions', subscriptionRoutes);
const corsOptions = {
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
};
app.use(cors(corsOptions));

app.options('*', cors(corsOptions));

wss.on('connection', (ws) => {
  console.log('New WebSocket connection');
  
  ws.on('message', (message) => {
    console.log('Received message:', message);
  });
});

const UPDATE_INTERVAL = 60000; // 1 minute

schedulePriceUpdates(UPDATE_INTERVAL);

setInterval(async () => {
  await updateContractPrices();
  // You might want to implement a function to get updated contracts and send them via WebSocket
  // const updatedContracts = await getUpdatedContracts();
  // wss.clients.forEach((client) => {
  //   if (client.readyState === WebSocket.OPEN) {
  //     client.send(JSON.stringify(updatedContracts));
  //   }
  // });
}, UPDATE_INTERVAL);

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});