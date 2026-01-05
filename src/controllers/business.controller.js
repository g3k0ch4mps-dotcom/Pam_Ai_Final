const Business = require('../models/Business');
const logger = require('../utils/logger');

/**
 * Get private business profile
 * @route GET /api/business/:id/profile
 * @access Protected (Member only)
 */
const getBusinessProfile = async (req, res) => {
    try {
        const business = await Business.findById(req.params.id);

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
            req.params.id,
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

module.exports = {
    getBusinessProfile,
    updateBusinessSettings,
    getPublicBusinessInfo
};
