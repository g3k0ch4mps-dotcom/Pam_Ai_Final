const express = require('express');
const documentController = require('../controllers/document.controller');
const { authenticate } = require('../middleware/auth.middleware');
const { enforceTenantIsolation } = require('../middleware/tenantIsolation.middleware');
const uploadMiddleware = require('../middleware/upload.middleware');

const { urlScrapeLimiter } = require('../middleware/rateLimiter.middleware');

const router = express.Router();

// All routes require authentication and business context
router.use(authenticate);
router.use(enforceTenantIsolation); // Strict tenant isolation

// Routes
router.post('/upload', uploadMiddleware, documentController.uploadDocument);
router.post('/preview-url', urlScrapeLimiter, documentController.previewUrlContent);
router.post('/add-url', urlScrapeLimiter, documentController.addFromURL);
router.post('/:id/refresh', urlScrapeLimiter, documentController.refreshURLContent);
router.get('/', documentController.listDocuments);
router.delete('/:id', documentController.deleteDocument);
router.get('/search', documentController.searchHelper);

module.exports = router;
