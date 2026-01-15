const express = require('express');
const businessController = require('../controllers/business.controller');
const { authenticate } = require('../middleware/auth.middleware');
const { checkBusinessAccess, requireRole } = require('../middleware/permission.middleware');

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
    checkBusinessAccess,
    businessController.getBusinessProfile
);

// Update Settings (Owner Only)
router.put('/:id/settings',
    checkBusinessAccess,
    requireRole('owner'),
    businessController.updateBusinessSettings
);

module.exports = router;
