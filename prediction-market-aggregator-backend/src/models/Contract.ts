import mongoose, { Document, Schema } from 'mongoose';

export interface IContract extends Document {
  externalId: string;
  name: string;
  marketplace: string;
  title: string;
  description: string;
  category: string;
  currentPrice: number;
  lastUpdated: Date;
  priceHistory: { price: number; timestamp: Date }[];
}

const ContractSchema: Schema = new Schema({
  externalId: { type: String, required: true, unique: true },
  marketplace: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  currentPrice: { type: Number, required: true },
  lastUpdated: { type: Date, default: Date.now },
  priceHistory: [{ price: Number, timestamp: Date }]
});

export default mongoose.model<IContract>('Contract', ContractSchema);