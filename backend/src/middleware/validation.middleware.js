/**
 * Validation Middleware
 * Validates request bodies for auth endpoints
 */

const validateRegistration = (req, res, next) => {
    const { email, password, firstName, lastName, businessName } = req.body;
    const errors = [];

    // Email validation
    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
        errors.push('Valid email address is required');
    }

    // Password validation (min 8 chars, at least one number)
    if (!password || password.length < 8) {
        errors.push('Password must be at least 8 characters long');
    }

    if (!/\d/.test(password)) {
        errors.push('Password must contain at least one number');
    }

    // Name validation
    if (!firstName || firstName.trim().length === 0) {
        errors.push('First name is required');
    }

    if (!lastName || lastName.trim().length === 0) {
        errors.push('Last name is required');
    }

    // Business name validation
    if (!businessName || businessName.trim().length === 0) {
        errors.push('Business name is required');
    }

    if (errors.length > 0) {
        return res.status(400).json({
            success: false,
            error: {
                code: 'VALIDATION_ERROR',
                message: 'Validation failed',
                details: errors
            }
        });
    }

    next();
};

const validateLogin = (req, res, next) => {
    const { email, password } = req.body;
    const errors = [];

    if (!email) {
        errors.push('Email is required');
    }

    if (!password) {
        errors.push('Password is required');
    }

    if (errors.length > 0) {
        return res.status(400).json({
            success: false,
            error: {
                code: 'VALIDATION_ERROR',
                message: 'Validation failed',
                details: errors
            }
        });
    }

    next();
};

module.exports = {
    validateRegistration,
    validateLogin
};
