require('dotenv').config();
const mongoose = require('mongoose');
const Document = require('./src/models/Document');

async function fixDB() {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/business-ai');
        console.log('Connected to MongoDB');

        // 1. Remove empty documents (Content Length 0)
        console.log('\n--- Cleaning Data ---');
        const emptyDocs = await Document.deleteMany({
            $or: [
                { textContent: { $exists: false } },
                { textContent: "" },
                { textContent: null }
            ]
        });
        console.log(`Deleted ${emptyDocs.deletedCount} empty/invalid documents.`);

        // 2. Rebuild Indexes
        console.log('\n--- Rebuilding Indexes ---');

        // Drop existing text index
        try {
            await Document.collection.dropIndex('TextSearchIndex');
            console.log('Dropped "TextSearchIndex"');
        } catch (e) {
            console.log('Index "TextSearchIndex" did not exist (or error):', e.message);
        }

        // Re-create indexes via Mongoose
        await Document.syncIndexes();
        console.log('✅ Indexes synced successfully.');

        // 3. Verifying Index
        const indexes = await Document.collection.getIndexes();
        console.log('\nCurrent Indexes:');
        console.log(Object.keys(indexes));

    } catch (err) {
        console.error('Error:', err);
    } finally {
        await mongoose.disconnect();
    }
}

fixDB();
