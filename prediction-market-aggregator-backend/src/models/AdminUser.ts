import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcrypt';

export interface IAdminUser extends Document {
  username: string;
  password: string;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const AdminUserSchema: Schema = new Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});

AdminUserSchema.pre<IAdminUser>('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

AdminUserSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.model<IAdminUser>('AdminUser', AdminUserSchema);