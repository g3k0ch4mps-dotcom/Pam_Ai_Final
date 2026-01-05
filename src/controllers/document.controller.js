const fs = require('fs');
const Document = require('../models/Document');
const extractionService = require('../services/extraction.service');
const searchService = require('../services/search.service');
const logger = require('../utils/logger');

/**
 * Upload and process a new document
 * @route POST /api/documents/upload
 */
const uploadDocument = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                error: { code: 'NO_FILE', message: 'No file uploaded' }
            });
        }

        const { originalname, mimetype, size, path: filePath } = req.file;
        const businessId = req.businessId; // Set by permission middleware
        const userId = req.user._id;

        // 1. Extract Text
        logger.info(`Extracting text from ${originalname}...`);
        let textContent = '';
        try {
            textContent = await extractionService.extractText(req.file);
        } catch (extractError) {
            logger.warn(`Extraction warning: ${extractError.message}`);
            // We still save the file, but text content might be empty
            textContent = '';
        }

        // 2. Save to Database
        const document = await Document.create({
            businessId,
            filename: req.file.filename,
            originalName: originalname,
            mimeType: mimetype,
            size,
            textContent,
            uploadedBy: userId
        });

        // 3. Cleanup: Delete the temp file (We rely on DB for text storage now?)
        // WAIT: If we delete the file, we can't re-download it. 
        // For this architecture, we usually keep the file in 'uploads' or S3.
        // For this local MVP, we will KEEP the file in uploads/ folder.

        logger.info(`✓ Document processed: ${document._id}`);

        res.status(201).json({
            success: true,
            data: {
                id: document._id,
                filename: document.originalName,
                size: document.size,
                uploadedAt: document.createdAt
            }
        });

    } catch (error) {
        // Cleanup temp file if error occurs
        if (req.file && fs.existsSync(req.file.path)) {
            fs.unlinkSync(req.file.path);
        }

        logger.error(`Upload error: ${error.message}`);
        res.status(500).json({
            success: false,
            error: {
                code: 'UPLOAD_FAILED',
                message: 'Failed to process document'
            }
        });
    }
};

/**
 * List documents for the business
 * @route GET /api/documents
 */
const listDocuments = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const documents = await Document.find({ businessId: req.businessId })
            .select('-textContent') // Exclude heavy text content
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const total = await Document.countDocuments({ businessId: req.businessId });

        res.json({
            success: true,
            data: documents,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        logger.error(`List documents error: ${error.message}`);
        res.status(500).json({
            success: false,
            error: { code: 'LIST_FAILED', message: 'Failed to list documents' }
        });
    }
};

/**
 * Delete a document
 * @route DELETE /api/documents/:id
 */
const deleteDocument = async (req, res) => {
    try {
        const document = await Document.findOne({
            _id: req.params.id,
            businessId: req.businessId
        });

        if (!document) {
            return res.status(404).json({
                success: false,
                error: { code: 'NOT_FOUND', message: 'Document not found' }
            });
        }

        // 1. Delete file from disk
        const filePath = require('path').join(__dirname, '../../uploads', document.filename);
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }

        // 2. Delete from DB
        await Document.deleteOne({ _id: document._id });

        res.json({
            success: true,
            message: 'Document deleted successfully'
        });
    } catch (error) {
        logger.error(`Delete document error: ${error.message}`);
        res.status(500).json({
            success: false,
            error: { code: 'DELETE_FAILED', message: 'Failed to delete document' }
        });
    }
};

/**
 * Search documents (Debug Helper for Text Index)
 * @route GET /api/documents/search
 */
const searchHelper = async (req, res) => {
    try {
        const { q } = req.query;
        if (!q) {
            return res.status(400).json({ success: false, message: 'Query required' });
        }

        const results = await searchService.searchDocuments(req.businessId, q);
        res.json({
            success: true,
            data: results
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

module.exports = {
    uploadDocument,
    listDocuments,
    deleteDocument,
    searchHelper
};
