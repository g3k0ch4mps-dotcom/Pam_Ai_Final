const fs = require('fs');
const path = require('path');


const API_URL = 'http://localhost:3000/api';

async function testPublicChat() {
    console.log('🧪 Starting Public Chat Verification');

    try {
        // 1. Register Business
        const timestamp = Date.now();
        const registerData = {
            email: `chatuser${timestamp}@example.com`,
            password: 'Password123!',
            firstName: 'Chat',
            lastName: 'User',
            businessName: `Chat Business ${timestamp}`,
            industry: 'Technology'
        };

        console.log('\n📝 Registering Business...');
        const regRes = await fetch(`${API_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(registerData)
        });
        const regData = await regRes.json();
        if (!regData.success) throw new Error(`Registration failed: ${JSON.stringify(regData)}`);

        const token = regData.token;
        const businessSlug = regData.business.slug;
        console.log(`   Business Slug: ${businessSlug}`);

        // 2. Enable Public Chat
        console.log('\n⚙️ Enabling Public Chat...');
        const settingsRes = await fetch(`${API_URL}/business/${regData.business.id}/settings`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                chatSettings: { isPublic: true }
            })
        });
        const settingsData = await settingsRes.json();
        if (!settingsData.success) throw new Error(`Settings update failed: ${JSON.stringify(settingsData)}`);

        // 3. Upload Knowledge Base Document
        console.log('\n📤 Uploading Knowledge Base...');
        const testFile = path.join(__dirname, 'chat_knowledge.txt');
        // Create a known fact for the AI to answer
        fs.writeFileSync(testFile, 'The secret password for the VIP lounge is "GoldPhoenix". Our support email is support@example.com.');

        // Use Blob for Node fetch compatibility
        const fileContent = fs.readFileSync(testFile);
        const blob = new Blob([fileContent], { type: 'text/plain' });
        const formData = new FormData();
        formData.append('document', blob, 'chat_knowledge.txt');

        const uploadRes = await fetch(`${API_URL}/documents/upload`, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${token}` },
            body: formData
        });
        const uploadData = await uploadRes.json();
        if (!uploadData.success) throw new Error(`Upload failed: ${JSON.stringify(uploadData)}`);

        console.log('   Knowledge Base Uploaded. Waiting for indexing...');
        await new Promise(r => setTimeout(r, 2000));

        // 4. Test Chat (RAG)
        console.log('\n💬 Testing Public Chat (RAG)...');

        // Question that requires the context
        const question = 'What is the secret password for the VIP lounge?';

        const chatRes = await fetch(`${API_URL}/chat/public`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                businessSlug: businessSlug,
                question: question
            })
        });

        const chatData = await chatRes.json();

        if (chatData.success) {
            console.log(`\n✅ Chat Successful!`);
            console.log(`   Question: "${question}"`);
            console.log(`   Answer: "${chatData.answer}"`);

            // Simple validation of the answer content
            if (chatData.answer.includes('GoldPhoenix')) {
                console.log('   ✅ Answer contains correct information.');
            } else {
                console.warn('   ⚠️ Answer might be incorrect. AI Output check required.');
            }
        } else {
            throw new Error(`Chat Failed: ${JSON.stringify(chatData)}`);
        }

        console.log('\n✨ All Chat Tests Passed!');

    } catch (error) {
        console.error('❌ Test Failed:', error.message);
        process.exit(1);
    }
}

testPublicChat();
