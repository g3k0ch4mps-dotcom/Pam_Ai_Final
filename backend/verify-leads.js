require('dotenv').config();
const mongoose = require('mongoose');
const Lead = require('./src/models/Lead');
const leadService = require('./src/services/lead.service');

async function verifyLeads() {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/business-ai');
        console.log('Connected to MongoDB');

        // Mock Data
        const businessId = new mongoose.Types.ObjectId();
        const businessSlug = 'test-business';
        const sessionId = `test-session-${Date.now()}`;

        console.log(`\n1. Creating Lead for Session: ${sessionId}`);
        const lead = await leadService.findOrCreateLead(businessId, businessSlug, sessionId);
        console.log(`   ✅ Lead created: ${lead._id}`);

        console.log('\n2. Simulating Chat Interaction');
        await leadService.addChatMessage(sessionId, 'user', 'How much is a haircut?');
        await leadService.addInterest(sessionId, 'haircut');
        await leadService.addInterest(sessionId, 'pricing'); // duplicate check?
        await leadService.addInterest(sessionId, 'Pricing'); // case check?
        console.log('   ✅ Chat & Interests added');

        console.log('\n3. Simulating Form Submission');
        const updatedLead = await leadService.updateContactInfo(sessionId, {
            name: 'John Doe',
            email: 'john@example.com',
            phone: '555-0199'
        });
        console.log(`   ✅ Lead updated: ${updatedLead.name} (${updatedLead.email})`);
        console.log(`   ✅ Score: ${updatedLead.leadScore}`);

        if (updatedLead.leadScore < 30) {
            console.error('❌ Lead score too low? Should be at least 30+10+20 + interests');
        }

        console.log('\n4. Verifying Search/Filter');
        const leads = await leadService.getBusinessLeads(businessId, { hasEmail: true });
        if (leads.length > 0 && leads[0].email === 'john@example.com') {
            console.log('   ✅ Lead found via filter');
        } else {
            console.error('❌ Lead not found via filter');
        }

        // Cleanup
        await Lead.deleteOne({ _id: lead._id });
        console.log('\n✨ Verification Complete & Cleaned Up');

    } catch (err) {
        console.error('❌ Verification Failed:', err);
    } finally {
        await mongoose.disconnect();
    }
}

verifyLeads();
