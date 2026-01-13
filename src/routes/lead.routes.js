const express = require('express');
const router = express.Router();
const leadController = require('../controllers/lead.controller');
const { protect, checkBusinessAccess } = require('../middleware/auth.middleware');

// Public route for capturing from chat (no auth required for the user)
// But wait, the controller expects to match a session.
router.post('/capture', leadController.captureLead);

// Protected routes for Business Dashboard
router.get('/business/:businessId', protect, checkBusinessAccess, leadController.getLeads);
router.patch('/business/:businessId/:id', protect, checkBusinessAccess, leadController.updateLead);
router.get('/business/:businessId/export/csv', protect, checkBusinessAccess, leadController.exportLeadsCsv);

module.exports = router;
