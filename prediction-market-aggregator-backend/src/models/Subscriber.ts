import mongoose, { Document, Schema } from 'mongoose';

export interface ISubscriber extends Document {
  phoneNumber: string;
  status: 'pending' | 'subscribed' | 'paused' | 'stopped';
  categories: string[];
  alertTypes: ('daily' | 'bigMove')[];
  confirmationCode?: string;
  lastAlertSent?: Date;
}

const SubscriberSchema: Schema = new Schema({
  phoneNumber: { type: String, required: true, unique: true },
  status: { type: String, enum: ['pending', 'subscribed', 'paused', 'stopped'], default: 'pending' },
  categories: [{ type: String }],
  alertTypes: [{ type: String, enum: ['daily', 'bigMove'] }],
  lastAlertSent: { type: Date },
  confirmationCode: { type: String }
});

export default mongoose.model<ISubscriber>('Subscriber', SubscriberSchema);