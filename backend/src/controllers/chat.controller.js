const Business = require('../models/Business');
const ChatLog = require('../models/ChatLog');
const aiService = require('../services/ai.service');
const searchService = require('../services/search.service');
const logger = require('../utils/logger');

/**
 * Handle public chat request
 * @route POST /api/chat/public
 */
const { scopeToBusinessId, assignOwnership } = require('../utils/queryScoping');
const Conversation = require('../models/Conversation');

/**
 * Handle public chat request (Legacy/Public Widget)
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

        // 2. Check Settings
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

        // 5. Log Chat
        // Optionally migrate this to Conversation model too if we want unified storage
        await ChatLog.create({
            businessId: business._id,
            userQuestion: question,
            aiResponse: responseData.answer,
            relevantDocuments: contextDocs.map(d => d.id),
            ipAddress: req.ip,
            cost: {
                tokens: responseData.usage ? responseData.usage.total_tokens : 0,
                estimatedCostUSD: responseData.usage ? (responseData.usage.total_tokens / 1000) * 0.002 : 0
            }
        });

        res.json({
            success: true,
            answer: responseData.answer,
            sessionId: sessionId,
            references: contextDocs.map(d => ({ filename: d.filename, score: d.score }))
        });

    } catch (error) {
        logger.error(`Chat error: ${error.message}`);
        res.status(500).json({
            success: false,
            error: { code: 'CHAT_FAILED', message: 'Failed to process chat request' }
        });
    }
};

/**
 * List internal conversations
 * @route GET /api/chat/conversations
 */
const listConversations = async (req, res) => {
    try {
        const query = scopeToBusinessId(req, {});
        // Optional: filter by user participation?
        // query['participants.userId'] = req.user._id;

        const conversations = await Conversation.find(query)
            .sort({ lastMessageAt: -1 })
            .limit(50);

        res.json({ success: true, data: conversations });
    } catch (error) {
        logger.error(`List conversations error: ${error.message}`);
        res.status(500).json({ success: false, error: 'Failed' });
    }
};

/**
 * Handle internal business chat
 * @route POST /api/chat/internal
 */
const handleInternalChat = async (req, res) => {
    try {
        const { message, conversationId } = req.body;

        let conversation;

        if (conversationId) {
            conversation = await Conversation.findOne(
                scopeToBusinessId(req, { _id: conversationId })
            );
            if (!conversation) return res.status(404).json({ error: 'Conversation not found' });
        } else {
            // Start new
            const convData = assignOwnership(req, {
                title: message.substring(0, 30) + '...',
                participants: [{ userId: req.user._id, role: 'owner' }],
                messages: []
            });
            conversation = await Conversation.create(convData);
        }

        // Search Knowledge Base (Scoped)
        const contextDocs = await searchService.searchDocuments(req.businessId, message, 3);

        // Generate Response
        const responseData = await aiService.generateResponse(
            message,
            contextDocs,
            { businessName: req.business.businessName }
        );

        // Update Conversation
        conversation.messages.push({
            role: 'user',
            content: message
        });
        conversation.messages.push({
            role: 'assistant',
            content: responseData.answer,
            citations: contextDocs.map(d => ({ documentId: d.id, snippet: d.text?.substring(0, 100) }))
        });
        conversation.lastMessageAt = new Date();
        await conversation.save();

        res.json({
            success: true,
            data: conversation,
            answer: responseData.answer
        });

    } catch (error) {
        logger.error(`Internal chat error: ${error.message}`);
        res.status(500).json({ success: false, error: 'Internal chat failed' });
    }
};

module.exports = {
    handlePublicChat,
    listConversations,
    handleInternalChat
};
