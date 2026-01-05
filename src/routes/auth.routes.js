const express = require('express');
const authController = require('../controllers/auth.controller');
const { validateRegistration, validateLogin } = require('../middleware/validation.middleware');
const { authenticate } = require('../middleware/auth.middleware');

const rateLimit = require('express-rate-limit');

const router = express.Router();

// Strict Rate Limiter for Auth Routes
const authLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 10, // Limit each IP to 10 login requests per hour
    message: {
        success: false,
        error: { code: 'TOO_MANY_LOGIN_ATTEMPTS', message: 'Too many login attempts, please try again in an hour.' }
    }
});

// Public routes
router.post('/register', authLimiter, validateRegistration, authController.registerBusiness);
router.post('/login', authLimiter, validateLogin, authController.login);

// Protected routes
router.get('/me', authenticate, authController.getMe);

module.exports = router;
