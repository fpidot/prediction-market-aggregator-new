import mongoose, { Document, Schema } from 'mongoose';

export interface ISubscriber extends Document {
  phoneNumber: string;
  status: 'subscribed' | 'unsubscribed';
  categories: string[];
  alertTypes: string[];
  lastAlertSent?: Date;
  isActive: boolean;
  confirmationCode?: string;
  isConfirmed: boolean;
}

const SubscriberSchema: Schema = new Schema({
  phoneNumber: { type: String, required: true, unique: true },
  status: { type: String, enum: ['subscribed', 'unsubscribed'], default: 'subscribed' },
  categories: [{ type: String }],
  alertTypes: [{ type: String }],
  lastAlertSent: { type: Date },
  isActive: { type: Boolean, default: true },
  confirmationCode: { type: String },
  isConfirmed: { type: Boolean, default: false }
});

export const Subscriber = mongoose.model<ISubscriber>('Subscriber', SubscriberSchema);