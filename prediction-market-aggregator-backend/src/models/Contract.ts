// src/models/Contract.ts

import mongoose, { Document, Schema } from 'mongoose';

export interface IContract extends Document {
  externalId: string;
  name: string;
  marketplace: string;
  title: string;
  description: string;
  category: string;
  currentPrice: number;
  oneHourChange: number;
  twentyFourHourChange: number;
  lastUpdated: Date;
  priceHistory: { price: number; timestamp: Date }[];
  internalName: string;
  type: 'binary' | 'multi';
  markets: mongoose.Types.ObjectId[];
  outcomes: {
    name: string;
    currentPrice: number;
    volume: number;
  }[];
  isActive: boolean;
}

const ContractSchema: Schema = new Schema({
  externalId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  marketplace: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  currentPrice: { type: Number, required: true },
  oneHourChange: { type: Number, default: 0 },
  twentyFourHourChange: { type: Number, default: 0 },
  lastUpdated: { type: Date, default: Date.now },
  priceHistory: [{ price: Number, timestamp: Date }],
  internalName: { type: String, required: true, unique: true },
  type: { type: String, enum: ['binary', 'multi'], required: true },
  markets: [{ type: Schema.Types.ObjectId, ref: 'Market' }],
  outcomes: [{
    name: { type: String, required: true },
    currentPrice: { type: Number, required: true },
    volume: { type: Number, required: true }
  }],
  isActive: { type: Boolean, default: true }
});

const Contract = mongoose.model<IContract>('Contract', ContractSchema);

export { Contract };
export default Contract;