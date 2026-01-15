/**
 * Lead Capture Flow Test
 * This script demonstrates how leads are captured through the chat widget
 */

require('dotenv').config();
const mongoose = require('mongoose');
const Business = require('./src/models/Business');
const Lead = require('./src/models/Lead');
const leadService = require('./src/services/lead.service');

async function testLeadCaptureFlow() {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/business-ai');
        console.log('✅ Connected to MongoDB\n');

        // Find or create a test business
        let business = await Business.findOne({ businessSlug: 'mamuza-engineering' });
        if (!business) {
            console.log('⚠️  Business not found. Please register a business first.');
            process.exit(0);
        }

        console.log(`📊 Testing Lead Capture for: ${business.businessName}\n`);
        console.log('='.repeat(60));

        // STEP 1: User starts chatting (automatic lead creation)
        console.log('\n🎯 STEP 1: User Starts Chat Session');
        console.log('-'.repeat(60));
        const sessionId = `demo-session-${Date.now()}`;
        const lead = await leadService.findOrCreateLead(
            business._id,
            business.businessSlug,
            sessionId
        );
        console.log(`✅ Lead created automatically with sessionId: ${sessionId}`);
        console.log(`   Lead ID: ${lead._id}`);
        console.log(`   Initial Score: ${lead.leadScore}/100`);

        // STEP 2: User asks questions (interest tracking)
        console.log('\n💬 STEP 2: User Asks Questions');
        console.log('-'.repeat(60));

        const questions = [
            "What programs do you offer?",
            "How much does the engineering course cost?",
            "Do you have weekend classes?"
        ];

        for (const question of questions) {
            console.log(`   User: "${question}"`);

            // Add to chat history
            await leadService.addChatMessage(sessionId, 'user', question);

            // Extract and add interests
            const interests = leadService.extractInterests(question);
            for (const interest of interests) {
                await leadService.addInterest(sessionId, interest);
            }

            // Simulate AI response
            await leadService.addChatMessage(
                sessionId,
                'assistant',
                'Great question! Let me help you with that...'
            );
        }

        const updatedLead = await leadService.getLeadBySession(sessionId);
        console.log(`\n   ✅ Tracked ${updatedLead.questions.length} questions`);
        console.log(`   ✅ Detected interests: ${updatedLead.interests.join(', ')}`);
        console.log(`   ✅ Chat history: ${updatedLead.chatHistory.length} messages`);
        console.log(`   📊 Current Score: ${updatedLead.leadScore}/100`);

        // STEP 3: AI triggers lead capture form
        console.log('\n🎨 STEP 3: AI Detects Interest & Shows Form');
        console.log('-'.repeat(60));
        console.log('   AI Response: "Our engineering courses start at $500."');
        console.log('   AI Response: "I can send you details! <LEAD_CAPTURE_TRIGGER>"');
        console.log('   ✅ Form appears in chat widget');

        // STEP 4: User submits contact info
        console.log('\n📝 STEP 4: User Fills Out Form');
        console.log('-'.repeat(60));
        const contactInfo = {
            name: 'Sarah Johnson',
            email: 'sarah.johnson@example.com',
            phone: '+1-555-0123'
        };

        console.log(`   Name: ${contactInfo.name}`);
        console.log(`   Email: ${contactInfo.email}`);
        console.log(`   Phone: ${contactInfo.phone}`);

        const finalLead = await leadService.updateContactInfo(sessionId, contactInfo);
        console.log(`\n   ✅ Contact info saved`);
        console.log(`   📊 Final Score: ${finalLead.leadScore}/100`);

        // STEP 5: Show what business owner sees
        console.log('\n👔 STEP 5: Business Owner Views Dashboard');
        console.log('-'.repeat(60));
        console.log('   Dashboard → Leads Tab shows:');
        console.log(`   
   ┌─────────────────────────────────────────────────────────┐
   │ Name: ${finalLead.name || 'Anonymous'}
   │ Email: ${finalLead.email || 'Not provided'}
   │ Phone: ${finalLead.phone || 'Not provided'}
   │ Score: ${finalLead.leadScore}/100 ${finalLead.leadScore >= 70 ? '🔥 HOT LEAD!' : ''}
   │ Status: ${finalLead.status}
   │ Interests: ${finalLead.interests.join(', ')}
   │ Questions: ${finalLead.questions.length}
   │ First Contact: ${finalLead.firstContact.toLocaleString()}
   │ Last Contact: ${finalLead.lastContact.toLocaleString()}
   └─────────────────────────────────────────────────────────┘
        `);

        console.log('\n   💬 Full Chat History Available:');
        finalLead.chatHistory.slice(0, 3).forEach((msg, i) => {
            console.log(`      ${msg.role === 'user' ? '👤' : '🤖'} ${msg.role}: ${msg.message.substring(0, 50)}...`);
        });

        // Cleanup
        console.log('\n🧹 Cleaning up test data...');
        await Lead.deleteOne({ _id: finalLead._id });
        console.log('✅ Test complete!\n');

        console.log('='.repeat(60));
        console.log('📚 KEY TAKEAWAYS:');
        console.log('   1. Leads are created automatically when users start chatting');
        console.log('   2. Every question and interest is tracked');
        console.log('   3. AI triggers the form when it detects buying intent');
        console.log('   4. Lead score increases as users engage more');
        console.log('   5. Business owners see everything in the Dashboard');
        console.log('='.repeat(60));

    } catch (error) {
        console.error('❌ Test failed:', error.message);
    } finally {
        await mongoose.disconnect();
    }
}

testLeadCaptureFlow();
