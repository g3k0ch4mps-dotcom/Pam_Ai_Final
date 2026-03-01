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
const adminController = require('../../controllers/admin.controller');

// Global Admin Middleware
router.use(authenticate);
router.use(requireSystemRole('super_admin'));

// Admin Dashboard
router.get('/dashboard', adminController.getDashboardStats);

// Tenant Management
router.get('/tenants', adminController.listAllBusinesses);

module.exports = router;
