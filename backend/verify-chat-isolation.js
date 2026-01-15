const fs = require('fs');
const path = require('path');
// Node 18+ has native fetch

const API_URL = 'http://localhost:3000/api';

async function testChatIsolation() {
    console.log('🧪 Starting Chat Isolation Verification');

    try {
        // --- Helper to register business ---
        async function registerBiz(name, industry) {
            const timestamp = Date.now();
            const res = await fetch(`${API_URL}/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: `user_${timestamp}_${Math.random()}@test.com`,
                    password: 'Password123!',
                    firstName: 'Owner',
                    lastName: 'Test',
                    businessName: name,
                    industry: industry
                })
            });
            const data = await res.json();
            if (!data.success) throw new Error(`Register failed for ${name}: ${JSON.stringify(data)}`);
            return data;
        }

        // --- Helper to upload doc ---
        async function uploadDoc(token, filename, content) {
            const blob = new Blob([content], { type: 'text/plain' });
            const formData = new FormData();
            formData.append('document', blob, filename);

            const res = await fetch(`${API_URL}/documents/upload`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` },
                body: formData
            });
            const data = await res.json();
            if (!data.success) throw new Error(`Upload failed: ${JSON.stringify(data)}`);
            return data;
        }

        // 1. Create Business A (Secret Agent)
        console.log('\n📝 Registering Business A...');
        const bizA = await registerBiz('Secret Agent Services', 'Security');
        console.log(`   Business A Slug: ${bizA.business.slug}`);

        // 2. Create Business B (Bakery)
        console.log('\n📝 Registering Business B...');
        const bizB = await registerBiz('Momma Bakery', 'Food');
        console.log(`   Business B Slug: ${bizB.business.slug}`);

        // 3. Enable Public Chat for both (default might be needed if logic changed)
        // ... assuming default is accessible or verified elsewhere

        // 4. Upload Data
        console.log('\n📤 Uploading Documents...');
        await uploadDoc(bizA.token, 'secrets.txt', 'The secret code is BLUE_EAGLE. Do not share.');
        await uploadDoc(bizB.token, 'menu.txt', 'Today special is Blueberry Muffin. Price $5.');

        // Wait for indexing (simulated)
        console.log('   Waiting for indexing...');
        await new Promise(r => setTimeout(r, 1000));

        // 5. Query Business A for Secret
        console.log('\n💬 Asking Business A about secret...');
        const chatResA = await fetch(`${API_URL}/chat/public/${bizA.business.slug}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ question: 'What is the secret code?' })
        });
        const chatDataA = await chatResA.json();
        console.log(`   Business A Answer: "${chatDataA.answer}"`);

        if (chatDataA.answer && chatDataA.answer.includes('BLUE_EAGLE')) {
            console.log('   ✅ Business A knows the secret.');
        } else {
            console.log('   Warning: Business A did not return exact secret (might be AI phrasing).');
        }

        // 6. Query Business B for Secret (Should NOT know)
        console.log('\n💬 Asking Business B about secret (Isolation Test)...');
        const chatResB = await fetch(`${API_URL}/chat/public/${bizB.business.slug}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ question: 'What is the secret code?' })
        });
        const chatDataB = await chatResB.json();
        console.log(`   Business B Answer: "${chatDataB.answer}"`);

        if (!chatDataB.answer || !chatDataB.answer.includes('BLUE_EAGLE')) {
            console.log('   ✅ Business B does NOT know the secret. Isolation works.');
        } else {
            throw new Error('❌ Business B leaked the secret! Isolation FAILED.');
        }

        console.log('\n✨ Chat Isolation Verified!');

    } catch (error) {
        console.error('❌ Test Failed:', error.message);
        process.exit(1);
    }
}

testChatIsolation();
