/**
 * Migration Script: Add Roles to Users
 * 
 * Adds 'role', 'businessId', and 'isSystemUser' fields to all existing users.
 * Default role: 'business_owner'
 */

require('dotenv').config({ path: __dirname + '/../../.env' });
const mongoose = require('mongoose');
const User = require('../models/User');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/pam-ai-final';

async function migrateUsers() {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(MONGODB_URI);
        console.log('Connected.');

        const users = await User.find({});
        console.log(`Found ${users.length} users to migrate.`);

        let updatedCount = 0;
        let skipCount = 0;

        for (const user of users) {
            let modified = false;

            // Set default role if missing
            if (!user.role) {
                user.role = 'business_owner';
                modified = true;
            }

            // Set businessId to null explicitly if missing (schema default handles this but good for clarity)
            if (user.businessId === undefined) {
                user.businessId = null;
                modified = true;
            }

            // Set isSystemUser
            if (user.isSystemUser === undefined) {
                user.isSystemUser = false;
                modified = true;
            }

            if (modified) {
                await user.save();
                updatedCount++;
                console.log(`Updated user: ${user.email} -> Role: ${user.role}`);
            } else {
                skipCount++;
            }
        }

        console.log('Migration complete.');
        console.log(`Updated: ${updatedCount}`);
        console.log(`Skipped: ${skipCount}`);

    } catch (error) {
        console.error('Migration failed:', error);
    } finally {
        await mongoose.disconnect();
        console.log('Disconnected.');
    }
}

migrateUsers();
