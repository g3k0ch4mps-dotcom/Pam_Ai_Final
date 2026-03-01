require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../src/models/User');
const Conversation = require('../src/models/Conversation');
const { generateOTP } = require('../src/services/auth.service');

const verifyPhase1 = async () => {
    try {
        console.log('--- Phase 1 Verification ---');

        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✓ Database connected');

        // 1. Verify User Model Updates
        const testUser = new User({
            email: 'test' + Date.now() + '@example.com',
            firstName: 'Test',
            lastName: 'User',
            passwordHash: 'dummy',
            role: 'business_owner'
        });

        testUser.googleId = 'google_' + Date.now();
        testUser.otpSecret = generateOTP();
        testUser.otpExpires = new Date(Date.now() + 10000);

        await testUser.save();
        console.log('✓ User model with Google and OTP fields saved');

        // 2. Verify Conversation Model Updates (Ticketing)
        const testTicket = new Conversation({
            businessId: new mongoose.Types.ObjectId(),
            createdBy: testUser._id,
            isTicket: true,
            ticketNumber: 'TICKET-TEST-001',
            status: 'open',
            priority: 'urgent',
            customerName: 'Test Customer'
        });

        await testTicket.save();
        console.log('✓ Conversation model with ticketing fields saved');

        // Clean up
        await User.deleteOne({ _id: testUser._id });
        await Conversation.deleteOne({ _id: testTicket._id });
        console.log('✓ Test data cleaned up');

        console.log('\nAll Phase 1 backend model changes verified successfully!');
        process.exit(0);
    } catch (error) {
        console.error('FAILED:', error);
        process.exit(1);
    }
};

verifyPhase1();
