const mongoose = require('mongoose');

const leadSchema = new mongoose.Schema({
    // Business reference
    businessId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Business',
        required: true
    },

    businessSlug: {
        type: String,
        required: true,
        index: true
    },

    // Session tracking
    sessionId: {
        type: String,
        required: true
    },

    // Contact information (all optional - collected gradually)
    name: {
        type: String,
        trim: true
    },

    email: {
        type: String,
        trim: true,
        lowercase: true,
        match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/  // Basic email validation
    },

    phone: {
        type: String,
        trim: true
    },

    // Engagement data
    interests: [{
        type: String,
        trim: true
    }],

    questions: [{
        type: String
    }],

    chatHistory: [{
        role: {
            type: String,
            enum: ['user', 'assistant'],
            required: true
        },
        message: {
            type: String,
            required: true
        },
        timestamp: {
            type: Date,
            default: Date.now
        }
    }],

    // Lead metadata
    source: {
        type: String,
        default: 'chat',
        enum: ['chat', 'form', 'import']
    },

    status: {
        type: String,
        default: 'new',
        enum: ['new', 'contacted', 'qualified', 'converted', 'lost']
    },

    leadScore: {
        type: Number,
        default: 0,
        min: 0,
        max: 100
    },

    // Notes (business can add notes about lead)
    notes: String,

    // Timestamps
    firstContact: {
        type: Date,
        default: Date.now
    },

    lastContact: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true  // Adds createdAt and updatedAt automatically
});

// Indexes for fast queries
leadSchema.index({ businessId: 1, createdAt: -1 });
leadSchema.index({ businessId: 1, status: 1 });
leadSchema.index({ email: 1 });
leadSchema.index({ sessionId: 1 });

// Method to calculate lead score
leadSchema.methods.calculateScore = function () {
    let score = 0;

    // Contact information
    if (this.email) score += 30;
    if (this.phone) score += 20;
    if (this.name) score += 10;

    // Engagement level (number of questions)
    score += Math.min(this.questions.length * 5, 25);

    // Interests expressed
    score += Math.min(this.interests.length * 5, 15);

    // Chat duration
    if (this.lastContact && this.firstContact) {
        const duration = this.lastContact - this.firstContact;
        const minutes = duration / (1000 * 60);

        if (minutes > 5) score += 10;
        if (minutes > 10) score += 5;
    }

    return Math.min(score, 100);
};

// Method to update lead score
leadSchema.methods.updateScore = async function () {
    this.leadScore = this.calculateScore();
    await this.save();
};

// Static method to find or create lead
leadSchema.statics.findOrCreate = async function (businessId, businessSlug, sessionId) {
    let lead = await this.findOne({ sessionId, businessId });

    if (!lead) {
        lead = await this.create({
            businessId,
            businessSlug,
            sessionId,
            firstContact: new Date(),
            lastContact: new Date()
        });
    }

    return lead;
};

module.exports = mongoose.model('Lead', leadSchema);
