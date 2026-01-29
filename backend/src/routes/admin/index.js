/**
 * Admin API Namespace
 * 
 * Entry point for all system admin routes.
 * Base path: /api/admin
 */

const express = require('express');
const router = express.Router();
const { authenticate } = require('../../middleware/auth.middleware');
const { requireSystemRole } = require('../../middleware/permission.middleware');

// Global Admin Middleware
router.use(authenticate);
// Require Super Admin or Support Admin (read-only handled inside specific routes if needed, 
// but for now let's say entry requires at least support_admin, though requireSystemRole checks specific role)
// For broader access, we might check `isSystemUser` or use specific role checks per sub-route.
// Let's enforce super_admin for the base to be safe, or make it open to system users.
router.use(requireSystemRole('super_admin'));

// Admin Dashboard
router.get('/dashboard', (req, res) => {
    res.json({
        success: true,
        message: 'Welcome to System Admin Dashboard',
        user: req.user.email
    });
});

// Tenant Management (Placeholder)
router.get('/tenants', (req, res) => {
    // List all businesses
    res.json({ success: true, message: 'Tenant list' });
});

module.exports = router;
