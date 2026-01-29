# Implementation Plan - Multi-tenant RBAC Architecture

This plan outlines the steps to upgrade the Business AI Assistant to a secure, multi-tenant architecture with Role-Based Access Control (RBAC).

## Goal Description
Implement an enterprise-grade multi-tenant architecture where Users belong to Businesses, with strict data isolation and permission-based access control.

## User Review Required
> [!IMPORTANT]
> **Data Migration**: Existing users will be migrated to have a default `business_owner` role.
> **Breaking Changes**: The `User` model will be modified to include `role` and `businessId`.
> **Legacy Logic**: The existing `BusinessMember` model may be deprecated or refactored to align with the new Single-Primary-Business architecture.

## Proposed Changes

### Phase 1: RBAC Foundation
- **Goals**: Set up roles and update User model.
- **Files**:
  - [NEW] `backend/src/config/roles.js` (Role definitions)
  - [MODIFY] `backend/src/models/User.js` (Add `role`, `businessId`, `isSystemUser`)
  - [NEW] `backend/src/scripts/add-roles-to-users.js` (Migration script)

### Phase 2: Business Model & Tenant Isolation
- **Goals**: Ensure Business model is robust and data is owned by Business.
- **Files**:
  - [MODIFY] `backend/src/models/Business.js` (Add subscription/usage fields if missing)
  - [MODIFY] `backend/src/models/Document.js` (Ensure `businessId` index)
  - [MODIFY] `backend/src/models/Conversation.js` (Add `businessId`, `createdBy`)
  - [NEW] `backend/src/scripts/migrate-to-business-model.js` (Data migration)

### Phase 3: Tenant Isolation Middleware
- **Goals**: Strict middleware to enforce isolation.
- **Files**:
  - [NEW] `backend/src/middleware/tenantIsolation.middleware.js`
  - [NEW] `backend/src/utils/queryScoping.js`

### Phase 4: Permission Middleware
- **Goals**: Granular permission checks.
- **Files**:
  - [NEW] `backend/src/middleware/permission.middleware.js` (Refactor existing or create new)

### Phase 5: API Namespace Separation
- **Goals**: Separate Business and Admin APIs.
- **Files**:
  - [NEW] `backend/src/routes/business/index.js`
  - [NEW] `backend/src/routes/admin/index.js`
  - [MODIFY] `backend/src/routes/index.js` (or `server.js`) to mount new routes.

### Phase 6: Update Controllers
- **Goals**: Apply scoping to all logic.
- **Files**:
  - [MODIFY] All Controllers (Documents, Conversations, etc.) to use `scopeToBusinessId`.

### Phase 7: Testing & Verification
- **Goals**: Comprehensive testing.
- **Files**:
  - [NEW] `backend/tests/security.test.js`

## Verification Plan

### Automated Tests
- Run `npm test` (if available) or specific test scripts created during phases.
- Create specific test scripts for RBAC verification (e.g., `verify-rbac.js`).

### Manual Verification
- **Test Scenarios**:
  1. Login as User A -> Can see only User A's Business data.
  2. Login as User B -> Cannot see User A's data.
  3. Login as Admin -> Can see all (if allowed) or bypass.
  4. Role Checks: Staff cannot delete operations if restricted.
