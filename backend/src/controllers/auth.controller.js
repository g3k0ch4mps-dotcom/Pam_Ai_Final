const User = require('../models/User');
const Business = require('../models/Business');
const authService = require('../services/auth.service');
const emailService = require('../services/email.service');
const { generateUniqueSlug } = require('../utils/slug');
const logger = require('../utils/logger');
const mongoose = require('mongoose');
const { OAuth2Client } = require('google-auth-library');
const crypto = require('crypto');

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

/**
 * Register a new business and owner
 * @route POST /api/auth/register
 */
const registerBusiness = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        const { email, password, firstName, lastName, businessName, industry } = req.body;

        logger.info(`Starting registration for: ${email}, Business: ${businessName}`);

        // 1. Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            await session.abortTransaction();
            session.endSession();
            return res.status(409).json({
                success: false,
                error: {
                    code: 'EMAIL_EXISTS',
                    message: 'Email is already registered'
                }
            });
        }

        // 2. Create Business First
        const businessSlug = await generateUniqueSlug(businessName, Business);
        const business = await Business.create([{
            businessName,
            businessSlug,
            industry,
            subscriptionStatus: 'free'
        }], { session });

        // 3. Create User with role and businessId
        const hashedPassword = await authService.hashPassword(password);
        const user = await User.create([{
            email,
            passwordHash: hashedPassword,
            firstName,
            lastName,
            role: 'business_owner',
            businessId: business[0]._id,
            isEmailVerified: false
        }], { session });

        await session.commitTransaction();
        session.endSession();

        logger.info(`✓ Registration successful for ${email}`);

        // 4. Generate Token
        const token = authService.generateToken(user[0]);

        res.status(201).json({
            success: true,
            token,
            user: {
                id: user[0]._id,
                email: user[0].email,
                firstName: user[0].firstName,
                lastName: user[0].lastName,
                role: user[0].role
            },
            business: {
                id: business[0]._id,
                name: business[0].businessName,
                slug: business[0].businessSlug
            }
        });

    } catch (error) {
        if (session.inTransaction()) {
            await session.abortTransaction();
        }
        session.endSession();
        logger.error(`Registration error: ${error.message}`);
        logger.error(`Error stack: ${error.stack}`);

        // Handle Mongoose validation errors specifically
        if (error.name === 'ValidationError') {
            const validationErrors = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({
                success: false,
                error: {
                    code: 'VALIDATION_ERROR',
                    message: 'Validation failed',
                    details: validationErrors
                }
            });
        }

        res.status(500).json({
            success: false,
            error: {
                code: 'REGISTRATION_FAILED',
                message: 'Failed to complete registration',
                details: process.env.NODE_ENV === 'development' ? error.message : undefined
            }
        });
    }
};

/**
 * Login user
 * @route POST /api/auth/login
 */
const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // 1. Find user (select passwordHash explicitly)
        const user = await User.findOne({ email }).select('+passwordHash');

        if (!user || !(await authService.comparePassword(password, user.passwordHash))) {
            return res.status(401).json({
                success: false,
                error: {
                    code: 'INVALID_CREDENTIALS',
                    message: 'Invalid email or password'
                }
            });
        }

        // 2. Update last login
        user.lastLogin = new Date();
        await user.save();

        // 3. Generate Token
        const token = authService.generateToken(user);

        // 4. Get Business Details if user has businessId
        let businessData = null;
        if (user.businessId) {
            const business = await Business.findById(user.businessId);
            if (business) {
                businessData = {
                    id: business._id,
                    name: business.businessName,
                    slug: business.businessSlug,
                    role: user.role
                };
            }
        }

        res.json({
            success: true,
            token,
            user: {
                id: user._id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                role: user.role
            },
            business: businessData
        });

    } catch (error) {
        logger.error(`Login error: ${error.message}`);
        res.status(500).json({
            success: false,
            error: {
                code: 'LOGIN_FAILED',
                message: 'Login failed',
                details: process.env.NODE_ENV === 'development' ? error.message : undefined
            }
        });
    }
};

/**
 * Google OAuth Login/Register
 * @route POST /api/auth/google
 */
const googleLogin = async (req, res) => {
    try {
        const { idToken } = req.body;

        const ticket = await client.verifyIdToken({
            idToken,
            audience: process.env.GOOGLE_CLIENT_ID,
        });

        const { email, sub: googleId, given_name: firstName, family_name: lastName } = ticket.getPayload();

        let user = await User.findOne({ email });

        if (!user) {
            // New user from Google
            user = new User({
                email,
                googleId,
                firstName,
                lastName,
                role: 'business_owner', // Default role for new signups
                isEmailVerified: true, // Google emails are verified
                passwordHash: await authService.hashPassword(crypto.randomBytes(16).toString('hex')) // Dummy password
            });
            await user.save();
        } else if (!user.googleId) {
            // Existing user linking Google
            user.googleId = googleId;
            user.isEmailVerified = true;
            await user.save();
        }

        const token = authService.generateToken(user);

        res.json({
            success: true,
            token,
            user: {
                id: user._id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                role: user.role
            }
        });
    } catch (error) {
        logger.error(`Google login error: ${error.message}`);
        res.status(500).json({ success: false, error: 'Google authentication failed' });
    }
};

/**
 * Request Email OTP
 * @route POST /api/auth/request-otp
 */
const requestOTP = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ success: false, error: 'User not found' });
        }

        const otp = authService.generateOTP();
        user.otpSecret = otp;
        user.otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
        await user.save();

        await emailService.sendVerificationEmail(email, otp);

        res.json({ success: true, message: 'OTP sent to email' });
    } catch (error) {
        logger.error(`OTP request error: ${error.message}`);
        res.status(500).json({ success: false, error: 'Failed to send OTP' });
    }
};

/**
 * Verify Email OTP
 * @route POST /api/auth/verify-otp
 */
const verifyOTP = async (req, res) => {
    try {
        const { email, otp } = req.body;
        const user = await User.findOne({ email });

        if (!user || user.otpSecret !== otp || user.otpExpires < new Date()) {
            return res.status(400).json({ success: false, error: 'Invalid or expired OTP' });
        }

        user.isEmailVerified = true;
        user.otpSecret = undefined;
        user.otpExpires = undefined;
        await user.save();

        res.json({ success: true, message: 'Email verified successfully' });
    } catch (error) {
        logger.error(`OTP verification error: ${error.message}`);
        res.status(500).json({ success: false, error: 'Failed to verify OTP' });
    }
};

/**
 * Verify Email via Token
 * @route GET /api/auth/verify-email/:token
 */
const verifyEmail = async (req, res) => {
    try {
        const { token } = req.params;
        const user = await User.findOne({
            emailVerificationToken: token,
            emailVerificationExpires: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({ success: false, error: 'Invalid or expired verification token' });
        }

        user.isEmailVerified = true;
        user.emailVerificationToken = undefined;
        user.emailVerificationExpires = undefined;
        await user.save();

        res.json({ success: true, message: 'Email verified successfully' });
    } catch (error) {
        logger.error(`Email verification error: ${error.message}`);
        res.status(500).json({ success: false, error: 'Failed to verify email' });
    }
};

/**
 * Get current user profile and business
 * @route GET /api/auth/me
 */
const getMe = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({
                success: false,
                error: {
                    code: 'USER_NOT_FOUND',
                    message: 'User not found'
                }
            });
        }

        let business = null;
        if (user.businessId) {
            business = await Business.findById(user.businessId);
        }

        res.json({
            success: true,
            data: {
                user: {
                    id: user._id,
                    email: user.email,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    role: user.role
                },
                business: business ? {
                    id: business._id,
                    businessName: business.businessName,
                    businessSlug: business.businessSlug
                } : null
            }
        });
    } catch (error) {
        logger.error(`GetMe error: ${error.message}`);
        res.status(500).json({
            success: false,
            error: {
                code: 'SERVER_ERROR',
                message: 'Failed to retrieve profile'
            }
        });
    }
};

module.exports = {
    registerBusiness,
    login,
    getMe,
    googleLogin,
    requestOTP,
    verifyOTP,
    verifyEmail
};
