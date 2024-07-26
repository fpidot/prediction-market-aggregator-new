import mongoose, { Document, Model } from 'mongoose';
import bcrypt from 'bcrypt';

export interface IAdminUser extends Document {
  email: string;
  password: string;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const AdminUserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

AdminUserSchema.pre('save', async function(next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

AdminUserSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

export const AdminUser: Model<IAdminUser> = mongoose.model<IAdminUser>('AdminUser', AdminUserSchema);