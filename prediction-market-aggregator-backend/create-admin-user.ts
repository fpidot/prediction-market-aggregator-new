import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import path from 'path';
import { AdminUser } from './src/models/AdminUser';

dotenv.config({ path: path.join(__dirname, '.env') });

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/prediction-market-aggregator';

async function createAdminUser() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Log the actual collection name
    const collectionName = AdminUser.collection.name;
    console.log('AdminUser collection name:', collectionName);

    // Check if the collection exists
    const collections = await mongoose.connection.db.listCollections().toArray();
    const collectionExists = collections.some(col => col.name === collectionName);
    console.log(`Does the ${collectionName} collection exist?`, collectionExists);

    const email = 'admin@example.com';
    const password = 'new_admin_password';

    const existingUser = await AdminUser.findOne({ email });
    if (existingUser) {
      console.log('Admin user already exists:', existingUser);
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const adminUser = new AdminUser({
      email,
      password: hashedPassword,
      role: 'admin'
    });

    const savedUser = await adminUser.save();
    console.log('Admin user created successfully:', savedUser);

    // Verify the user was saved
    const verifiedUser = await AdminUser.findOne({ email });
    if (verifiedUser) {
      console.log('Verified user exists in database:', verifiedUser);
    } else {
      console.log('Warning: User not found in database after save operation');
    }

  } catch (error) {
    console.error('Error creating admin user:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

createAdminUser();