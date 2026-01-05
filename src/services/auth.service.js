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

/**
 * Generate a JWT token for a user
 * @param {Object} user - User object
 * @param {Object|null} businessMember - BusinessMember object (optional)
 * @returns {string} JWT Token
 */
const generateToken = (user, businessMember = null) => {
    const payload = {
        id: user._id,
        email: user.email,
        roles: businessMember ? [businessMember.role] : [],
        businessId: businessMember ? businessMember.businessId : null
    };

    return jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN || '24h'
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

module.exports = {
    hashPassword,
    comparePassword,
    generateToken,
    verifyToken,
    generateRandomToken
};
