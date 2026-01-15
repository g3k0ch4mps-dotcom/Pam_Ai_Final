/**
 * MongoDB Atlas Connection Test
 * Run this to verify your MongoDB Atlas connection is working
 */

require('dotenv').config();
const mongoose = require('mongoose');

async function testMongoDBConnection() {
    console.log('\n' + '='.repeat(60));
    console.log('🔄 Testing MongoDB Atlas Connection...');
    console.log('='.repeat(60) + '\n');

    try {
        // Check if MONGODB_URI exists
        if (!process.env.MONGODB_URI) {
            console.error('❌ ERROR: MONGODB_URI not found in .env file!');
            console.log('\n📝 Please add MONGODB_URI to your .env file:');
            console.log('   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database\n');
            process.exit(1);
        }

        console.log('📝 Connection string found in .env');
        console.log('🔗 Attempting to connect...\n');

        // Connect to MongoDB
        await mongoose.connect(process.env.MONGODB_URI);

        console.log('✅ SUCCESS! Connected to MongoDB Atlas!\n');
        console.log('📊 Connection Details:');
        console.log('   Database Name:', mongoose.connection.db.databaseName);
        console.log('   Host:', mongoose.connection.host);
        console.log('   Port:', mongoose.connection.port || 'default');
        console.log('   Connection State:', mongoose.connection.readyState === 1 ? 'Connected ✅' : 'Not Connected ❌');

        // Test database operations
        console.log('\n🧪 Testing Database Operations...');

        const collections = await mongoose.connection.db.listCollections().toArray();
        console.log(`   Found ${collections.length} collections:`);

        if (collections.length > 0) {
            collections.forEach(col => {
                console.log(`   - ${col.name}`);
            });
        } else {
            console.log('   (No collections yet - this is normal for a new database)');
        }

        console.log('\n✨ MongoDB Atlas is working perfectly!');
        console.log('🎉 Your application can now save data to the cloud!\n');

        // Close connection
        await mongoose.connection.close();
        console.log('👋 Connection closed cleanly\n');
        console.log('='.repeat(60));
        console.log('✅ TEST PASSED - MongoDB Atlas is ready to use!');
        console.log('='.repeat(60) + '\n');

    } catch (error) {
        console.error('\n❌ CONNECTION FAILED!\n');
        console.error('Error Type:', error.name);
        console.error('Error Message:', error.message);

        console.log('\n🔍 Common Issues & Solutions:\n');

        if (error.message.includes('authentication failed') || error.message.includes('bad auth')) {
            console.log('❌ Authentication Error - Wrong username or password');
            console.log('   Solutions:');
            console.log('   1. Check your MongoDB Atlas username');
            console.log('   2. Verify your password is correct');
            console.log('   3. Make sure password doesn\'t have special characters');
            console.log('   4. Try resetting password in MongoDB Atlas\n');
        }
        else if (error.message.includes('ENOTFOUND') || error.message.includes('getaddrinfo')) {
            console.log('❌ Network Error - Cannot reach MongoDB Atlas');
            console.log('   Solutions:');
            console.log('   1. Check your internet connection');
            console.log('   2. Verify cluster URL is correct');
            console.log('   3. Check if cluster is active in MongoDB Atlas\n');
        }
        else if (error.message.includes('IP') || error.message.includes('not authorized')) {
            console.log('❌ IP Whitelist Error - Your IP is not allowed');
            console.log('   Solutions:');
            console.log('   1. Go to MongoDB Atlas → Network Access');
            console.log('   2. Add IP address: 0.0.0.0/0 (allow all)');
            console.log('   3. Wait 1-2 minutes for changes to apply\n');
        }
        else {
            console.log('❌ Unknown Error');
            console.log('   Check your connection string format:');
            console.log('   mongodb+srv://username:password@cluster.mongodb.net/database?options\n');
        }

        console.log('📝 Your current MONGODB_URI (password hidden):');
        const hiddenUri = process.env.MONGODB_URI.replace(/:([^@]+)@/, ':****@');
        console.log('   ' + hiddenUri + '\n');

        console.log('='.repeat(60));
        console.log('❌ TEST FAILED - Please fix the issues above');
        console.log('='.repeat(60) + '\n');

        process.exit(1);
    }
}

// Run the test
testMongoDBConnection();