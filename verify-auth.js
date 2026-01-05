const API_URL = 'http://localhost:3000/api';

async function testAuth() {
    console.log('🧪 Starting Authentication System Verification');

    // 1. Test Registration
    try {
        const timestamp = Date.now();
        const registerData = {
            email: `test${timestamp}@example.com`,
            password: 'Password123!',
            firstName: 'Test',
            lastName: 'User',
            businessName: `Test Business ${timestamp}`,
            industry: 'Technology'
        };

        console.log('\n📝 Testing Registration...');
        const regRes = await fetch(`${API_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(registerData)
        });

        const regData = await regRes.json();

        if (regData.success && regData.token) {
            console.log('✅ Registration Successful');
            console.log(`   User: ${regData.user.email}`);
            console.log(`   Business: ${regData.business.name} (${regData.business.role})`);
        } else {
            console.error('❌ Registration Failed:', regData);
            process.exit(1);
        }

        const token = regData.token;

        // 2. Test Login
        console.log('\n🔐 Testing Login...');
        const loginRes = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: registerData.email,
                password: registerData.password
            })
        });

        const loginData = await loginRes.json();

        if (loginData.success && loginData.token) {
            console.log('✅ Login Successful');
        } else {
            console.error('❌ Login Failed:', loginData);
            process.exit(1);
        }

        // 3. Test Protected Route (Get Me)
        console.log('\n👤 Testing Protected Route (Get Profile)...');
        const meRes = await fetch(`${API_URL}/auth/me`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        const meData = await meRes.json();

        if (meData.success) {
            console.log('✅ Protected Route Access Successful');
            console.log(`   Profile: ${meData.data.user.firstName} ${meData.data.user.lastName}`);
        } else {
            console.error('❌ Protected Route Failed:', meData);
            process.exit(1);
        }

        console.log('\n✨ All Auth Tests Passed!');

    } catch (error) {
        console.error('❌ Test Failed:', error);
        process.exit(1);
    }
}

testAuth();
