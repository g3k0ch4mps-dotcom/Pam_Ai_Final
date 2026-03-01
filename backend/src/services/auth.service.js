const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const crypto = require('crypto');

/**
 * Hash a password using bcrypt
 * @param {string} password - Plain text password
 * @returns {Promise<string>} Hashed password
 */
const hashPassword = async (password) => {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
};

/**
 * Compare a plain password with a hash
 * @param {string} password - Plain text password
 * @param {string} hash - Hashed password
 * @returns {Promise<boolean>} True if match
 */
const comparePassword = async (password, hash) => {
    return bcrypt.compare(password, hash);
};

const generateToken = (user) => {
    const payload = {
        id: user._id,
        email: user.email,
        role: user.role,
        businessId: user.businessId || null
    };

    return jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE || '24h'
    });
};

/**
 * Verify a JWT token
 * @param {string} token - JWT Token
 * @returns {Object} Decoded payload
 */
const verifyToken = (token) => {
    return jwt.verify(token, process.env.JWT_SECRET);
};

/**
 * Generate a random verification token
 * @returns {string} Random hex string
 */
const generateRandomToken = () => {
    return crypto.randomBytes(32).toString('hex');
};

/**
 * Generate a 6-digit OTP
 * @returns {string} 6-digit number as string
 */
const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

module.exports = {
    hashPassword,
    comparePassword,
    generateToken,
    verifyToken,
    generateRandomToken,
    generateOTP
};
