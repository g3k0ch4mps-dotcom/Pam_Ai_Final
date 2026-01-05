const mongoose = require('mongoose');

const chatLogSchema = new mongoose.Schema({
    businessId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Business',
        required: true,
        index: true
    },
    userQuestion: {
        type: String,
        required: true
    },
    aiResponse: {
        type: String,
        required: true
    },
    relevantDocuments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Document'
    }],
    ipAddress: {
        type: String
    },
    cost: {
        tokens: Number,
        estimatedCostUSD: Number
    },
    metadata: {
        type: Map,
        of: String
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('ChatLog', chatLogSchema);
