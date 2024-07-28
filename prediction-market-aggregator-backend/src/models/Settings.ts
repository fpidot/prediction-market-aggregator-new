import mongoose, { Document, Schema } from 'mongoose';

export interface ISettings extends Document {
  bigMoveThreshold: number;
  dailyUpdateTime: string;
  topContractsToDisplay: number;
  smsRateLimit: number;
  websocketConnectionLimit: number;
  dataRefreshFrequency: {
    predictIt: number;
    kalshi: number;
    polymarket: number;
    manifoldMarkets: number;
  };
}

const SettingsSchema: Schema = new Schema({
  bigMoveThreshold: { type: Number, required: true, default: 0.1 },
  dailyUpdateTime: { type: String, required: true, default: '09:00' },
  topContractsToDisplay: { type: Number, required: true, default: 5 },
  smsRateLimit: { type: Number, required: true, default: 100 },
  websocketConnectionLimit: { type: Number, required: true, default: 1000 },
  dataRefreshFrequency: {
    predictIt: { type: Number, required: true, default: 300 },
    kalshi: { type: Number, required: true, default: 300 },
    polymarket: { type: Number, required: true, default: 300 },
    manifoldMarkets: { type: Number, required: true, default: 300 },
  },
});

export default mongoose.model<ISettings>('Settings', SettingsSchema);