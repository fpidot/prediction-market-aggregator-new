import mongoose, { Schema, Document } from 'mongoose';

export interface ISMS extends Document {
  to: string;
  body: string;
  createdAt: Date;
  twilioMessageId: string;
}

const SMSSchema: Schema = new Schema({
  to: { type: String, required: true },
  body: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  twilioMessageId: { type: String, required: true }
});

export default mongoose.model<ISMS>('SMS', SMSSchema);