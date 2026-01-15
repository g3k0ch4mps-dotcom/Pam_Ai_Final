/**
 * MongoDB Database Connection
 * 
 * Handles connection to MongoDB using Mongoose ODM.
 * Includes retry logic, connection event handlers, and error handling.
 * 
 * Connection States:
 * 0 = disconnected
 * 1 = connected
 * 2 = connecting
 * 3 = disconnecting
 */

const mongoose = require('mongoose');
const logger = require('../utils/logger');

/**
 * MongoDB connection options
 * These options ensure stable connection and proper behavior
 */
const connectionOptions = {
    // Server selection timeout (30 seconds)
    serverSelectionTimeoutMS: 30000,
    // Provide explicit IPv4 support
    family: 4,
};

/**
 * Maximum number of connection retry attempts
 */
const MAX_RETRIES = 3;

/**
 * Current retry attempt counter
 */
let retryCount = 0;

/**
 * Connect to MongoDB with retry logic
 * 
 * @returns {Promise<void>}
 * @throws {Error} If connection fails after max retries
 */
async function connectDatabase() {
    try {
        // Get MongoDB URI from environment variables
        const mongoUri = process.env.MONGODB_URI;

        if (!mongoUri) {
            throw new Error('MONGODB_URI is not defined in environment variables');
        }

        logger.info('Connecting to MongoDB...');

        // Attempt connection
        await mongoose.connect(mongoUri, connectionOptions);

        logger.info('✓ MongoDB connected successfully');

        // Reset retry counter on successful connection
        retryCount = 0;

    } catch (error) {
        logger.error('MongoDB connection error:', error);

        // Increment retry counter
        retryCount++;

        // Check if we should retry
        if (retryCount <= MAX_RETRIES) {
            logger.warn(`Retrying MongoDB connection... (Attempt ${retryCount}/${MAX_RETRIES})`);

            // Wait before retrying (exponential backoff)
            const delay = Math.min(1000 * Math.pow(2, retryCount), 10000);
            await new Promise(resolve => setTimeout(resolve, delay));

            // Retry connection
            return connectDatabase();
        } else {
            logger.error(`Failed to connect to MongoDB after ${MAX_RETRIES} attempts`);
            throw error;
        }
    }
}

/**
 * MongoDB Connection Event Handlers
 * These handlers log connection state changes
 */

// Connection successful
mongoose.connection.on('connected', () => {
    logger.info('MongoDB connection established');
});

// Connection error
mongoose.connection.on('error', (err) => {
    logger.error('MongoDB connection error:', err);
});

// Connection disconnected
mongoose.connection.on('disconnected', () => {
    logger.warn('MongoDB disconnected');
});

// Connection reconnected
mongoose.connection.on('reconnected', () => {
    logger.info('MongoDB reconnected');
});

/**
 * Graceful shutdown handler
 * Closes MongoDB connection when app terminates
 */
process.on('SIGINT', async () => {
    try {
        await mongoose.connection.close();
        logger.info('MongoDB connection closed through app termination');
        process.exit(0);
    } catch (err) {
        logger.error('Error closing MongoDB connection:', err);
        process.exit(1);
    }
});

/**
 * Get current connection state
 * 
 * @returns {string} Connection state
 */
function getConnectionState() {
    const states = {
        0: 'disconnected',
        1: 'connected',
        2: 'connecting',
        3: 'disconnecting',
    };

    return states[mongoose.connection.readyState] || 'unknown';
}

/**
 * Check if database is connected
 * 
 * @returns {boolean} True if connected
 */
function isConnected() {
    return mongoose.connection.readyState === 1;
}

module.exports = {
    connectDatabase,
    getConnectionState,
    isConnected,
    mongoose, // Export mongoose instance for use in models
};
