const express = require('express');
const chatController = require('../controllers/chat.controller');
const rateLimit = require('express-rate-limit');

const router = express.Router();

// Rate Limiter for Public Chat
const chatLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 20, // Limit each IP to 20 requests per window
    message: {
        success: false,
        error: { code: 'RATE_LIMIT_EXCEEDED', message: 'Too many chat requests, please try again later.' }
    }
});

// Public Endpoint
router.post('/public', chatLimiter, chatController.handlePublicChat);

module.exports = router;
