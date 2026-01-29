const express = require('express');
const router = express.Router();
const leadController = require('../controllers/lead.controller');
const { authenticate, restrictTo } = require('../middleware/auth.middleware');

// Public route for capturing from chat (no auth required for the user)
router.post('/capture', leadController.captureLead);

// Protected routes (Tenant context provided by namespace/middleware)
router.get('/', authenticate, leadController.getLeads);
router.patch('/:id', authenticate, restrictTo('business_owner', 'business_admin'), leadController.updateLead);
router.get('/export/csv', authenticate, restrictTo('business_owner', 'business_admin'), leadController.exportLeadsCsv);

module.exports = router;
