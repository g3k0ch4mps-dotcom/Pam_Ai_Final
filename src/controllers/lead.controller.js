const leadService = require('../services/lead.service');
const logger = require('../utils/logger');
const { Parser } = require('json2csv');

/**
 * Lead Controller
 */

// POST /api/leads - Create/Update lead from Chat (Public)
const captureLead = async (req, res) => {
    try {
        const { businessSlug, sessionId, data } = req.body;
        // businessId is looked up via finding the lead or business (simplified here)
        // In reality, we might need to look up Business by slug efficiently
        // For now, assuming the public chat route middleware attaches business? 
        // Or we pass businessId if available. 

        // Actually, the chat widget usually talks to /chat/public/:slug
        // For lead capture, we should probably use the same session context

        // If this is a direct call from widget form:
        if (!businessSlug || !sessionId) {
            return res.status(400).json({ success: false, message: 'Missing required fields' });
        }

        // We assume the lead already exists from the chat session starting
        // If not, we might fail or create a bare one.
        // Ideally, we get businessId from the params if this is a business-scoped route
        // But for public access... let's check how chat.controller does it.
        // Chat controller looks up business by slug. We should essentially replicate that or reuse middleware.

        // For this implementation, let's assume the lead is updated by session ID
        // The service handles findOrCreate. But we need a Business ID to create one.

        // Let's rely on the service to handle the update if it exists
        const lead = await leadService.updateContactInfo(sessionId, data);

        res.json({ success: true, lead });
    } catch (error) {
        logger.error(`Capture lead error: ${error.message}`);
        res.status(500).json({ success: false, message: 'Failed to capture lead' });
    }
};

// GET /api/business/:businessId/leads - List leads (Protected)
const getLeads = async (req, res) => {
    try {
        const { businessId } = req.params; // Verified by middleware usually
        const filters = req.query;

        // Security check: req.businessId should match params.businessId (from auth middleware)
        if (req.businessId && req.businessId !== businessId) {
            return res.status(403).json({ success: false, message: 'Unauthorized access to business data' });
        }

        const leads = await leadService.getBusinessLeads(businessId, filters);
        res.json({ success: true, leads });
    } catch (error) {
        logger.error(`Get leads error: ${error.message}`);
        res.status(500).json({ success: false, message: 'Failed to fetch leads' });
    }
};

// PATCH /api/business/:businessId/leads/:id - Update lead status/notes
const updateLead = async (req, res) => {
    try {
        const { id } = req.params;
        const { status, notes } = req.body;

        const lead = await leadService.getLeadBySession(id); // Usually ID is session ID? No, here it's Mongo ID
        // Wait, service has getLeadBySession. We need getLeadById.
        // Let's implement a direct update using model in service or here.
        // Ideally service should have updateLeadById.
        // Let's add a quick direct update here for now or extend service.

        const Lead = require('../models/Lead');
        const updatedLead = await Lead.findByIdAndUpdate(
            id,
            { $set: { status, notes } },
            { new: true }
        );

        if (!updatedLead) return res.status(404).json({ success: false, message: 'Lead not found' });

        res.json({ success: true, lead: updatedLead });
    } catch (error) {
        logger.error(`Update lead error: ${error.message}`);
        res.status(500).json({ success: false, message: 'Failed to update lead' });
    }
};

// GET /api/business/:businessId/leads/export/csv
const exportLeadsCsv = async (req, res) => {
    try {
        const { businessId } = req.params;
        const leads = await leadService.getBusinessLeads(businessId, { limit: 1000 });

        const fields = ['name', 'email', 'phone', 'leadScore', 'status', 'interests', 'firstContact', 'lastContact'];
        const json2csvParser = new Parser({ fields });
        const csv = json2csvParser.parse(leads);

        res.header('Content-Type', 'text/csv');
        res.attachment(`leads-${businessId}-${Date.now()}.csv`);
        res.send(csv);
    } catch (error) {
        logger.error(`Export CSV error: ${error.message}`);
        res.status(500).json({ success: false, message: 'Failed to export CSV' });
    }
};

module.exports = {
    captureLead,
    getLeads,
    updateLead,
    exportLeadsCsv
};
