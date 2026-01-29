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
const leadRoutes = require('../lead.routes');
const businessSettingsRoutes = require('../business.routes');

// Mount Routes
router.use('/documents', documentRoutes);
router.use('/chat', chatRoutes);
router.use('/leads', leadRoutes);
router.use('/settings', businessSettingsRoutes);

module.exports = router;
