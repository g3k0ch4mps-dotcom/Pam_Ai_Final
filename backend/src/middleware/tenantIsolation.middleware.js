/**
 * Tenant Isolation Middleware
 * 
 * CRITICAL: Enforces that users can only access their own business data
 * 
 * This middleware MUST be applied to ALL business-level routes
 */

const User = require('../models/User');
const Business = require('../models/Business');

/**
 * Enforce tenant isolation
 * 
 * Ensures:
 * 1. User belongs to a business
 * 2. User can only access their business data
 * 3. Super Admins can bypass (when explicitly allowed)
 */
async function enforceTenantIsolation(req, res, next) {
    try {
        // User must be authenticated first (req.user populated)
        if (!req.user || !req.user.id) {
            return res.status(401).json({
                success: false,
                error: 'User not authenticated',
                code: 'AUTH_REQUIRED',
            });
        }

        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(401).json({
                success: false,
                error: 'User not found',
                code: 'USER_NOT_FOUND',
            });
        }

        // ==========================================
        // SUPER ADMIN BYPASS (Explicit)
        // ==========================================
        if (user.canBypassTenantIsolation() && req.query.admin_override === 'true') {
            console.log(`[TenantIsolation] Super Admin ${user.email} bypassing isolation`);
            req.bypassTenantIsolation = true;
            req.business = null; // No specific business context unless specified likely
            return next();
        }

        // ==========================================
        // REQUIRE BUSINESS ASSOCIATION
        // ==========================================
        if (!user.businessId) {
            return res.status(403).json({
                success: false,
                error: 'User must belong to a business',
                code: 'NO_BUSINESS_ASSOCIATION',
            });
        }

        // ==========================================
        // LOAD BUSINESS CONTEXT
        // ==========================================
        const business = await Business.findById(user.businessId);

        if (!business) {
            return res.status(404).json({
                success: false,
                error: 'Business not found',
                code: 'BUSINESS_NOT_FOUND',
            });
        }

        if (!business.isActive) {
            return res.status(403).json({
                success: false,
                error: 'Business is inactive',
                code: 'BUSINESS_INACTIVE',
            });
        }

        // ==========================================
        // ATTACH BUSINESS CONTEXT TO REQUEST
        // ==========================================
        req.businessId = business._id;
        req.business = business;
        req.bypassTenantIsolation = false;

        // console.log(`[TenantIsolation] User ${user.email} accessing business ${business.businessName}`);

        next();

    } catch (error) {
        console.error('[TenantIsolation] Error:', error);
        res.status(500).json({
            success: false,
            error: 'Tenant isolation check failed',
            code: 'TENANT_ISOLATION_ERROR',
        });
    }
}

/**
 * Validate business_id in request matches user's business
 * 
 * Use this for routes that accept business_id as parameter
 */
async function validateBusinessId(req, res, next) {
    const requestedBusinessId = req.params.businessId || req.body.businessId;

    if (!requestedBusinessId) {
        return next();
    }

    // Super admin bypass
    if (req.bypassTenantIsolation) {
        return next();
    }

    // Check if requested business matches user's business
    if (req.businessId.toString() !== requestedBusinessId.toString()) {
        console.warn(`[TenantIsolation] User ${req.user.id} attempted to access business ${requestedBusinessId} but belongs to ${req.businessId}`);

        return res.status(403).json({
            success: false,
            error: 'Access denied: Cannot access another business',
            code: 'TENANT_ISOLATION_VIOLATION',
        });
    }

    next();
}

module.exports = {
    enforceTenantIsolation,
    validateBusinessId,
};
