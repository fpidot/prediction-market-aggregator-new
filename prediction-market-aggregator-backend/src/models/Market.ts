// src/models/Market.ts

import mongoose, { Document, Schema } from 'mongoose';

export interface IMarket {
  platformId: string;
  platform: string;
  name: string;
  url: string;
  type: 'binary' | 'multi';
  outcomes: {
    name: string;
    currentPrice: number;
    volume: number;
  }[];
  totalVolume: number;
  lastUpdated: Date;
}

const MarketSchema: Schema = new Schema({
  platformId: { type: String, required: true },
  platform: { type: String, required: true },
  name: { type: String, required: true },
  url: { type: String, required: true },
  type: { type: String, enum: ['binary', 'multi'], required: true },
  outcomes: [{
    name: { type: String, required: true },
    currentPrice: { type: Number, required: true },
    volume: { type: Number, required: true }
  }],
  totalVolume: { type: Number, required: true },
  lastUpdated: { type: Date, required: true }
});

MarketSchema.index({ platform: 1, platformId: 1 }, { unique: true });

const Market = mongoose.model<IMarket>('Market', MarketSchema);

export { Market };
export default Market;