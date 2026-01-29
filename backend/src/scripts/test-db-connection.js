require('dotenv').config({ path: __dirname + '/../../.env' });
const mongoose = require('mongoose');

const MONGODB_URI = process.env.MONGODB_URI;

console.log('Testing connection to:', MONGODB_URI ? 'URI found' : 'URI MISSING');

async function testConnection() {
    try {
        console.log('Connecting...');
        await mongoose.connect(MONGODB_URI, { serverSelectionTimeoutMS: 5000 });
        console.log('Connected successfully!');
        await mongoose.disconnect();
        console.log('Disconnected.');
    } catch (error) {
        console.error('Connection failed:', error.message);
        // console.error(error);
    }
}

testConnection();
