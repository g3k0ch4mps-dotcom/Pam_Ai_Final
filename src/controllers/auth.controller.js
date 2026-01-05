const User = require('../models/User');
const Business = require('../models/Business');
const BusinessMember = require('../models/BusinessMember');
const authService = require('../services/auth.service');
const logger = require('../utils/logger');
const mongoose = require('mongoose');

/**
 * Register a new business and owner
 * @route POST /api/auth/register
 */
const registerBusiness = async (req, res) => {
    try {
        const { email, password, firstName, lastName, businessName, industry } = req.body;

        logger.info(`Starting registration for: ${email}, Business: ${businessName}`);

        // 1. Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({
                success: false,
                error: {
                    code: 'EMAIL_EXISTS',
                    message: 'Email is already registered'
                }
            });
        }

        // 2. Create User
        const hashedPassword = await authService.hashPassword(password);
        // Use create() checks or singular document creation without session
        const user = await User.create({
            email,
            passwordHash: hashedPassword,
            firstName,
            lastName,
            isEmailVerified: false
        });

        // 3. Create Business
        // Generate slug from business name
        let businessSlug = businessName.toLowerCase().replace(/[^a-z0-9]/g, '-');
        // Ensure slug is unique (simple implementation)
        const existingSlug = await Business.findOne({ businessSlug });
        if (existingSlug) {
            businessSlug = `${businessSlug}-${Date.now()}`;
        }

        const business = await Business.create({
            businessName,
            businessSlug,
            industry,
            subscriptionStatus: 'free'
        });

        // 4. Create BusinessMember relationship
        await BusinessMember.create({
            userId: user._id,
            businessId: business._id,
            role: 'owner'
        });

        logger.info(`✓ Registration successful for ${email}`);

        // 5. Generate Token
        const member = {
            businessId: business._id,
            role: 'owner'
        };
        const token = authService.generateToken(user, member);

        res.status(201).json({
            success: true,
            token,
            user: {
                id: user._id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName
            },
            business: {
                id: business._id,
                name: business.businessName,
                slug: business.businessSlug,
                role: 'owner'
            }
        });

    } catch (error) {
        logger.error(`Registration error: ${error.message}`);
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

        // 3. Find primary business membership (for now just take the first one)
        const membership = await BusinessMember.findOne({ userId: user._id }).sort({ createdAt: 1 });

        // 4. Generate Token
        const token = authService.generateToken(user, membership);

        // 5. Get Business Details if member exists
        let businessData = null;
        if (membership) {
            const business = await Business.findById(membership.businessId);
            if (business) {
                businessData = {
                    id: business._id,
                    name: business.businessName,
                    slug: business.businessSlug,
                    role: membership.role
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
                lastName: user.lastName
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
