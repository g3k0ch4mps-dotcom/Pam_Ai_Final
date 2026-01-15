const Lead = require('../models/Lead');
const logger = require('../utils/logger');

/**
 * Lead Service - Handles lead capture and management
 */
class LeadService {
    /**
     * Find or create a lead for a session
     */
    async findOrCreateLead(businessId, businessSlug, sessionId) {
        try {
            let lead = await Lead.findOne({ sessionId, businessId });

            if (!lead) {
                lead = await Lead.create({
                    businessId,
                    businessSlug,
                    sessionId,
                    firstContact: new Date(),
                    lastContact: new Date()
                });

                logger.info(`✅ New lead created: ${lead._id} (Session: ${sessionId})`);
            }

            return lead;
        } catch (error) {
            logger.error(`❌ Error finding/creating lead: ${error.message}`);
            throw error;
        }
    }

    /**
     * Update lead contact information
     */
    async updateContactInfo(sessionId, data) {
        try {
            const lead = await Lead.findOne({ sessionId });

            if (!lead) {
                throw new Error('Lead not found');
            }

            // Update only provided fields
            if (data.name) lead.name = data.name;
            if (data.email) lead.email = data.email;
            if (data.phone) lead.phone = data.phone;

            lead.lastContact = new Date();

            // Recalculate score
            lead.leadScore = lead.calculateScore();

            await lead.save();

            logger.info(`✅ Lead updated: ${lead._id}`);

            return lead;
        } catch (error) {
            logger.error(`❌ Error updating lead: ${error.message}`);
            throw error;
        }
    }

    /**
     * Add question to lead history
     */
    async addQuestion(sessionId, question) {
        try {
            const lead = await Lead.findOne({ sessionId });

            if (!lead) return;

            // Add question if not duplicate
            if (!lead.questions.includes(question)) {
                lead.questions.push(question);
            }

            lead.lastContact = new Date();
            // Recalculate score to account for engagement
            lead.leadScore = lead.calculateScore();

            await lead.save();

            return lead;
        } catch (error) {
            logger.error(`❌ Error adding question: ${error.message}`);
            throw error;
        }
    }

    /**
     * Add interest to lead
     */
    async addInterest(sessionId, interest) {
        try {
            const lead = await Lead.findOne({ sessionId });

            if (!lead) return;

            // Add interest if not duplicate
            const normalizedInterest = interest.toLowerCase();
            if (!lead.interests.includes(normalizedInterest)) {
                lead.interests.push(normalizedInterest);
            }

            lead.lastContact = new Date();
            lead.leadScore = lead.calculateScore();

            await lead.save();

            return lead;
        } catch (error) {
            logger.error(`❌ Error adding interest: ${error.message}`);
            throw error;
        }
    }

    /**
     * Add message to chat history
     */
    async addChatMessage(sessionId, role, message) {
        try {
            const lead = await Lead.findOne({ sessionId });

            if (!lead) return;

            lead.chatHistory.push({
                role,
                message,
                timestamp: new Date()
            });

            // Keep only last 50 messages to avoid bloat
            if (lead.chatHistory.length > 50) {
                lead.chatHistory = lead.chatHistory.slice(-50);
            }

            lead.lastContact = new Date();

            await lead.save();

            return lead;
        } catch (error) {
            logger.error(`❌ Error adding chat message: ${error.message}`);
            throw error;
        }
    }

    /**
     * Get lead by session ID
     */
    async getLeadBySession(sessionId) {
        try {
            return await Lead.findOne({ sessionId });
        } catch (error) {
            logger.error(`❌ Error getting lead: ${error.message}`);
            throw error;
        }
    }

    /**
     * Get all leads for a business
     */
    async getBusinessLeads(businessId, filters = {}) {
        try {
            const query = { businessId };

            // Apply filters
            if (filters.status) {
                query.status = filters.status;
            }

            if (filters.hasEmail) {
                query.email = { $exists: true, $ne: null };
            }

            if (filters.minScore) {
                query.leadScore = { $gte: Number(filters.minScore) };
            }

            const page = parseInt(filters.page) || 1;
            const limit = parseInt(filters.limit) || 100;
            const skip = (page - 1) * limit;

            const leads = await Lead.find(query)
                .sort({ leadScore: -1, createdAt: -1 })
                .skip(skip)
                .limit(limit);

            return leads;
        } catch (error) {
            logger.error(`❌ Error getting business leads: ${error.message}`);
            throw error;
        }
    }

    /**
     * Extract potential interests from question
     */
    extractInterests(question) {
        const interests = [];
        const keywords = {
            'haircut': ['haircut', 'trim', 'cut'],
            'coloring': ['color', 'dye', 'highlights', 'balayage', 'ombre'],
            'styling': ['style', 'styling', 'blowout', 'updo'],
            'pricing': ['price', 'cost', 'how much', 'expensive'],
            'booking': ['book', 'appointment', 'schedule', 'available'],
            'hours': ['hours', 'open', 'closed', 'time'],
            'engineering': ['engineering', 'technical', 'build', 'design'],
            'stem': ['stem', 'science', 'math', 'education'],
            'programs': ['program', 'course', 'class', 'workshop'],
            'products': ['product', 'buy', 'purchase', 'shop']
        };

        const lowerQuestion = question.toLowerCase();

        for (const [interest, words] of Object.entries(keywords)) {
            if (words.some(word => lowerQuestion.includes(word))) {
                interests.push(interest);
            }
        }

        return interests;
    }
}

module.exports = new LeadService();
