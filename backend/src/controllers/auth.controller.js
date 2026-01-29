const User = require('../models/User');
const Business = require('../models/Business');
const authService = require('../services/auth.service');
const { generateUniqueSlug } = require('../utils/slug');
const logger = require('../utils/logger');
const mongoose = require('mongoose');

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
 * Get current user profile
 * @route GET /api/auth/me
 */
const getMe = async (req, res) => {
    try {
        // User is already attached by middleware
        const user = req.user;

        // Fetch business details
        let businessData = null;
        if (req.businessId) {
            const business = await Business.findById(req.businessId);
            if (business) {
                businessData = {
                    id: business._id,
                    name: business.businessName,
                    slug: business.businessSlug,
                    role: req.userRole
                };
            }
        }

        res.json({
            success: true,
            data: {
                user: {
                    id: user._id,
                    email: user.email,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    role: user.role,
                    lastLogin: user.lastLogin
                },
                business: businessData
            }
        });
    } catch (error) {
        logger.error(`Profile fetch error: ${error.message}`);
        res.status(500).json({
            success: false,
            error: {
                code: 'PROFILE_ERROR',
                message: 'Failed to fetch profile'
            }
        });
    }
};

module.exports = {
    registerBusiness,
    login,
    getMe
};
