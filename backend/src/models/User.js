const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        lowercase: true,
        trim: true,
        match: [/^\S+@\S+\.\S+$/, 'Please use a valid email address']
    },
    passwordHash: {
        type: String,
        required: true,
        select: false // Do not return password by default
    },
    firstName: {
        type: String,
        required: [true, 'First name is required'],
        trim: true
    },
    lastName: {
        type: String,
        required: [true, 'Last name is required'],
        trim: true
    },
    isEmailVerified: {
        type: Boolean,
        default: false
    },
    lastLogin: {
        type: Date
    },
    // ==========================================
    // TENANT ASSOCIATION
    // ==========================================
    businessId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Business',
        default: null,
        index: true, // IMPORTANT: Index for performance
    },

    // ==========================================
    // ROLE (RBAC)
    // ==========================================
    role: {
        type: String,
        enum: [
            'business_owner',
            'business_admin',
            'business_staff',
            'business_viewer',
            'super_admin',
            'support_admin',
        ],
        default: 'business_owner',
        required: true,
    },

    // ==========================================
    // SYSTEM FLAGS
    // ==========================================
    isSystemUser: {
        type: Boolean,
        default: false,
        // True for super_admin, support_admin
    },

    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

// ==========================================
// INSTANCE METHODS
// ==========================================

const { ROLES, getRolePermissions } = require('../config/roles');

/**
 * Check if user has a specific permission
 */
userSchema.methods.hasPermission = function (permission) {
    const permissions = getRolePermissions(this.role);
    return permissions.includes(permission);
};

/**
 * Get all user permissions
 */
userSchema.methods.getPermissions = function () {
    return getRolePermissions(this.role);
};

/**
 * Check if user is system admin
 */
userSchema.methods.isSystemAdmin = function () {
    return this.role === 'super_admin';
};

/**
 * Check if user is support admin
 */
userSchema.methods.isSupportAdmin = function () {
    return this.role === 'support_admin';
};

/**
 * Check if user can bypass tenant isolation
 */
userSchema.methods.canBypassTenantIsolation = function () {
    return this.hasPermission('bypass_tenant_isolation') ||
        this.hasPermission('bypass_tenant_isolation_read_only');
};

/**
 * Check if user belongs to a business
 */
userSchema.methods.belongsToBusiness = function (businessId) {
    if (!this.businessId) return false;
    return this.businessId.toString() === businessId.toString();
};

module.exports = mongoose.model('User', userSchema);
