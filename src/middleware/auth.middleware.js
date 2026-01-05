const { verifyToken } = require('../services/auth.service');
const User = require('../models/User');
const logger = require('../utils/logger');

/**
 * Middleware to protect routes requiring authentication
 * Verifies the JWT token from the Authorization header
 */
const authenticate = async (req, res, next) => {
    try {
        // 1. Get token from header
        const authHeader = req.headers.authorization;
        let token;

        if (authHeader && authHeader.startsWith('Bearer ')) {
            token = authHeader.split(' ')[1];
        }

        if (!token) {
            return res.status(401).json({
                success: false,
                error: {
                    code: 'AUTH_REQUIRED',
                    message: 'Authentication required. Please provide a valid token.'
                }
            });
        }

        // 2. Verify token
        const decoded = verifyToken(token);

        // 3. Check if user still exists
        const user = await User.findById(decoded.id);
        if (!user) {
            return res.status(401).json({
                success: false,
                error: {
                    code: 'USER_NOT_FOUND',
                    message: 'The user belonging to this token no longer exists.'
                }
            });
        }

        // 4. Attach user to request
        req.user = user;
        req.tokenPayload = decoded;

        // Attach business context if present in token
        if (decoded.businessId) {
            req.businessId = decoded.businessId;
            req.userRole = decoded.roles && decoded.roles.length > 0 ? decoded.roles[0] : 'member';
        }

        next();
    } catch (error) {
        logger.warn(`Authentication failed: ${error.message}`);

        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({
                success: false,
                error: {
                    code: 'INVALID_TOKEN',
                    message: 'Invalid token. Please log in again.'
                }
            });
        }

        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({
                success: false,
                error: {
                    code: 'TOKEN_EXPIRED',
                    message: 'Your session has expired. Please log in again.'
                }
            });
        }

        return res.status(500).json({
            success: false,
            error: {
                code: 'AUTH_ERROR',
                message: 'Authentication error occurred.'
            }
        });
    }
};

/**
 * Middleware to restrict access based on roles
 * @param {...string} roles - Allowed roles (e.g. 'owner', 'admin')
 */
const restrictTo = (...roles) => {
    return (req, res, next) => {
        if (!req.userRole || !roles.includes(req.userRole)) {
            return res.status(403).json({
                success: false,
                error: {
                    code: 'FORBIDDEN',
                    message: 'You do not have permission to perform this action.'
                }
            });
        }
        next();
    };
};

module.exports = {
    authenticate,
    restrictTo
};
