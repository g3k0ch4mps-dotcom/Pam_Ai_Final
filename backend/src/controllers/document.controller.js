const fs = require('fs');
const Document = require('../models/Document');
const extractionService = require('../services/extraction.service');
const urlScraperService = require('../services/urlScraper.service');
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

        // 1. Delete file from disk (only if it's a file)
        if (document.sourceType === 'file' && document.filename) {
            const filePath = require('path').join(__dirname, '../../uploads', document.filename);
            if (fs.existsSync(filePath)) {
                try {
                    fs.unlinkSync(filePath);
                } catch (err) {
                    logger.warn(`Failed to delete file ${filePath}: ${err.message}`);
                    // Continue to delete from DB even if file delete fails
                }
            }
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

/**
 * Preview URL content before adding to knowledge base
 * @route POST /api/documents/preview-url
 */
const previewUrlContent = async (req, res) => {
    try {
        const { url } = req.body;

        if (!url) {
            return res.status(400).json({
                success: false,
                error: { code: 'MISSING_URL', message: 'URL is required' }
            });
        }

        // Validate URL format
        const urlPattern = /^https?:\/\/.+/i;
        if (!urlPattern.test(url)) {
            return res.status(400).json({
                success: false,
                error: { code: 'INVALID_URL', message: 'Please provide a valid URL starting with http:// or https://' }
            });
        }

        logger.info(`[Preview] Scraping URL: ${url}`);

        // Scrape the URL with retry
        const scrapedData = await urlScraperService.scrapeWithRetry(url, 2);

        if (!scrapedData || !scrapedData.success) {
            return res.status(422).json({
                success: false,
                error: {
                    code: 'SCRAPE_FAILED',
                    message: scrapedData?.error || 'Failed to scrape URL content',
                    details: 'The website may be blocking automated access or took too long to respond.'
                }
            });
        }

        // Check content length
        if (!scrapedData.textContent || scrapedData.textContent.length < 50) {
            return res.status(422).json({
                success: false,
                error: {
                    code: 'INSUFFICIENT_CONTENT',
                    message: 'Content too short or page appears empty'
                }
            });
        }

        // Calculate statistics
        const wordCount = scrapedData.textContent.trim().split(/\s+/).length;
        const charCount = scrapedData.textContent.length;
        const estimatedReadTime = Math.ceil(wordCount / 200); // 200 words per minute

        // Prepare preview data
        const previewData = {
            title: scrapedData.title || 'Untitled',
            url: url,
            content: scrapedData.textContent,
            preview: scrapedData.textContent.substring(0, 500) + (scrapedData.textContent.length > 500 ? '...' : ''),
            stats: {
                words: wordCount,
                characters: charCount,
                estimatedReadTime: estimatedReadTime
            },
            metadata: {
                scrapedAt: scrapedData.scrapedAt,
                method: scrapedData.method || 'unknown'
            }
        };

        logger.info(`[Preview] Success for ${url} - ${wordCount} words`);

        res.status(200).json({
            success: true,
            message: 'Preview generated successfully',
            data: previewData
        });

    } catch (error) {
        logger.error(`[Preview] Error: ${error.message}`);
        res.status(500).json({
            success: false,
            error: {
                code: 'PREVIEW_ERROR',
                message: 'Failed to generate preview'
            }
        });
    }
};

/**
 * Add document from URL
 * @route POST /api/documents/add-url
 */
const addFromURL = async (req, res) => {
    try {
        const { url, autoRefresh } = req.body;
        const businessId = req.businessId;
        const userId = req.user._id;

        if (!url) {
            return res.status(400).json({
                success: false,
                error: { code: 'MISSING_URL', message: 'URL is required' }
            });
        }

        // 1. Check if URL already exists for this business
        const existing = await Document.findOne({
            businessId,
            sourceURL: url,
            sourceType: 'url'
        });

        if (existing) {
            return res.status(409).json({
                success: false,
                error: { code: 'URL_EXISTS', message: 'This URL has already been added' }
            });
        }

        // 2. Scrape URL
        logger.info(`Scraping URL: ${url}`);
        const scrapedData = await urlScraperService.scrapeWithRetry(url, 3);

        if (!scrapedData || !scrapedData.success) {
            return res.status(422).json({
                success: false,
                error: {
                    code: 'SCRAPE_FAILED',
                    message: scrapedData?.error || 'Failed to scrape URL content',
                    details: 'The website might be blocking automated access or timed out.'
                }
            });
        }

        // 3. Calculate next refresh date if auto-refresh enabled
        let nextRefresh = null;
        if (autoRefresh && autoRefresh.enabled) {
            const now = new Date();
            const frequency = autoRefresh.frequency || 'weekly';

            switch (frequency) {
                case 'daily':
                    nextRefresh = new Date(now.getTime() + 24 * 60 * 60 * 1000);
                    break;
                case 'weekly':
                    nextRefresh = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
                    break;
                case 'monthly':
                    nextRefresh = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
                    break;
            }
        }

        // 4. Save to database
        const document = await Document.create({
            businessId,
            sourceType: 'url',
            sourceURL: url,
            urlTitle: scrapedData.title,
            urlDescription: scrapedData.description,
            textContent: scrapedData.textContent,
            lastScrapedAt: scrapedData.scrapedAt,
            autoRefresh: autoRefresh ? {
                enabled: autoRefresh.enabled || false,
                frequency: autoRefresh.frequency || 'weekly',
                lastRefreshed: new Date(),
                nextRefresh: nextRefresh
            } : undefined,
            uploadedBy: userId
        });

        logger.info(`✓ URL document created: ${document._id}`);

        res.status(201).json({
            success: true,
            data: {
                id: document._id,
                url: document.sourceURL,
                title: document.urlTitle,
                scrapedAt: document.lastScrapedAt,
                autoRefresh: document.autoRefresh
            }
        });

    } catch (error) {
        logger.error(`Add URL error: ${error.message}`);
        res.status(500).json({
            success: false,
            error: {
                code: 'ADD_URL_FAILED',
                message: error.message || 'Failed to add URL'
            }
        });
    }
};

/**
 * Refresh URL content
 * @route POST /api/documents/:id/refresh
 */
const refreshURLContent = async (req, res) => {
    try {
        const document = await Document.findOne({
            _id: req.params.id,
            businessId: req.businessId,
            sourceType: 'url'
        });

        if (!document) {
            return res.status(404).json({
                success: false,
                error: { code: 'NOT_FOUND', message: 'URL document not found' }
            });
        }

        // 1. Re-scrape URL
        logger.info(`Refreshing URL: ${document.sourceURL}`);
        const scrapedData = await urlScraperService.scrapeWithRetry(document.sourceURL, 2);

        if (!scrapedData || !scrapedData.success) {
            // Log warning but don't fail the request completely if possible, 
            // or just return error state.
            logger.warn(`Failed to refresh URL ${document.sourceURL}: ${scrapedData?.error}`);
            return res.status(422).json({
                success: false,
                error: {
                    code: 'REFRESH_FAILED',
                    message: scrapedData?.error || 'Failed to refresh content'
                }
            });
        }

        // 2. Update document
        document.urlTitle = scrapedData.title;
        document.urlDescription = scrapedData.description;
        document.textContent = scrapedData.textContent;
        document.lastScrapedAt = scrapedData.scrapedAt;

        // 3. Update auto-refresh timestamps
        if (document.autoRefresh && document.autoRefresh.enabled) {
            document.autoRefresh.lastRefreshed = new Date();

            const frequency = document.autoRefresh.frequency;
            const now = new Date();

            switch (frequency) {
                case 'daily':
                    document.autoRefresh.nextRefresh = new Date(now.getTime() + 24 * 60 * 60 * 1000);
                    break;
                case 'weekly':
                    document.autoRefresh.nextRefresh = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
                    break;
                case 'monthly':
                    document.autoRefresh.nextRefresh = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
                    break;
            }
        }

        await document.save();

        logger.info(`✓ URL refreshed: ${document._id}`);

        res.json({
            success: true,
            data: {
                id: document._id,
                url: document.sourceURL,
                title: document.urlTitle,
                refreshedAt: document.lastScrapedAt
            }
        });

    } catch (error) {
        logger.error(`Refresh URL error: ${error.message}`);
        res.status(500).json({
            success: false,
            error: {
                code: 'REFRESH_FAILED',
                message: error.message || 'Failed to refresh URL'
            }
        });
    }
};

module.exports = {
    uploadDocument,
    listDocuments,
    deleteDocument,
    searchHelper,
    previewUrlContent,
    addFromURL,
    refreshURLContent
};
