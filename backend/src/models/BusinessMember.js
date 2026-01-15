const mongoose = require('mongoose');

const businessMemberSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    businessId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Business',
        required: true
    },
    role: {
        type: String,
        enum: ['owner', 'admin', 'member'],
        default: 'member',
        required: true
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

// Compound index to ensure a user is only added once to a business
businessMemberSchema.index({ userId: 1, businessId: 1 }, { unique: true });

// Index for efficient querying of a business's members
businessMemberSchema.index({ businessId: 1 });

module.exports = mongoose.model('BusinessMember', businessMemberSchema);
