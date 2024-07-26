import mongoose, { Document } from 'mongoose';

export interface IPricePoint {
  price: number;
  timestamp: Date;
}

export interface IContract extends Document {
  name: string;
  category: string;
  currentPrice: number;
  priceHistory: IPricePoint[];
}

const PricePointSchema = new mongoose.Schema({
  price: { type: Number, required: true },
  timestamp: { type: Date, required: true }
});

const ContractSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, required: true },
  currentPrice: { type: Number, required: true },
  priceHistory: [PricePointSchema]
});

export default mongoose.model<IContract>('Contract', ContractSchema);