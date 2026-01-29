/**
 * Query Scoping Utilities
 * 
 * CRITICAL: All business-level queries MUST use these helpers
 * to ensure tenant isolation at the database level
 */

/**
 * Add businessId filter to query
 * 
 * Usage:
 *   const query = scopeToBusinessId(req, { status: 'active' });
 *   const documents = await Document.find(query);
 */
function scopeToBusinessId(req, baseQuery = {}) {
    // Super admin bypass
    if (req.bypassTenantIsolation) {
        return baseQuery;
    }

    // Add businessId filter
    return {
        ...baseQuery,
        businessId: req.businessId,
    };
}

/**
 * Create business-scoped aggregate pipeline
 * 
 * Usage:
 *   const pipeline = scopeAggregatePipeline(req, [
 *     { $group: { _id: '$status', count: { $sum: 1 } } }
 *   ]);
 *   const results = await Document.aggregate(pipeline);
 */
function scopeAggregatePipeline(req, pipeline = []) {
    // Super admin bypass
    if (req.bypassTenantIsolation) {
        return pipeline;
    }

    // Add businessId match at the start
    return [
        { $match: { businessId: req.businessId } },
        ...pipeline,
    ];
}

/**
 * Validate that a document belongs to user's business
 * 
 * Usage:
 *   const document = await Document.findById(id);
 *   if (!belongsToBusiness(req, document)) {
 *     throw new Error('Access denied');
 *   }
 */
function belongsToBusiness(req, document) {
    // Super admin bypass
    if (req.bypassTenantIsolation) {
        return true;
    }

    if (!document || !document.businessId) {
        return false;
    }

    return document.businessId.toString() === req.businessId.toString();
}

/**
 * Assign ownership to new document
 */
function assignOwnership(req, data = {}) {
    if (!req.businessId || !req.user || !req.user._id) {
        // Should catch this before calling, but for safety
        return data;
    }

    return {
        ...data,
        businessId: req.businessId,
        createdBy: req.user._id,
        // Legacy support
        uploadedBy: req.user._id
    };
}

module.exports = {
    scopeToBusinessId,
    scopeAggregatePipeline,
    belongsToBusiness,
    assignOwnership
};
