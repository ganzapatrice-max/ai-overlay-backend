// Run: npm run seed-admin (after installing deps and setting .env)
require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

async function run() {
  if (!process.env.MONGO_URI) {
    console.error('MONGO_URI required in .env');
    process.exit(1);
  }
  await mongoose.connect(process.env.MONGO_URI);
  const phone = process.env.ADMIN_PHONE || 'admin';
  const password = process.env.ADMIN_PASSWORD || 'admin123';
  const exists = await User.findOne({ phone });
  if (exists) {
    console.log('Admin exists:', exists._id);
    process.exit(0);
  }
  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash(password, salt);
  const admin = await User.create({
    phone,
    passwordHash,
    isAdmin: true,
    paid: true,
    active: true
  });
  console.log('Admin created:', admin._id);
  process.exit(0);
}
run().catch((e) => {
  console.error(e);
  process.exit(1);
});
