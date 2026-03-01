const mongoose = require('mongoose');

const conversationSchema = new mongoose.Schema({
    businessId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Business',
        required: true,
        index: true
    },
    title: {
        type: String,
        default: 'New Conversation'
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    participants: [{
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        role: {
            type: String,
            enum: ['owner', 'admin', 'member', 'viewer'],
            default: 'viewer'
        },
        joinedAt: {
            type: Date,
            default: Date.now
        }
    }],
    isActive: {
        type: Boolean,
        default: true
    },
    lastMessageAt: {
        type: Date,
        default: Date.now
    },
    messages: [{
        role: {
            type: String,
            enum: ['user', 'assistant', 'system'],
            required: true
        },
        content: {
            type: String,
            required: true
        },
        createdAt: {
            type: Date,
            default: Date.now
        },
        // Optional: Reference to source documents used for this response
        citations: [{
            documentId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Document'
            },
            snippet: String
        }]
    }],
    metadata: {
        type: Map,
        of: String
    },
    // ==========================================
    // TICKETING FIELDS
    // ==========================================
    isTicket: {
        type: Boolean,
        default: false
    },
    ticketNumber: {
        type: String,
        unique: true,
        sparse: true
    },
    status: {
        type: String,
        enum: ['open', 'pending', 'in_progress', 'resolved', 'closed'],
        default: 'open'
    },
    priority: {
        type: String,
        enum: ['low', 'medium', 'high', 'urgent'],
        default: 'medium'
    },
    assignedTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    tags: [String],
    dueDate: Date,
    resolvedAt: Date,
    customerEmail: String,
    customerName: String,
    customerPhone: String
}, {
    timestamps: true
});

// Indexes
conversationSchema.index({ businessId: 1, lastMessageAt: -1 });
conversationSchema.index({ 'participants.userId': 1 });

module.exports = mongoose.model('Conversation', conversationSchema);
