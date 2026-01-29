/**
 * Business AI Assistant API - Main Server Entry Point
 * 
 * This is the main entry point for the API. It configures the Express application,
 * connects to MongoDB, and starts the server.
 * 
 * Features:
 * - Express 4.x for API routing
 * - MongoDB (Mongoose) for primary data storage
 * - Winston for logging
 * - Health checks and graceful shutdowns
 */

// Load environment variables first
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const { connectDatabase, isConnected: isMongoConnected } = require('./config/database');
const logger = require('./utils/logger');

const app = express();
const PORT = process.env.PORT || 3000;

/**
 * ============================================================================
 * MIDDLEWARE CONFIGURATION
 * ============================================================================
 */

// Security Middleware
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');

app.set('trust proxy', 1);

// 1. Set Security Headers
app.use(helmet());

// 1.5 Serve Static Files (Public Assets like chat widget)
const path = require('path');
app.use(express.static(path.join(__dirname, '../public')));

// 2. Global Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: {
      code: 'TOO_MANY_REQUESTS',
      message: 'Too many requests from this IP, please try again in 15 minutes'
    }
  }
});
app.use('/api', limiter); // Apply to all API routes

// 3. Body parsing middleware
app.use(express.json({ limit: '10kb' })); // Body limit is 10kb
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// 4. Data Sanitization against NoSQL query injection
app.use(mongoSanitize());

// 5. Data Sanitization against XSS
app.use(xss());

/**
 * CORS (Cross-Origin Resource Sharing) Configuration
 * 
 * For development: Allow all origins
 * For production: Restrict to specific domains using ALLOWED_ORIGINS env variable
 */
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);

    // In development, allow all. In production, check list.
    if (process.env.NODE_ENV !== 'production') {
      return callback(null, true);
    }

    const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || [];
    const frontendUrl = process.env.FRONTEND_URL;

    if (frontendUrl && !allowedOrigins.includes(frontendUrl)) {
      allowedOrigins.push(frontendUrl);
    }

    if (allowedOrigins.indexOf(origin) !== -1 || allowedOrigins.includes('*')) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

/**
 * ============================================================================
 * ROUTES
 * ============================================================================
 */

// Import routes
const healthRoutes = require('./routes/health.routes');
const authRoutes = require('./routes/auth.routes');
const businessRoutes = require('./routes/business.routes');
const documentRoutes = require('./routes/document.routes');
const chatRoutes = require('./routes/chat.routes');

// New Namespaces
const businessNamespace = require('./routes/business/index');
const adminNamespace = require('./routes/admin/index');

// Mount routes
app.use('/api/health', healthRoutes);
app.use('/api/auth', authRoutes);

// New Structured Namespaces
app.use('/api/business/v1', businessNamespace); // e.g., /api/business/v1/documents
app.use('/api/admin/v1', adminNamespace);

// Legacy/Compatibility Routes (Mapped to same controllers via existing routers)
// These keys will eventually be deprecated in favor of /api/business/v1/...
app.use('/api/business', businessRoutes);
app.use('/api/documents', documentRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/leads', require('./routes/lead.routes'));

/**
 * Root endpoint - API information
 */
app.get('/', (req, res) => {
  res.json({
    name: 'Business AI Assistant API',
    version: '1.0.0',
    status: 'running',
    documentation: '/api/health',
    endpoints: {
      health: 'GET /api/health',
      // More endpoints will be added in later stages
    }
  });
});

/**
 * 404 Handler - Route not found
 */
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: {
      code: 'ROUTE_NOT_FOUND',
      message: `Cannot ${req.method} ${req.path}`
    }
  });
});

/**
 * Global Error Handler
 * Catches all errors thrown in the application
 */
app.use((err, req, res, next) => {
  logger.error('Error:', err);

  res.status(err.statusCode || 500).json({
    success: false,
    error: {
      code: err.code || 'INTERNAL_SERVER_ERROR',
      message: process.env.NODE_ENV === 'production'
        ? 'An error occurred'
        : err.message
    }
  });
});

/**
 * ============================================================================
 * SERVER STARTUP
 * ============================================================================
 */

/**
 * Start the Express server
 * 
 * Initialization sequence:
 * 1. Connect to MongoDB
    // Step 2: (Empty slot for future services)
 * 3. Start Express server
 */
async function startServer() {
  try {
    // Step 1: Connect to MongoDB
    logger.info('Starting server initialization...');
    await connectDatabase();


    // Step 3: Start listening for requests
    app.listen(PORT, () => {
      logger.info('═══════════════════════════════════════════════════════');
      logger.info('  Business AI Assistant API');
      logger.info('═══════════════════════════════════════════════════════');
      logger.info(`  ✓ Server running on port ${PORT}`);
      logger.info(`  ✓ Environment: ${process.env.NODE_ENV || 'development'}`);
      logger.info(`  ✓ MongoDB: Connected`);
      logger.info(`  ✓ Search: MongoDB Text Index (No ChromaDB)`);
      logger.info(`  ✓ Health check: http://localhost:${PORT}/api/health`);
      logger.info('═══════════════════════════════════════════════════════');
    });

  } catch (error) {
    logger.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

/**
 * ============================================================================
 * PROCESS HANDLERS
 * ============================================================================
 */

/**
 * Handle unhandled promise rejections
 * This prevents the app from crashing on async errors
 */
process.on('unhandledRejection', (err) => {
  logger.error('❌ Unhandled Promise Rejection:', err);
  // In production, you might want to exit the process
  // process.exit(1);
});

/**
 * Handle uncaught exceptions
 */
process.on('uncaughtException', (err) => {
  logger.error('❌ Uncaught Exception:', err);
  process.exit(1);
});

/**
 * Graceful shutdown on SIGTERM (e.g., from Docker, Kubernetes)
 */
process.on('SIGTERM', async () => {
  logger.info('📡 SIGTERM received. Shutting down gracefully...');
  // Database connections are closed in their respective modules
  process.exit(0);
});

/**
 * Graceful shutdown on SIGINT (Ctrl+C)
 */
process.on('SIGINT', async () => {
  logger.info('\n📡 SIGINT received. Shutting down gracefully...');
  // Database connections are closed in their respective modules
  process.exit(0);
});

// Start the server
startServer();
