const express = require('express');
const subscriptionController = require('../controllers/subscription.controller');
const { authenticate } = require('../middleware/auth.middleware');
const { restrictTo } = require('../middleware/auth.middleware');

const router = express.Router();

// All routes require authentication
router.use(authenticate);

router.post('/checkout', subscriptionController.createCheckoutSession);
router.post('/portal', subscriptionController.createPortalSession);
router.get('/', subscriptionController.getSubscriptionInfo);

module.exports = router;
