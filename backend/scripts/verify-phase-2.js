require('dotenv').config();
const mongoose = require('mongoose');
const Visitor = require('../src/models/Visitor');
const Business = require('../src/models/Business');

const verifyPhase2 = async () => {
    try {
        console.log('--- Phase 2 Verification ---');

        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✓ Database connected');

        // 1. Verify Visitor Model
        const testVisitor = new Visitor({
            businessId: new mongoose.Types.ObjectId(),
            sessionId: 'test-session-' + Date.now(),
            currentPage: '/home',
            location: { country: 'US', city: 'Test City' }
        });

        await testVisitor.save();
        console.log('✓ Visitor model saved successfully');

        // 2. Verify Business Subscription Updates
        const testBusiness = new Business({
            businessName: 'Test Business ' + Date.now(),
            businessSlug: 'test-business-' + Date.now(),
            industry: 'Technology'
        });

        testBusiness.subscription = {
            plan: 'professional',
            status: 'active',
            stripeCustomerId: 'cus_test123',
            stripeSubscriptionId: 'sub_test123',
            currentPeriodStart: new Date(),
            currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
            features: {
                maxDocuments: 100,
                maxTeamMembers: 10,
                maxConversations: 1000,
                customWidget: true,
                advancedAnalytics: false
            }
        };

        await testBusiness.save();
        console.log('✓ Business model with subscription fields saved successfully');

        // Clean up
        await Visitor.deleteOne({ _id: testVisitor._id });
        await Business.deleteOne({ _id: testBusiness._id });
        console.log('✓ Test data cleaned up');

        console.log('\nAll Phase 2 backend model changes verified successfully!');
        process.exit(0);
    } catch (error) {
        console.error('FAILED:', error);
        process.exit(1);
    }
};

verifyPhase2();
