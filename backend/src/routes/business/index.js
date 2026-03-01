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
const ticketRoutes = require('../ticket.routes');
const subscriptionRoutes = require('../subscription.routes');
const teamRoutes = require('../team.routes');

// Mount Routes
router.use('/documents', documentRoutes);
router.use('/chat', chatRoutes);
router.use('/leads', leadRoutes);
router.use('/settings', businessSettingsRoutes);
router.use('/tickets', ticketRoutes);
router.use('/subscription', subscriptionRoutes);
router.use('/team', teamRoutes);

// Dashboard & Analytics
const businessController = require('../../controllers/business.controller');
const { authenticate } = require('../../middleware/auth.middleware');
const { checkPermission } = require('../../middleware/permission.middleware');

router.get('/dashboard/stats', authenticate, checkPermission('analytics.view'), businessController.getDashboardStats);
router.get('/analytics/overview', authenticate, checkPermission('analytics.view'), businessController.getAnalyticsOverview);

module.exports = router;
