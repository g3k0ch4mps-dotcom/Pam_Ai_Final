const mongoose = require('mongoose');

const businessSchema = new mongoose.Schema({
    businessName: {
        type: String,
        required: [true, 'Business name is required'],
        trim: true
    },
    businessSlug: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    industry: {
        type: String,
        trim: true
    },
    // Team Management
    teamMembers: [{
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        role: {
            type: String,
            enum: ['business_owner', 'business_admin', 'business_staff', 'business_viewer'],
            default: 'business_staff'
        },
        joinedAt: {
            type: Date,
            default: Date.now
        }
    }],

    // Detailed Subscription
    subscription: {
        plan: {
            type: String,
            enum: ['free', 'pro', 'enterprise'],
            default: 'free'
        },
        status: {
            type: String,
            enum: ['active', 'past_due', 'canceled', 'trialing'],
            default: 'active'
        },
        startDate: Date,
        endDate: Date,
        features: [String]
    },

    // Usage Limits & Tracking
    usage: {
        documentsCount: { type: Number, default: 0 },
        documentsLimit: { type: Number, default: 10 }, // Free tier limit
        conversationsCount: { type: Number, default: 0 },
        storageUsedBytes: { type: Number, default: 0 },
        storageLimitBytes: { type: Number, default: 104857600 } // 100MB
    },

    isActive: {
        type: Boolean,
        default: true
    },
    // Settings for the public chat interface
    chatSettings: {
        isPublic: { type: Boolean, default: true },
        welcomeMessage: { type: String, default: 'How can I help you today?' },
        primaryColor: { type: String, default: '#000000' }
    },
    // Branding
    branding: {
        logoUrl: String,
        websiteUrl: String
    }
}, {
    timestamps: true
});

// Helper to check if user is a member
businessSchema.methods.isMember = function (userId) {
    return this.teamMembers.some(member => member.userId.toString() === userId.toString());
};

// Helper to get member role
businessSchema.methods.getMemberRole = function (userId) {
    const member = this.teamMembers.find(m => m.userId.toString() === userId.toString());
    return member ? member.role : null;
};

// Index for URL routing


module.exports = mongoose.model('Business', businessSchema);
