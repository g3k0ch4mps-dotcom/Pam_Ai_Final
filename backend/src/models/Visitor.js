const mongoose = require('mongoose');

const visitorSchema = new mongoose.Schema({
    businessId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Business',
        required: true,
        index: true
    },
    sessionId: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
    ipAddress: String,
    location: {
        country: String,
        city: String
    },
    isOnline: {
        type: Boolean,
        default: true
    },
    currentPage: String,
    visitHistory: [{
        page: String,
        timestamp: {
            type: Date,
            default: Date.now
        },
        timeSpent: Number // in seconds
    }],
    totalPageViews: {
        type: Number,
        default: 1
    },
    totalTimeOnSite: {
        type: Number,
        default: 0
    },
    hasStartedChat: {
        type: Boolean,
        default: false
    },
    conversationId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Conversation'
    },
    lastActive: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

// Indexes
visitorSchema.index({ businessId: 1, isOnline: 1 });
visitorSchema.index({ lastActive: -1 });

module.exports = mongoose.model('Visitor', visitorSchema);
