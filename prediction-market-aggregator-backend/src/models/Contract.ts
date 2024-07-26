import mongoose, { Document, Model } from 'mongoose';

export interface IContract extends Document {
  name: string;
  description: string;
  category: string;
  currentPrice: number;
  priceHistory: {
    timestamp: Date;
    price: number;
  }[];
  outcomes: {
    name: string;
    price: number;
  }[];
  displayOutcomes: number;
}

const ContractSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  currentPrice: { type: Number, required: true },
  priceHistory: [{
    timestamp: { type: Date, default: Date.now },
    price: { type: Number, required: true }
  }],
  outcomes: [{
    name: { type: String, required: true },
    price: { type: Number, required: true }
  }],
  displayOutcomes: { type: Number, default: 2 }
});


export const Contract: Model<IContract> = mongoose.model<IContract>('Contract', ContractSchema);