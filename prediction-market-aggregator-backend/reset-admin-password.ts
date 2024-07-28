// reset-admin-password.ts
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import { AdminUser } from './src/models/AdminUser';
import dotenv from 'dotenv';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/your_database_name';

async function resetAdminPassword() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    const email = 'admin@amciv.com';
    const newPassword = 'new_admin_password';

    console.log('Searching for admin user...');
    let admin = await AdminUser.findOne({ email });

    if (!admin) {
      console.log('Admin user not found');
      return;
    }
    console.log('Admin user found:', admin.email);

    console.log('Updating admin password...');
    admin.password = newPassword; // The model will hash this
    await admin.save();
    console.log('Save operation completed');

    // Verify the password was updated
    console.log('Verifying password update...');
    admin = await AdminUser.findOne({ email });
    if (admin) {
      console.log('Admin user retrieved after update');
      console.log('Stored hashed password:', admin.password);

      // Test the new password
      console.log('Testing new password...');
      const isMatch = await admin.comparePassword(newPassword);
      console.log('Password match test:', isMatch ? 'Successful' : 'Failed');

      if (!isMatch) {
        console.log('Original password:', newPassword);
        console.log('Stored hashed password:', admin.password);
      }
    } else {
      console.log('Failed to retrieve admin user after update');
    }

  } catch (error) {
    console.error('Error resetting admin password:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

resetAdminPassword();