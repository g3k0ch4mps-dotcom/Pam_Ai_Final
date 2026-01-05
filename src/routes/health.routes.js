/**
 * Health Check Routes
 * 
 * Provides endpoints to check the health and status of the API server.
 * This is useful for:
 * - Monitoring systems (e.g., UptimeRobot, Pingdom)
 * - Load balancers (to check if server is healthy)
 * - DevOps teams (to verify deployment success)
 * - Debugging (to see if all services are connected)
 */

const express = require('express');
const router = express.Router();
const { isConnected: isMongoConnected, getConnectionState } = require('../config/database');

/**
 * GET /api/health
 * 
 * Returns the health status of the API and its dependencies.
 * 
 * Response:
 * {
 *   status: "ok" | "degraded" | "error",
 *   timestamp: "2024-01-15T10:30:00.000Z",
 *   uptime: 3600,
 *   services: {
 *     api: "operational",
 *     mongodb: "connected" | "disconnected",
 *   }
 * }
 * 
 * Status Codes:
 * - 200: All systems operational
 * - 503: Service degraded or unavailable
 */
router.get('/', async (req, res) => {
    try {
        const healthStatus = {
            status: 'ok',
            timestamp: new Date().toISOString(),
            uptime: process.uptime(), // Server uptime in seconds
            services: {
                api: 'operational',
                mongodb: 'unknown'
            }
        };

        // Check MongoDB connection
        const mongoConnected = isMongoConnected();
        healthStatus.services.mongodb = mongoConnected ? 'connected' : 'disconnected';

        if (!mongoConnected) {
            healthStatus.status = 'degraded';
            healthStatus.services.mongodb = `disconnected (${getConnectionState()})`;
        }

        // Return appropriate status code
        const statusCode = healthStatus.status === 'ok' ? 200 : 503;
        res.status(statusCode).json(healthStatus);

    } catch (error) {
        // If health check itself fails, return 503 Service Unavailable
        res.status(503).json({
            status: 'error',
            timestamp: new Date().toISOString(),
            error: {
                message: 'Health check failed',
                details: process.env.NODE_ENV === 'production' ? undefined : error.message
            }
        });
    }
});

/**
 * GET /api/health/ping
 * 
 * Simple ping endpoint for quick availability checks.
 * Returns minimal response for fast health checks.
 */
router.get('/ping', (req, res) => {
    res.status(200).json({
        status: 'ok',
        message: 'pong'
    });
});

module.exports = router;
