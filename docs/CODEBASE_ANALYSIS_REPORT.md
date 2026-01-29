# Codebase Analysis Report

## 1. Current Models
- **User Model**: Basic schema (`email`, `passwordHash`, `firstName`, `lastName`). **Missing**: `role`, `businessId`, `isSystemUser`.
- **Business Model**: Already exists with `businessName`, `slug`, `subscriptionStatus`. **Missing**: `team` array (if required by new plan), `usage` tracking.
- **BusinessMember Model**: Exists. Implements M:N relationship with roles (`owner`, `admin`, `member`). **Note**: This conflicts slightly with the simpler `User.businessId` approach in the guide, but can coexist or be deprecated.
- **Document Model**: Already has `businessId` and `sourceType`. Linked to `User` via `uploadedBy`.
- **Conversation Model**: Not yet fully analyzed but likely similar to Document.

## 2. Current Authentication
- **Method**: JWT based (`auth.middleware.js`).
- **Middleware**: `authenticate` checks token and generic existence of user.
- **Context**: Tries to extract `businessId` from token if present.

## 3. Current Authorization
- **Permission System**: Basic. `permission.middleware.js` uses `BusinessMember` to check `role` (`owner` vs `member`).
- **Roles**: Hardcoded in `BusinessMember` schema (`owner`, `admin`, `member`). No central `roles.js` config found.

## 4. Current Data Model & Multi-tenancy
- **Structure**: Mixed. `Document` is tenant-aware (`businessId`). `User` is not directly tenant-bound (relies on `BusinessMember`).
- **Isolation**: `checkBusinessAccess` middleware exists but is not globally applied or strictly enforced via a central "Tenant Isolation" layer as requested.
- **Issues**: User model lacks direct binding, making efficient "Get my business" queries harder without join.

## 5. Migration Complexity
- **Breaking Changes**: Adding required fields to `User` will require migration.
- **Data Migration**: Existing users need to be assigned a role and potentially a business (if they don't have one in `BusinessMember`).
- **Refactoring**: Existing `business.routes.js` and `permission.middleware.js` will need significant updates to align with the new `config/roles.js` and `User.role` architecture.

## 6. Recommendations
- **Follow Guide**: Proceed with adding `role` and `businessId` to `User` to standardize the "Primary Context".
- **Refactor**: Replace or Sync `BusinessMember` logic with the new `User.role` for the primary business.
- **Cleanup**: Eventually deprecate `BusinessMember` if single-tenancy is the strict goal, or keep it for future multi-business support but prioritize `User.businessId` for the active session.
