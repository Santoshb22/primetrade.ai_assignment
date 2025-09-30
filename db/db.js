const mongoose = require('mongoose');
const { db_name } = require('../constant');

const connectDB = async (uri) => {
  try {
    const connectionInstance = await mongoose.connect(`${uri}/${db_name}`);
    console.log(`MongoDB connected: ${connectionInstance.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
