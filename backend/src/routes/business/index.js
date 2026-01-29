/**
 * Business API Namespace
 * 
 * Entry point for all business-scoped routes.
 * Base path: /api/business
 */

const express = require('express');
const router = express.Router();

// Import Feature Routes
const documentRoutes = require('../document.routes');
const chatRoutes = require('../chat.routes');
const businessSettingsRoutes = require('../business.routes'); // Rename/Use existing business routes for settings

// Mount Routes
// Note: These routers already apply their own auth/tenant middleware
router.use('/documents', documentRoutes);
router.use('/chat', chatRoutes);
router.use('/settings', businessSettingsRoutes);

module.exports = router;
