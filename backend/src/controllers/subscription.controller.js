const Stripe = require('stripe');
const Business = require('../models/Business');
const logger = require('../utils/logger');

// Lazy-loaded Stripe client
let _stripe = null;
const getStripe = () => {
    if (!_stripe && process.env.STRIPE_SECRET_KEY) {
        _stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    }
    return _stripe;
};

/**
 * Create Stripe Checkout Session
 * @route POST /api/business/v1/subscription/checkout
 */
const createCheckoutSession = async (req, res) => {
    try {
        const { planId } = req.body;
        const business = await Business.findById(req.businessId);

        if (!business) {
            return res.status(404).json({ success: false, error: 'Business not found' });
        }

        // Create or get Stripe Customer
        const stripe = getStripe();
        if (!stripe) {
            return res.status(503).json({ success: false, error: 'Stripe is not configured' });
        }

        let customerId = business.subscription.stripeCustomerId;
        if (!customerId) {
            const customer = await stripe.customers.create({
                email: req.user.email,
                name: business.businessName,
                metadata: { businessId: business._id.toString() }
            });
            customerId = customer.id;
            business.subscription.stripeCustomerId = customerId;
            await business.save();
        }

        const session = await stripe.checkout.sessions.create({
            customer: customerId,
            payment_method_types: ['card'],
            line_items: [{
                price: planId, // This should be the Stripe Price ID
                quantity: 1,
            }],
            mode: 'subscription',
            success_url: `${process.env.FRONTEND_URL}/dashboard/settings/billing?success=true`,
            cancel_url: `${process.env.FRONTEND_URL}/dashboard/settings/billing?canceled=true`,
            metadata: { businessId: business._id.toString() }
        });

        res.json({ success: true, url: session.url });
    } catch (error) {
        logger.error(`Checkout session error: ${error.message}`);
        res.status(500).json({ success: false, error: 'Failed to create checkout session' });
    }
};

/**
 * Create Customer Portal Session
 * @route POST /api/business/v1/subscription/portal
 */
const createPortalSession = async (req, res) => {
    try {
        const business = await Business.findById(req.businessId);

        if (!business || !business.subscription.stripeCustomerId) {
            return res.status(400).json({ success: false, error: 'No active subscription or customer record' });
        }

        const stripe = getStripe();
        if (!stripe) {
            return res.status(503).json({ success: false, error: 'Stripe is not configured' });
        }

        const session = await stripe.billingPortal.sessions.create({
            customer: business.subscription.stripeCustomerId,
            return_url: `${process.env.FRONTEND_URL}/dashboard/settings/billing`,
        });

        res.json({ success: true, url: session.url });
    } catch (error) {
        logger.error(`Portal session error: ${error.message}`);
        res.status(500).json({ success: false, error: 'Failed to create portal session' });
    }
};

/**
 * Get subscription info
 * @route GET /api/business/v1/subscription
 */
const getSubscriptionInfo = async (req, res) => {
    try {
        const business = await Business.findById(req.businessId).select('subscription');
        res.json({ success: true, data: business.subscription });
    } catch (error) {
        logger.error(`Get subscription error: ${error.message}`);
        res.status(500).json({ success: false, error: 'Failed to fetch subscription info' });
    }
};

module.exports = {
    createCheckoutSession,
    createPortalSession,
    getSubscriptionInfo
};
