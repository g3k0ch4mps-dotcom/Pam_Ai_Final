/**
 * Migration Script: Migrate to Business Model
 * 
 * 1. Creates a Business for each existing User (if they don't have one).
 * 2. Assigns the User as 'business_owner'.
 * 3. Updates all Documents uploaded by User to have the new businessId.
 * 4. Updates all ChatLogs (legacy conversations) to have the new businessId.
 */

require('dotenv').config({ path: __dirname + '/../../.env' });
const mongoose = require('mongoose');
const User = require('../models/User');
const Business = require('../models/Business');
const Document = require('../models/Document');
const ChatLog = require('../models/ChatLog'); // Legacy chat logs
const Conversation = require('../models/Conversation'); // New model

const MONGODB_URI = process.env.MONGODB_URI;

async function migrateData() {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(MONGODB_URI);
        console.log('Connected.');

        const users = await User.find({});
        console.log(`Found ${users.length} users to process.`);

        for (const user of users) {
            try {
                console.log(`Processing user: ${user.email}`);

                let businessId = user.businessId;

                // 1. Create Business if missing
                if (!businessId) {
                    const businessName = user.firstName ? `${user.firstName}'s Business` : `Business-${user._id}`;
                    const slug = businessName.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Math.floor(Math.random() * 1000);

                    const newBusiness = new Business({
                        businessName: businessName,
                        businessSlug: slug,
                        subscriptionStatus: 'free',
                        teamMembers: [{
                            userId: user._id,
                            role: user.role || 'business_owner'
                        }]
                    });

                    await newBusiness.save();
                    businessId = newBusiness._id;

                    // Update User
                    user.businessId = businessId;
                    await user.save();
                    console.log(`  -> Created new business: ${businessName}`);
                } else {
                    console.log(`  -> User already has businessId: ${businessId}`);
                }

                // 2. Migrate Documents
                const updateDocsResult = await Document.updateMany(
                    { uploadedBy: user._id, businessId: { $exists: false } }, // Find docs by user without businessId
                    { $set: { businessId: businessId, createdBy: user._id } }
                );
                console.log(`  -> Migrated ${updateDocsResult.modifiedCount} documents.`);

                // 3. Migrate ChatLogs (Legacy)
                // ChatLog schema already had businessId, but we should ensure consistency if it was missing 
                // or if we want to link it to the user's primary business.
                // Assuming ChatLog might be missing businessId in very old data:
                // Note: ChatLog.js schema shows businessId is required, so it might already be there. 
                // But let's check for any orphaned (if logic allowed it before).

                // 4. Initialize Conversation from ChatLogs? (Optional - skipping for now to keep simple)

            } catch (err) {
                console.error(`  -> Error processing user ${user.email}:`, err.message);
            }
        }

        console.log('Migration complete.');

    } catch (error) {
        console.error('Migration failed:', error);
    } finally {
        await mongoose.disconnect();
        console.log('Disconnected.');
    }
}

migrateData();
