const express = require('express');
const router = express.Router();
const leadController = require('../controllers/lead.controller');
const { authenticate } = require('../middleware/auth.middleware');

// Public route for capturing from chat (no auth required for the user)
router.post('/capture', leadController.captureLead);

// Protected routes for Business Dashboard
router.get('/business/:businessId', authenticate, leadController.getLeads);
router.patch('/business/:businessId/:id', authenticate, leadController.updateLead);
router.get('/business/:businessId/export/csv', authenticate, leadController.exportLeadsCsv);

module.exports = router;
