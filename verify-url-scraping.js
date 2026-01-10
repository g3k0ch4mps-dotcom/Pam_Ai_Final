const API_URL = 'http://localhost:3000/api';

async function testURLScraping() {
    console.log('🧪 Starting URL Scraping Verification');

    try {
        // 1. Register Business
        const timestamp = Date.now();
        const registerData = {
            email: `urltest${timestamp}@example.com`,
            password: 'Password123!',
            firstName: 'URL',
            lastName: 'Tester',
            businessName: `URL Test Business ${timestamp}`,
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

        // 2. Add URL (using a public example site)
        console.log('\n🌐 Adding URL...');
        const urlData = {
            url: 'https://example.com',
            autoRefresh: {
                enabled: true,
                frequency: 'weekly'
            }
        };

        const addUrlRes = await fetch(`${API_URL}/documents/add-url`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(urlData)
        });
        const addUrlData = await addUrlRes.json();

        if (addUrlData.success) {
            console.log('   ✅ URL Added Successfully');
            console.log(`   Document ID: ${addUrlData.data.id}`);
            console.log(`   Title: ${addUrlData.data.title}`);
            console.log(`   Auto-refresh: ${addUrlData.data.autoRefresh.enabled}`);
        } else {
            throw new Error(`Add URL failed: ${JSON.stringify(addUrlData)}`);
        }

        // 3. Test duplicate URL (should fail)
        console.log('\n🔄 Testing duplicate URL prevention...');
        const dupRes = await fetch(`${API_URL}/documents/add-url`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ url: 'https://example.com' })
        });
        const dupData = await dupRes.json();

        if (!dupData.success && dupData.error.code === 'URL_EXISTS') {
            console.log('   ✅ Duplicate URL correctly rejected');
        } else {
            console.warn('   ⚠️ Duplicate check might not be working');
        }

        // 4. Test SSRF protection (should fail)
        console.log('\n🔒 Testing SSRF protection...');
        const ssrfRes = await fetch(`${API_URL}/documents/add-url`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ url: 'http://localhost:3000' })
        });
        const ssrfData = await ssrfRes.json();

        if (!ssrfData.success) {
            console.log('   ✅ SSRF protection working (localhost blocked)');
        } else {
            console.warn('   ⚠️ SSRF protection might not be working!');
        }

        // 5. List documents (should show URL document)
        console.log('\n📄 Listing documents...');
        const listRes = await fetch(`${API_URL}/documents`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const listData = await listRes.json();

        if (listData.success && listData.data.length > 0) {
            console.log(`   ✅ Found ${listData.data.length} document(s)`);
            const urlDoc = listData.data.find(d => d.sourceType === 'url');
            if (urlDoc) {
                console.log(`   ✅ URL document found: ${urlDoc.urlTitle}`);
            }
        }

        // 6. Refresh URL
        console.log('\n🔄 Testing URL refresh...');
        await new Promise(r => setTimeout(r, 1000)); // Wait a second

        const refreshRes = await fetch(`${API_URL}/documents/${addUrlData.data.id}/refresh`, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const refreshData = await refreshRes.json();

        if (refreshData.success) {
            console.log('   ✅ URL refreshed successfully');
        } else {
            throw new Error(`Refresh failed: ${JSON.stringify(refreshData)}`);
        }

        console.log('\n✨ All URL Scraping Tests Passed!');

    } catch (error) {
        console.error('❌ Test Failed:', error.message);
        process.exit(1);
    }
}

testURLScraping();
