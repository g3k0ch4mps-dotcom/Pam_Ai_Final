
require('dotenv').config();
const mongoose = require('mongoose');

const uri = process.env.MONGODB_URI;
console.log('Testing connection to:', uri);

const connectionOptions = {
    serverSelectionTimeoutMS: 30000,
};

mongoose.connect(uri, connectionOptions)
    .then(() => {
        console.log('Successfully connected to MongoDB with minimal options!');
        process.exit(0);
    })
    .catch(err => {
        console.error('Connection failed with minimal options:', err);
        process.exit(1);
    });
