const mongoose = require('mongoose');

async function connectDB() {
  try {
    const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/Uno_Arena';

    await mongoose.connect(MONGO_URI);

    console.log(' MongoDB Connected successfully ✅');
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    process.exit(1);
  }
}

module.exports = connectDB;
