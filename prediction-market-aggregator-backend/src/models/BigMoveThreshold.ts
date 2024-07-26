import mongoose, { Document, Model } from 'mongoose';

export interface IBigMoveThreshold extends Document {
  hourlyThreshold: number;
  dailyThreshold: number;
}

const BigMoveThresholdSchema = new mongoose.Schema({
  hourlyThreshold: { type: Number, required: true },
  dailyThreshold: { type: Number, required: true },
});

export const BigMoveThreshold: Model<IBigMoveThreshold> = mongoose.model<IBigMoveThreshold>('BigMoveThreshold', BigMoveThresholdSchema);