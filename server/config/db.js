// backend/config/db.js
const mongoose = require('mongoose');
require('dotenv').config(); // Load environment variables

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      // Optional: Add other options if needed, e.g., serverSelectionTimeoutMS
    });
    console.log('MongoDB Connected...');
  } catch (err) {
    console.error(`MongoDB Connection Error: ${err.message}`);
    // Exit process with failure
    process.exit(1);
  }
};

module.exports = connectDB;