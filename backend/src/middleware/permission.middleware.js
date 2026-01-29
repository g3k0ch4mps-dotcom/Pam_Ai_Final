/**
 * Permission Middleware
 * 
 * Checks if user has required permissions to access a route.
 * Assumes 'auth.middleware' has already populated req.user.
 */

const User = require('../models/User');

/**
 * Check if user has a specific permission
 * 
 * Usage:
 *   router.delete('/:id', checkPermission('documents.delete'), controller.delete);
 */
function checkPermission(requiredPermission) {
    return async (req, res, next) => {
        try {
            // User must be authenticated
            if (!req.user) {
                return res.status(401).json({
                    success: false,
                    error: 'User not authenticated',
                    code: 'AUTH_REQUIRED'
                });
            }

            // If we need fresh data (e.g. role changed since login/token issue), fetch user.
            // Using req.user from auth middleware (which usually fetches from DB) is safest.
            const user = req.user;

            if (!user.hasPermission) {
                // Should exist if using the updated User model. 
                // Fallback or error if model not updated properly.
                console.error('[Permission] User model missing hasPermission method');
                return res.status(500).json({ success: false, error: 'Internal Server Error' });
            }

            if (!user.hasPermission(requiredPermission)) {
                return res.status(403).json({
                    success: false,
                    error: 'Insufficient permissions',
                    code: 'PERMISSION_DENIED',
                    required: requiredPermission
                });
            }

            next();
        } catch (error) {
            console.error('[Permission] Error:', error);
            res.status(500).json({
                success: false,
                error: 'Permission check failed',
                code: 'PERMISSION_CHECK_ERROR'
            });
        }
    };
}

/**
 * Check if user has ANY of the provided permissions
 */
function checkAnyPermission(permissions) {
    return async (req, res, next) => {
        try {
            const user = req.user;
            if (!user) {
                return res.status(401).json({ success: false, error: 'User not authenticated' });
            }

            // Check if user has at least one of the permissions
            const hasAccess = permissions.some(perm => user.hasPermission(perm));

            if (!hasAccess) {
                return res.status(403).json({
                    success: false,
                    error: 'Insufficient permissions',
                    code: 'PERMISSION_DENIED',
                    required: permissions
                });
            }

            next();
        } catch (error) {
            console.error('[Permission] Error:', error);
            res.status(500).json({ success: false, error: 'Permission check failed' });
        }
    };
}

/**
 * Require a specific System Role (e.g. Super Admin)
 */
function requireSystemRole(roleId) {
    return async (req, res, next) => {
        try {
            const user = req.user;
            if (!user) return res.status(401).json({ success: false, error: 'User not authenticated' });

            if (user.role !== roleId) {
                return res.status(403).json({
                    success: false,
                    error: `Role ${roleId} required`,
                    code: 'ROLE_REQUIRED'
                });
            }

            next();
        } catch (error) {
            console.error('[Permission] Error:', error);
            res.status(500).json({ success: false, error: 'System role check failed' });
        }
    };
}

module.exports = {
    checkPermission,
    checkAnyPermission,
    requireSystemRole
};
