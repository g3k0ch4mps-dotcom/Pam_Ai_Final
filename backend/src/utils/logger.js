/**
 * Winston Logger Configuration
 * 
 * Provides centralized logging for the application.
 * Logs are written to both console (development) and files (production).
 * 
 * Log Levels (in order of severity):
 * - error: Error messages (logged to error.log)
 * - warn: Warning messages
 * - info: Informational messages
 * - http: HTTP request logs
 * - debug: Debug messages (development only)
 * 
 * Files:
 * - logs/error.log: Only error messages
 * - logs/combined.log: All log messages
 */

const winston = require('winston');
const path = require('path');
const fs = require('fs');

// Ensure logs directory exists
const logsDir = path.join(__dirname, '../../logs');
if (!fs.existsSync(logsDir)) {
    fs.mkdirSync(logsDir, { recursive: true });
}

/**
 * Custom log format
 * Includes timestamp, log level, and message
 */
const logFormat = winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.errors({ stack: true }),
    winston.format.splat(),
    winston.format.json()
);

/**
 * Console format for development
 * More readable format with colors
 */
const consoleFormat = winston.format.combine(
    winston.format.colorize(),
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.printf(({ timestamp, level, message, ...meta }) => {
        let msg = `${timestamp} [${level}]: ${message}`;
        if (Object.keys(meta).length > 0) {
            msg += ` ${JSON.stringify(meta)}`;
        }
        return msg;
    })
);

/**
 * Create Winston logger instance
 */
const logger = winston.createLogger({
    level: process.env.LOG_LEVEL || 'info',
    format: logFormat,
    transports: [
        /**
         * Error log file
         * Only logs error level messages
         */
        new winston.transports.File({
            filename: path.join(logsDir, 'error.log'),
            level: 'error',
            maxsize: 5242880, // 5MB
            maxFiles: 5,
        }),

        /**
         * Combined log file
         * Logs all messages
         */
        new winston.transports.File({
            filename: path.join(logsDir, 'combined.log'),
            maxsize: 5242880, // 5MB
            maxFiles: 5,
        }),
    ],
});

/**
 * Console logging
 * In development: Use colorized format
 * In production: Use JSON format for log aggregation
 */
if (process.env.NODE_ENV !== 'production') {
    logger.add(
        new winston.transports.Console({
            format: consoleFormat,
        })
    );
} else {
    logger.add(
        new winston.transports.Console({
            format: logFormat,
        })
    );
}

/**
 * Stream for Morgan HTTP logger
 * Allows Morgan to write to Winston
 */
logger.stream = {
    write: (message) => {
        logger.info(message.trim());
    },
};

module.exports = logger;
