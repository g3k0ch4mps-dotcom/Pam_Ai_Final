const express = require('express');
const router = express.Router();
const leadController = require('../controllers/lead.controller');
const { authenticate } = require('../middleware/auth.middleware');
const { requireRole } = require('../middleware/permission.middleware');

// Public route for capturing from chat (no auth required for the user)
router.post('/capture', leadController.captureLead);

// Protected routes (Tenant context provided by namespace/middleware)
router.get('/', authenticate, leadController.getLeads);
router.patch('/:id', authenticate, requireRole(['business_owner', 'business_admin']), leadController.updateLead);
router.get('/export/csv', authenticate, requireRole(['business_owner', 'business_admin']), leadController.exportLeadsCsv);

module.exports = router;
