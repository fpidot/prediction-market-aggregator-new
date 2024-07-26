import mongoose, { Schema, Document } from 'mongoose';

export interface IBigMoveThreshold extends Document {
  hourlyThreshold: number;
  dailyThreshold: number;
}

const BigMoveThresholdSchema: Schema = new Schema({
  hourlyThreshold: { type: Number, required: true },
  dailyThreshold: { type: Number, required: true },
});

export default mongoose.model<IBigMoveThreshold>('BigMoveThreshold', BigMoveThresholdSchema);