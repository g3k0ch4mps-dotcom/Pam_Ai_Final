const express = require('express');
const businessController = require('../controllers/business.controller');
const { authenticate, restrictTo } = require('../middleware/auth.middleware');
const { validateBusinessId } = require('../middleware/tenantIsolation.middleware');

const router = express.Router();

/**
 * Public Routes
 */
router.get('/public/:slug', businessController.getPublicBusinessInfo);

/**
 * Protected Routes
 * All routes below require Authentication
 */
router.use(authenticate);

// Get Business Profile (Any Member)
router.get('/:id/profile',
    validateBusinessId,
    businessController.getBusinessProfile
);

// Update Settings (Owner Only)
router.put('/:id/settings',
    validateBusinessId,
    restrictTo('business_owner'),
    businessController.updateBusinessSettings
);

module.exports = router;
