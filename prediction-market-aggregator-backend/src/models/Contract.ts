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
  priceHistory: [{ price: Number, timestamp: Date }]
});

export default mongoose.model<IContract>('Contract', ContractSchema);