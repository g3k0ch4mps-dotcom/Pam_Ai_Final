const rateLimit = require('express-rate-limit');

/**
 * Rate limiter for URL scraping operations
 * Prevents abuse by limiting how many URLs can be scraped per hour
 */
const urlScrapeLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 10, // Limit each business to 10 URL scrapes per hour
    message: {
        success: false,
        error: {
            code: 'RATE_LIMIT_EXCEEDED',
            message: 'Too many URL scraping requests. Please try again later.'
        }
    },
    standardHeaders: true,
    legacyHeaders: false,
    // Use business ID as key for rate limiting
    keyGenerator: (req) => {
        return req.businessId || req.ip;
    }
});

module.exports = {
    urlScrapeLimiter
};
