const Business = require('../models/Business');
const ChatLog = require('../models/ChatLog');
const aiService = require('../services/ai.service');
const searchService = require('../services/search.service');
const logger = require('../utils/logger');

/**
 * Handle public chat request
 * @route POST /api/chat/public
 */
const handlePublicChat = async (req, res) => {
    try {
        const { businessSlug } = req.params;
        const { question } = req.body;

        if (!businessSlug || !question) {
            return res.status(400).json({
                success: false,
                error: { code: 'MISSING_FIELDS', message: 'businessSlug and question are required' }
            });
        }

        // 1. Find Business
        const business = await Business.findOne({ businessSlug });
        if (!business) {
            return res.status(404).json({
                success: false,
                error: { code: 'NOT_FOUND', message: 'Business not found' }
            });
        }

        // 2. Check Settings (Is Chat Public?)
        if (business.chatSettings && !business.chatSettings.isPublic) {
            return res.status(403).json({
                success: false,
                error: { code: 'CHAT_DISABLED', message: 'Chat is currently disabled for this business' }
            });
        }

        // 2a. Find or Create Lead Session
        const sessionId = req.body.sessionId || `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        const leadService = require('../services/lead.service');
        await leadService.findOrCreateLead(business._id, businessSlug, sessionId);

        // 3. Search Relevant Documents
        logger.info(`Searching docs for business: ${business.businessName}, query: ${question}`);
        const contextDocs = await searchService.searchDocuments(business._id, question, 3); // Top 3 docs

        // 4. Generate AI Response
        const responseData = await aiService.generateResponse(
            question,
            contextDocs,
            { businessName: business.businessName }
        );

        // 4a. Update Lead with Interaction
        // Add User Question
        await leadService.addChatMessage(sessionId, 'user', question);
        await leadService.extractInterests(question).forEach(interest =>
            leadService.addInterest(sessionId, interest)
        );

        // Add AI Response
        await leadService.addChatMessage(sessionId, 'assistant', responseData.answer);

        // 5. Log Chat (Legacy / Independent Log)
        await ChatLog.create({
            businessId: business._id,
            userQuestion: question,
            aiResponse: responseData.answer,
            relevantDocuments: contextDocs.map(d => d.id),
            ipAddress: req.ip,
            cost: {
                tokens: responseData.usage ? responseData.usage.total_tokens : 0,
                // Simple estimation: $0.002 per 1k tokens (approx for gpt-3.5)
                estimatedCostUSD: responseData.usage ? (responseData.usage.total_tokens / 1000) * 0.002 : 0
            }
        });

        res.json({
            success: true,
            answer: responseData.answer,
            sessionId: sessionId, // Return session ID to frontend
            references: contextDocs.map(d => ({ filename: d.filename, score: d.score })) // Optional: Return sources
        });

    } catch (error) {
        logger.error(`Chat error: ${error.message}`);
        res.status(500).json({
            success: false,
            error: { code: 'CHAT_FAILED', message: 'Failed to process chat request' }
        });
    }
};

module.exports = {
    handlePublicChat
};
