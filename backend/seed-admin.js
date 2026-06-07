import mongoose from 'mongoose';
import User from './src/models/User.js';
import dotenv from 'dotenv';
dotenv.config();

const run = async () => {
  await mongoose.connect(process.env.DATABASE_URL, { dbName: 'agriforge' });
  const email = process.env.ADMIN_EMAIL || 'admin@agriforge.com';

  const existing = await User.findOne({ email });
  if (existing) {
    existing.roles = ['super_admin'];
    await existing.save();
    console.log(`Updated existing user ${email} → super_admin`);
  } else {
    await User.create({
      email,
      passwordHash: process.env.ADMIN_PASSWORD || 'Admin@123',
      fullName: 'Super Admin',
      roles: ['super_admin'],
      authProvider: 'email',
    });
    console.log(`Created admin user: ${email}`);
  }

  await mongoose.disconnect();
  console.log('Done.');
};

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
