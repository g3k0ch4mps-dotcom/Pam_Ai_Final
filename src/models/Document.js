const mongoose = require('mongoose');

const documentSchema = new mongoose.Schema({
    businessId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Business',
        required: true,
        index: true // Faster lookups by business
    },
    // Source type: file or url
    sourceType: {
        type: String,
        enum: ['file', 'url'],
        required: true,
        default: 'file'
    },

    // File-specific fields
    filename: {
        type: String,
        required: function () { return this.sourceType === 'file'; }
    },
    originalName: {
        type: String,
        required: function () { return this.sourceType === 'file'; }
    },
    mimeType: {
        type: String,
        required: function () { return this.sourceType === 'file'; }
    },
    size: {
        type: Number,
        required: function () { return this.sourceType === 'file'; }
    },

    // URL-specific fields
    sourceURL: {
        type: String,
        required: function () { return this.sourceType === 'url'; }
    },
    urlTitle: {
        type: String
    },
    urlDescription: {
        type: String
    },
    lastScrapedAt: {
        type: Date
    },

    // Auto-refresh configuration for URLs
    autoRefresh: {
        enabled: {
            type: Boolean,
            default: false
        },
        frequency: {
            type: String,
            enum: ['daily', 'weekly', 'monthly'],
            default: 'weekly'
        },
        lastRefreshed: Date,
        nextRefresh: Date
    },
    // We store the full extracted text for search
    textContent: {
        type: String,
        required: false, // Might be empty for image-only PDFs (OCR not implemented yet)
        default: ''
    },
    metadata: {
        type: Map,
        of: String
    },
    uploadedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
}, {
    timestamps: true
});

// Create a Text Index on the content and name for searching
// Weights allow us to prioritize matches in the title over the body
// Include URL fields for URL-based documents
documentSchema.index(
    {
        originalName: 'text',
        urlTitle: 'text',
        urlDescription: 'text',
        textContent: 'text'
    },
    {
        weights: {
            originalName: 10,
            urlTitle: 10,
            urlDescription: 5,
            textContent: 1
        },
        name: 'TextSearchIndex'
    }
);

// Compound index for efficient queries by business and source type
documentSchema.index({ businessId: 1, sourceType: 1 });

module.exports = mongoose.model('Document', documentSchema);
