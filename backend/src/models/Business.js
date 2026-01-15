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
    subscriptionStatus: {
        type: String,
        enum: ['free', 'pro', 'enterprise'],
        default: 'free'
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

// Index for URL routing


module.exports = mongoose.model('Business', businessSchema);
