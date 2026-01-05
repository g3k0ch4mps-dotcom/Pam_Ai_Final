const fs = require('fs');
const path = require('path');

const API_URL = 'http://localhost:3000/api';

async function testDocumentPipeline() {
    console.log('🧪 Starting Document Pipeline Verification');

    try {
        // 1. Register Business
        const timestamp = Date.now();
        const registerData = {
            email: `docuser${timestamp}@example.com`,
            password: 'Password123!',
            firstName: 'Doc',
            lastName: 'User',
            businessName: `Doc Business ${timestamp}`,
            industry: 'Research'
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
        console.log(`   Business ID: ${regData.business.id}`);

        // 2. Upload Document
        console.log('\n📤 Uploading Document...');
        // Create a dummy file if it doesn't exist
        const testFile = path.join(__dirname, 'test_document.txt');
        if (!fs.existsSync(testFile)) {
            fs.writeFileSync(testFile, 'Important unique keyword: ZEBRA123. This is a secret business plan.');
        }

        const fileContent = fs.readFileSync(testFile);
        const blob = new Blob([fileContent], { type: 'text/plain' });

        const formData = new FormData();
        formData.append('document', blob, 'test_document.txt');

        const uploadRes = await fetch(`${API_URL}/documents/upload`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`
            },
            body: formData
        });

        const uploadData = await uploadRes.json();
        if (!uploadData.success) {
            throw new Error(`Upload Failed: ${JSON.stringify(uploadData)}`);
        }
        console.log(`✅ Upload Successful: ${uploadData.data.filename}`);
        const docId = uploadData.data.id;

        // 3. Search Document
        console.log('\n🔍 Testing Text Search...');

        let searchData = null;
        let attempts = 0;
        while (attempts < 5) {
            attempts++;
            // Allow some time for indexing
            await new Promise(r => setTimeout(r, 2000));

            console.log(`   Attempt ${attempts}/5...`);
            const searchRes = await fetch(`${API_URL}/documents/search?q=ZEBRA123`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await searchRes.json();

            if (data.success && data.data.length > 0) {
                searchData = data;
                break;
            }
        }

        if (searchData) {
            console.log('✅ Search Successful: Found document with keyword "ZEBRA123"');
            console.log(`   Score: ${searchData.data[0].score}`);
        } else {
            throw new Error(`Search Failed: Document not found after 5 attempts.`);
        }

        // 4. List Documents
        console.log('\n📋 Testing List Documents...');
        const listRes = await fetch(`${API_URL}/documents`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const listData = await listRes.json();

        if (listData.success && listData.data.length > 0) {
            console.log(`✅ List Successful: ${listData.data.length} document(s) found`);
        } else {
            throw new Error(`List Failed: ${JSON.stringify(listData)}`);
        }

        // 5. Delete Document
        console.log('\n🗑️ Testing Delete Document...');
        const delRes = await fetch(`${API_URL}/documents/${docId}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const delData = await delRes.json();

        if (delData.success) {
            console.log('✅ Delete Successful');
        } else {
            throw new Error(`Delete Failed: ${JSON.stringify(delData)}`);
        }

        console.log('\n✨ All Document Pipeline Tests Passed!');

    } catch (error) {
        console.error('❌ Test Failed:', error.message);
        if (error.cause) console.error(error.cause);
        process.exit(1);
    }
}

testDocumentPipeline();
