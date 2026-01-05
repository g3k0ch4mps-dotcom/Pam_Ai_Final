const API_URL = 'http://localhost:3000/api';

async function testBusinessManagement() {
    console.log('🧪 Starting Business Management Verification');

    try {
        // 1. Register a new business to test with
        const timestamp = Date.now();
        const registerData = {
            email: `biz${timestamp}@example.com`,
            password: 'Password123!',
            firstName: 'Biz',
            lastName: 'Owner',
            businessName: `Test Business ${timestamp}`,
            industry: 'Original Industry'
        };

        console.log('\n📝 Registering Test Business...');
        const regRes = await fetch(`${API_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(registerData)
        });

        const regData = await regRes.json();
        if (!regData.success) throw new Error(`Registration failed: ${JSON.stringify(regData)}`);

        const token = regData.token;
        const businessId = regData.business.id;
        const itemsSlug = regData.business.slug;
        console.log(`   Business ID: ${businessId}`);
        console.log(`   Slug: ${itemsSlug}`);

        // 2. Test Get Profile (Protected)
        console.log('\n👤 Testing Get Business Profile...');
        const profileRes = await fetch(`${API_URL}/business/${businessId}/profile`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const profileData = await profileRes.json();

        if (profileData.success && profileData.data._id === businessId) {
            console.log('✅ Get Profile Successful');
        } else {
            throw new Error(`Get Profile Failed: ${JSON.stringify(profileData)}`);
        }

        // 3. Test Update Settings (Owner Only)
        console.log('\n⚙️ Testing Update Settings...');
        const updateData = {
            industry: 'Updated Tech',
            branding: {
                websiteUrl: 'https://example.com'
            },
            chatSettings: {
                welcomeMessage: 'Hello Updated World!'
            }
        };

        const updateRes = await fetch(`${API_URL}/business/${businessId}/settings`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updateData)
        });
        const updateResData = await updateRes.json();

        if (updateResData.success && updateResData.data.industry === 'Updated Tech') {
            console.log('✅ Update Settings Successful');
        } else {
            throw new Error(`Update Settings Failed: ${JSON.stringify(updateResData)}`);
        }

        // 4. Test Public Info (Public Endpoint)
        console.log('\n🌍 Testing Public Business Info...');
        const publicRes = await fetch(`${API_URL}/business/public/${itemsSlug}`);
        const publicData = await publicRes.json();

        if (publicData.success && publicData.data.chatSettings.welcomeMessage === 'Hello Updated World!') {
            console.log('✅ Public Info Retrieval Successful');
        } else {
            throw new Error(`Public Info Failed: ${JSON.stringify(publicData)}`);
        }

        console.log('\n✨ All Business Management Tests Passed!');

    } catch (error) {
        console.error('❌ Test Failed:', error.message);
        process.exit(1);
    }
}

testBusinessManagement();
