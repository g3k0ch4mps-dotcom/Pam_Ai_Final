const Document = require('../models/Document');
const logger = require('../utils/logger');

/**
 * Execute simplified text search using MongoDB Text Index
 * @param {string} businessId - The business to scope the search to
 * @param {string} query - The search query
 * @param {number} limit - Maximum results to return
 */
const searchDocuments = async (businessId, query, limit = 5) => {
    try {
        // Use MongoDB $text operator
        const results = await Document.find(
            {
                businessId: businessId,
                $text: { $search: query }
            },
            {
                score: { $meta: 'textScore' } // Return relevance score
            }
        )
            .sort({ score: { $meta: 'textScore' } }) // Sort by relevance
            .limit(limit)
            .select('originalName textContent score'); // Select fields to return

        return results.map(doc => ({
            id: doc._id,
            filename: doc.originalName,
            content: doc.textContent,
            score: doc.score,
            // Snippet generation could be added here
            snippet: doc.textContent.substring(0, 200) + '...'
        }));

    } catch (error) {
        logger.error(`Search failed: ${error.message}`);
        return [];
    }
};

module.exports = {
    searchDocuments
};
