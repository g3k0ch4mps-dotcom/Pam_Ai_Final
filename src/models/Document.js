const mongoose = require('mongoose');

const documentSchema = new mongoose.Schema({
    businessId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Business',
        required: true,
        index: true // Faster lookups by business
    },
    filename: {
        type: String,
        required: true
    },
    originalName: {
        type: String,
        required: true
    },
    mimeType: {
        type: String,
        required: true
    },
    size: {
        type: Number,
        required: true
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
documentSchema.index(
    {
        originalName: 'text',
        textContent: 'text'
    },
    {
        weights: {
            originalName: 10,
            textContent: 1
        },
        name: 'TextSearchIndex'
    }
);

module.exports = mongoose.model('Document', documentSchema);
