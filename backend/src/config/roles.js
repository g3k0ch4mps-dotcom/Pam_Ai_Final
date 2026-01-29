/**
 * RBAC Configuration
 * Defines all roles and their permissions
 */

const ROLES = {
    // ==========================================
    // BUSINESS-LEVEL ROLES (Tenant-Scoped)
    // ==========================================

    BUSINESS_OWNER: {
        id: 'business_owner',
        name: 'Business Owner',
        description: 'Full control over their business',
        level: 'business',
        permissions: [
            // Documents
            'documents.create',
            'documents.read',
            'documents.update',
            'documents.delete',
            'documents.share',

            // Conversations
            'conversations.create',
            'conversations.read',
            'conversations.update',
            'conversations.delete',
            'conversations.assign',

            // Team Management
            'team.invite',
            'team.remove',
            'team.update_roles',
            'team.view',

            // Business Settings
            'settings.read',
            'settings.update',
            'settings.billing',

            // Analytics
            'analytics.view',
            'analytics.export',

            // Subscription
            'subscription.view',
            'subscription.update',
            'subscription.cancel',
        ],
    },

    BUSINESS_ADMIN: {
        id: 'business_admin',
        name: 'Business Admin',
        description: 'Manage business operations',
        level: 'business',
        permissions: [
            // Documents
            'documents.create',
            'documents.read',
            'documents.update',
            'documents.delete',
            'documents.share',

            // Conversations
            'conversations.create',
            'conversations.read',
            'conversations.update',
            'conversations.assign',

            // Team Management (limited)
            'team.invite',
            'team.view',

            // Analytics
            'analytics.view',
        ],
    },

    BUSINESS_STAFF: {
        id: 'business_staff',
        name: 'Business Staff',
        description: 'Standard team member',
        level: 'business',
        permissions: [
            // Documents
            'documents.create',
            'documents.read',
            'documents.update',

            // Conversations
            'conversations.create',
            'conversations.read',
            'conversations.update',

            // Team
            'team.view',
        ],
    },

    BUSINESS_VIEWER: {
        id: 'business_viewer',
        name: 'Business Viewer',
        description: 'Read-only access',
        level: 'business',
        permissions: [
            'documents.read',
            'conversations.read',
            'team.view',
        ],
    },

    // ==========================================
    // SYSTEM-LEVEL ROLES (Not Tenant-Scoped)
    // ==========================================

    SUPER_ADMIN: {
        id: 'super_admin',
        name: 'Super Admin',
        description: 'Full system access (internal)',
        level: 'system',
        permissions: [
            // System Management
            'system.view_all_businesses',
            'system.manage_businesses',
            'system.view_analytics',
            'system.manage_subscriptions',
            'system.manage_users',
            'system.access_support_tools',

            // Can access ANY business data
            'bypass_tenant_isolation', // CRITICAL: Only Super Admin has this
        ],
    },

    SUPPORT_ADMIN: {
        id: 'support_admin',
        name: 'Support Admin',
        description: 'Read-only support access (internal)',
        level: 'system',
        permissions: [
            // Read-only system access
            'system.view_all_businesses',
            'system.view_analytics',
            'system.view_users',
            'system.access_support_tools',

            // Can READ any business data (but not modify)
            'bypass_tenant_isolation_read_only',
        ],
    },
};

/**
 * Check if a role has a permission
 */
function roleHasPermission(roleId, permission) {
    if (!roleId) return false;
    const role = ROLES[roleId.toUpperCase()];
    if (!role) return false;

    return role.permissions.includes(permission);
}

/**
 * Get all permissions for a role
 */
function getRolePermissions(roleId) {
    if (!roleId) return [];
    const role = ROLES[roleId.toUpperCase()];
    return role ? role.permissions : [];
}

/**
 * Check if role is system-level
 */
function isSystemRole(roleId) {
    if (!roleId) return false;
    const role = ROLES[roleId.toUpperCase()];
    return role && role.level === 'system';
}

/**
 * Check if role can bypass tenant isolation
 */
function canBypassTenantIsolation(roleId) {
    const permissions = getRolePermissions(roleId);
    return permissions.includes('bypass_tenant_isolation') ||
        permissions.includes('bypass_tenant_isolation_read_only');
}

module.exports = {
    ROLES,
    roleHasPermission,
    getRolePermissions,
    isSystemRole,
    canBypassTenantIsolation,
};
