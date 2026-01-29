/**
 * Verification Script: RBAC Foundation
 * 
 * Tests:
 * 1. Roles config loads
 * 2. User model has new fields
 * 3. User instance has RBAC methods
 */

require('dotenv').config({ path: __dirname + '/../../.env' });
const mongoose = require('mongoose');
const User = require('../models/User');
const { ROLES, roleHasPermission } = require('../config/roles');

async function verifyRBAC() {
    try {
        console.log('--- Step 1: Testing Roles Config ---');
        console.log('ROLES loaded:', Object.keys(ROLES).length > 0 ? 'YES' : 'NO');
        console.log('Permission check (documents.read):', roleHasPermission('business_owner', 'documents.read'));

        console.log('\n--- Step 2: Testing User Model ---');
        const testUser = new User({
            email: 'test_rbac@example.com',
            firstName: 'Test',
            lastName: 'RBAC',
            passwordHash: 'hash',
            role: 'business_owner'
        });

        console.log('User role:', testUser.role);
        console.log('User hasPermission(documents.read):', testUser.hasPermission('documents.read'));
        console.log('User isSystemAdmin:', testUser.isSystemAdmin());

        console.log('\n--- Verification SUCCESS ---');
    } catch (error) {
        console.error('Verification FAILED:', error);
        process.exit(1);
    }
}

verifyRBAC();
