const Conversation = require('../models/Conversation');
const User = require('../models/User');
const logger = require('../utils/logger');

/**
 * Create a new ticket
 * @route POST /api/business/v1/tickets
 */
const createTicket = async (req, res) => {
    try {
        const { title, customerName, customerEmail, customerPhone, priority, tags, dueDate, conversationId } = req.body;
        const businessId = req.businessId;

        // Auto-generate ticket number
        const ticketCount = await Conversation.countDocuments({ businessId, isTicket: true });
        const ticketNumber = `TICKET-${(ticketCount + 1).toString().padStart(6, '0')}`;

        let conversation;

        if (conversationId) {
            // Upgrade existing conversation to ticket
            conversation = await Conversation.findOne({ _id: conversationId, businessId });
            if (!conversation) {
                return res.status(404).json({ success: false, error: 'Conversation not found' });
            }
            conversation.isTicket = true;
            conversation.ticketNumber = ticketNumber;
            conversation.status = 'open';
            conversation.priority = priority || 'medium';
            conversation.tags = tags || [];
            conversation.dueDate = dueDate;
            conversation.customerName = customerName;
            conversation.customerEmail = customerEmail;
            conversation.customerPhone = customerPhone;
            await conversation.save();
        } else {
            // Create new ticket conversation
            conversation = new Conversation({
                businessId,
                title: title || `Ticket: ${customerName || 'New Request'}`,
                createdBy: req.user.id,
                isTicket: true,
                ticketNumber,
                status: 'open',
                priority: priority || 'medium',
                tags: tags || [],
                dueDate,
                customerName,
                customerEmail,
                customerPhone,
                participants: [{
                    userId: req.user.id,
                    role: 'owner'
                }]
            });
            await conversation.save();
        }

        res.status(201).json({ success: true, data: conversation });
    } catch (error) {
        logger.error(`Ticket creation error: ${error.message}`);
        res.status(500).json({ success: false, error: 'Failed to create ticket' });
    }
};

/**
 * List tickets with filters
 * @route GET /api/business/v1/tickets
 */
const getTickets = async (req, res) => {
    try {
        const { status, priority, assignedTo } = req.query;
        const query = { businessId: req.businessId, isTicket: true };

        if (status) query.status = status;
        if (priority) query.priority = priority;
        if (assignedTo) query.assignedTo = assignedTo;

        const tickets = await Conversation.find(query).sort({ updatedAt: -1 });
        res.json({ success: true, data: tickets });
    } catch (error) {
        logger.error(`Get tickets error: ${error.message}`);
        res.status(500).json({ success: false, error: 'Failed to fetch tickets' });
    }
};

/**
 * Assign ticket
 * @route PATCH /api/business/v1/tickets/:id/assign
 */
const assignTicket = async (req, res) => {
    try {
        const { userId } = req.body;
        const ticket = await Conversation.findOneAndUpdate(
            { _id: req.params.id, businessId: req.businessId, isTicket: true },
            { assignedTo: userId },
            { new: true }
        );

        if (!ticket) {
            return res.status(404).json({ success: false, error: 'Ticket not found' });
        }

        res.json({ success: true, data: ticket });
    } catch (error) {
        logger.error(`Assign ticket error: ${error.message}`);
        res.status(500).json({ success: false, error: 'Failed to assign ticket' });
    }
};

/**
 * Update ticket status
 * @route PATCH /api/business/v1/tickets/:id/status
 */
const updateTicketStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const update = { status };

        if (status === 'resolved' || status === 'closed') {
            update.resolvedAt = new Date();
        }

        const ticket = await Conversation.findOneAndUpdate(
            { _id: req.params.id, businessId: req.businessId, isTicket: true },
            update,
            { new: true }
        );

        if (!ticket) {
            return res.status(404).json({ success: false, error: 'Ticket not found' });
        }

        res.json({ success: true, data: ticket });
    } catch (error) {
        logger.error(`Update status error: ${error.message}`);
        res.status(500).json({ success: false, error: 'Failed to update status' });
    }
};

/**
 * Ticket statistics
 * @route GET /api/business/v1/tickets/stats
 */
const getTicketStats = async (req, res) => {
    try {
        const stats = await Conversation.aggregate([
            { $match: { businessId: req.businessId, isTicket: true } },
            {
                $group: {
                    _id: '$status',
                    count: { $sum: 1 }
                }
            }
        ]);

        const formattedStats = {
            open: 0,
            pending: 0,
            in_progress: 0,
            resolved: 0,
            closed: 0,
            total: 0
        };

        stats.forEach(s => {
            formattedStats[s._id] = s.count;
            formattedStats.total += s.count;
        });

        res.json({ success: true, data: formattedStats });
    } catch (error) {
        logger.error(`Ticket stats error: ${error.message}`);
        res.status(500).json({ success: false, error: 'Failed to fetch ticket stats' });
    }
};

module.exports = {
    createTicket,
    getTickets,
    assignTicket,
    updateTicketStatus,
    getTicketStats
};
