require('dotenv').config();
const mongoose = require('mongoose');

async function testConnection() {
  console.log('Testing MongoDB connection...');
  console.log('MongoDB URI:', process.env.MONGODB_URI);
  
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB connection successful!');
    console.log('Database:', mongoose.connection.name);
    console.log('Host:', mongoose.connection.host);
    console.log('Port:', mongoose.connection.port);
    
    await mongoose.connection.close();
    console.log('\nTest passed! MongoDB is working correctly.');
    process.exit(0);
  } catch (error) {
    console.error(' MongoDB connection failed!');
    console.error('Error:', error.message);
    console.error('\nPossible solutions:');
    console.error('1. Make sure MongoDB is running: sudo systemctl start mongod');
    console.error('2. Check MONGODB_URI in .env file');
    console.error('3. Try: mongodb://127.0.0.1:27017/inventory_management');
    process.exit(1);
  }
}

testConnection();