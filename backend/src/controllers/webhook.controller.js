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
 * Handle Stripe Webhooks
 * @route POST /webhooks/stripe
 */
const handleWebhook = async (req, res) => {
    const sig = req.headers['stripe-signature'];
    let event;

    const stripe = getStripe();
    if (!stripe) {
        logger.error('Stripe webhook received but Stripe is not configured');
        return res.status(503).send('Stripe not configured');
    }

    try {
        event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
    } catch (err) {
        logger.error(`Webhook signature verification failed: ${err.message}`);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    try {
        switch (event.type) {
            case 'checkout.session.completed': {
                const session = event.data.object;
                const businessId = session.metadata.businessId;
                const customerId = session.customer;
                const subscriptionId = session.subscription;

                const stripe = getStripe();
                const subscription = await stripe.subscriptions.retrieve(subscriptionId);

                await updateBusinessSubscription(businessId, customerId, subscription);
                break;
            }
            case 'customer.subscription.updated': {
                const subscription = event.data.object;
                const businessId = subscription.metadata.businessId;
                const customerId = subscription.customer;

                await updateBusinessSubscription(businessId, customerId, subscription);
                break;
            }
            case 'customer.subscription.deleted': {
                const subscription = event.data.object;
                const businessId = subscription.metadata.businessId;

                await Business.findByIdAndUpdate(businessId, {
                    'subscription.status': 'canceled',
                    'subscription.plan': 'free'
                });
                break;
            }
        }

        res.json({ received: true });
    } catch (error) {
        logger.error(`Webhook processing error: ${error.message}`);
        res.status(500).json({ success: false, error: 'Webhook processing failed' });
    }
};

/**
 * Helper to update business subscription data
 */
async function updateBusinessSubscription(businessId, customerId, subscription) {
    const plan = subscription.items.data[0].plan.nickname || 'pro'; // Assuming nickname is set in Stripe

    // Map features based on plan
    const features = {
        maxDocuments: plan === 'enterprise' ? 1000 : plan === 'professional' ? 100 : 20,
        maxTeamMembers: plan === 'enterprise' ? 100 : plan === 'professional' ? 10 : 3,
        maxConversations: plan === 'enterprise' ? 10000 : plan === 'professional' ? 1000 : 500,
        customWidget: plan !== 'starter',
        advancedAnalytics: plan === 'enterprise'
    };

    await Business.findByIdAndUpdate(businessId, {
        'subscription.stripeCustomerId': customerId,
        'subscription.stripeSubscriptionId': subscription.id,
        'subscription.status': subscription.status,
        'subscription.plan': plan,
        'subscription.currentPeriodStart': new Date(subscription.current_period_start * 1000),
        'subscription.currentPeriodEnd': new Date(subscription.current_period_end * 1000),
        'subscription.features': features
    });
}

module.exports = {
    handleWebhook
};
