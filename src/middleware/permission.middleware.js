const BusinessMember = require('../models/BusinessMember');
const logger = require('../utils/logger');

/**
 * Middleware to check if the authenticated user is a member of the accessed business
 * Requires 'auth.middleware' to run first to populate req.user
 */
const checkBusinessAccess = async (req, res, next) => {
    try {
        // Priority: Path Param > Body > Token (Implicit)
        const businessId = req.params.id || req.body.businessId || req.businessId;

        if (!businessId) {
            return res.status(400).json({
                success: false,
                error: {
                    code: 'MISSING_BUSINESS_ID',
                    message: 'Business ID is required'
                }
            });
        }

        // Check if the user is a member of this business
        // We can use the cached membership from the token if strict real-time revocation isn't critical,
        // but for settings updates, it's safer to query the DB.

        // Efficiency: If the token already has the businessId and matches, and we validated the token...
        // usage: req.businessId comes from authenticate middleware decoding the token

        // Case A: The route parameter matches the business ID in the user's token
        if (req.businessId && req.businessId === businessId) {
            // User is authenticated for this business context
            return next();
        }

        // Case B: User might be in multiple businesses (future proofing), or token doesn't have it.
        // Check DB explicitly.
        const membership = await BusinessMember.findOne({
            userId: req.user._id,
            businessId: businessId
        });

        if (!membership) {
            return res.status(403).json({
                success: false,
                error: {
                    code: 'ACCESS_DENIED',
                    message: 'You do not have access to this business.'
                }
            });
        }

        // Update request context
        req.businessId = businessId;
        req.userRole = membership.role;

        next();
    } catch (error) {
        logger.error(`Access check failed: ${error.message}`);
        res.status(500).json({
            success: false,
            error: {
                code: 'ACCESS_CHECK_ERROR',
                message: 'Failed to verify access permissions'
            }
        });
    }
};

/**
 * Middleware to enforce role-based access
 * Must run AFTER checkBusinessAccess (or authenticate if businessId is in token)
 * @param {...string} allowedRoles - Array of allowed roles (e.g. 'owner', 'admin')
 */
const requireRole = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req.userRole) {
            return res.status(403).json({
                success: false,
                error: {
                    code: 'ROLE_MISSING',
                    message: 'User role could not be determined'
                }
            });
        }

        if (!allowedRoles.includes(req.userRole)) {
            return res.status(403).json({
                success: false,
                error: {
                    code: 'INSUFFICIENT_PERMISSIONS',
                    message: `This action requires one of the following roles: ${allowedRoles.join(', ')}`
                }
            });
        }

        next();
    };
};

module.exports = {
    checkBusinessAccess,
    requireRole
};
