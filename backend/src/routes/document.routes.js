const express = require('express');
const documentController = require('../controllers/document.controller');
const { authenticate } = require('../middleware/auth.middleware');
const { enforceTenantIsolation } = require('../middleware/tenantIsolation.middleware');
const uploadMiddleware = require('../middleware/upload.middleware');

const { urlScrapeLimiter } = require('../middleware/rateLimiter.middleware');

const { checkPermission } = require('../middleware/permission.middleware');

const router = express.Router();

// All routes require authentication and business context
router.use(authenticate);
router.use(enforceTenantIsolation);

// Routes
// Upload: Requires creation permission
router.post('/upload', checkPermission('documents.create'), uploadMiddleware, documentController.uploadDocument);

// URL Utils: Requires creation permission
router.post('/preview-url', checkPermission('documents.create'), urlScrapeLimiter, documentController.previewUrlContent);
router.post('/add-url', checkPermission('documents.create'), urlScrapeLimiter, documentController.addFromURL);
router.post('/:id/refresh', checkPermission('documents.update'), urlScrapeLimiter, documentController.refreshURLContent);

// List/Search: Requires read permission
router.get('/', checkPermission('documents.read'), documentController.listDocuments);
router.get('/search', checkPermission('documents.read'), documentController.searchHelper);

// Delete: Requires delete permission
router.delete('/:id', checkPermission('documents.delete'), documentController.deleteDocument);

module.exports = router;
