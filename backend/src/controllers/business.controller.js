const Business = require('../models/Business');
const Conversation = require('../models/Conversation');
const Lead = require('../models/Lead');
const logger = require('../utils/logger');

/**
 * Get private business profile
 * @route GET /api/business/:id/profile
 * @access Protected (Member only)
 */
const getBusinessProfile = async (req, res) => {
    try {
        // Enforce Tenant Isolation: Use req.businessId, ignore params.id
        const business = await Business.findById(req.businessId);

        if (!business) {
            return res.status(404).json({
                success: false,
                error: {
                    code: 'BUSINESS_NOT_FOUND',
                    message: 'Business not found'
                }
            });
        }

        res.json({
            success: true,
            data: business
        });
    } catch (error) {
        logger.error(`Get profile error: ${error.message}`);
        res.status(500).json({
            success: false,
            error: {
                code: 'SERVER_ERROR',
                message: 'Failed to retrieving business profile'
            }
        });
    }
};

/**
 * Update business settings
 * @route PUT /api/business/:id/settings
 * @access Protected (Owner only)
 */
const updateBusinessSettings = async (req, res) => {
    try {
        const { chatSettings, branding, industry } = req.body;

        // Whitelist updates to prevent overwriting critical fields like subscriptionStatus manually
        const updates = {};
        if (chatSettings) updates.chatSettings = chatSettings;
        if (branding) updates.branding = branding;
        if (industry) updates.industry = industry;

        const business = await Business.findByIdAndUpdate(
            req.businessId, // Enforce tenant scope
            { $set: updates },
            { new: true, runValidators: true }
        );

        if (!business) {
            return res.status(404).json({
                success: false,
                error: {
                    code: 'BUSINESS_NOT_FOUND',
                    message: 'Business not found'
                }
            });
        }

        res.json({
            success: true,
            data: business
        });
    } catch (error) {
        logger.error(`Update settings error: ${error.message}`);
        res.status(500).json({
            success: false,
            error: {
                code: 'UPDATE_FAILED',
                message: 'Failed to update settings'
            }
        });
    }
};

/**
 * Get public business info for chat widget
 * @route GET /api/business/public/:slug
 * @access Public
 */
const getPublicBusinessInfo = async (req, res) => {
    try {
        const { slug } = req.params;

        const business = await Business.findOne({ businessSlug: slug, isActive: true })
            .select('businessName businessSlug industry chatSettings branding');

        if (!business) {
            return res.status(404).json({
                success: false,
                error: {
                    code: 'BUSINESS_NOT_FOUND',
                    message: 'Business not found or inactive'
                }
            });
        }

        // Check if public chat is enabled
        if (!business.chatSettings.isPublic) {
            return res.status(403).json({
                success: false,
                error: {
                    code: 'CHAT_DISABLED',
                    message: 'Public chat is disabled for this business'
                }
            });
        }

        res.json({
            success: true,
            data: business
        });
    } catch (error) {
        logger.error(`Get public info error: ${error.message}`);
        res.status(500).json({
            success: false,
            error: {
                code: 'SERVER_ERROR',
                message: 'Failed to retrieve public business info'
            }
        });
    }
};

/**
 * Get dashboard statistics
 * @route GET /api/business/v1/dashboard/stats
 */
const getDashboardStats = async (req, res) => {
    try {
        const businessId = req.businessId;

        const [
            conversationCount,
            leadCount,
            ticketStats,
            onlineVisitors // This will be handled by the visitor model later
        ] = await Promise.all([
            Conversation.countDocuments({ businessId, isTicket: false }),
            Lead.countDocuments({ businessId }),
            Conversation.aggregate([
                { $match: { businessId, isTicket: true } },
                { $group: { _id: '$status', count: { $sum: 1 } } }
            ]),
            // Visitor model not yet implemented in Phase 2, but we can placeholder or skip for now
            Promise.resolve(0)
        ]);

        const tickets = {
            open: 0,
            pending: 0,
            in_progress: 0,
            resolved: 0,
            closed: 0,
            total: 0
        };

        ticketStats.forEach(s => {
            tickets[s._id] = s.count;
            tickets.total += s.count;
        });

        res.json({
            success: true,
            data: {
                conversations: conversationCount,
                leads: leadCount,
                tickets,
                onlineVisitors
            }
        });
    } catch (error) {
        logger.error(`Dashboard stats error: ${error.message}`);
        res.status(500).json({ success: false, error: 'Failed to fetch dashboard stats' });
    }
};

/**
 * Get analytics overview
 * @route GET /api/business/v1/analytics/overview
 */
const getAnalyticsOverview = async (req, res) => {
    try {
        const businessId = req.businessId;

        // Basic analytics for now: last 7 days of conversations and leads
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        const conversationTrend = await Conversation.aggregate([
            { $match: { businessId, createdAt: { $gte: sevenDaysAgo } } },
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                    count: { $sum: 1 }
                }
            },
            { $sort: { _id: 1 } }
        ]);

        const leadTrend = await Lead.aggregate([
            { $match: { businessId, createdAt: { $gte: sevenDaysAgo } } },
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                    count: { $sum: 1 }
                }
            },
            { $sort: { _id: 1 } }
        ]);

        res.json({
            success: true,
            data: {
                conversationTrend,
                leadTrend
            }
        });
    } catch (error) {
        logger.error(`Analytics overview error: ${error.message}`);
        res.status(500).json({ success: false, error: 'Failed to fetch analytics' });
    }
};

module.exports = {
    getBusinessProfile,
    updateBusinessSettings,
    getPublicBusinessInfo,
    getDashboardStats,
    getAnalyticsOverview
};
