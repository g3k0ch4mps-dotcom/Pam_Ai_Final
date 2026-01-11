require('dotenv').config();
const mongoose = require('mongoose');
const Document = require('./src/models/Document');
const Business = require('./src/models/Business');

async function checkContent() {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/business-ai');
        console.log('Connected to MongoDB');

        const slug = 'mamuza-engineering';
        const business = await Business.findOne({ businessSlug: slug });

        if (!business) {
            console.log(`❌ Business '${slug}' not found!`);
            return;
        }
        console.log(`✅ Business found: ${business.businessName} (${business._id})`);

        const docs = await Document.find({ businessId: business._id });
        console.log(`\nFound ${docs.length} documents.`);

        if (docs.length === 0) {
            console.log('⚠️ No documents found. This is why search returns nothing.');
        } else {
            console.log('Documents:');
            docs.forEach(d => {
                console.log(`- [${d.type}] ${d.originalName} (Size: ${d.textContent.length} chars)`);
                // Preview content
                console.log(`  Preview: ${d.textContent.substring(0, 100)}...`);
            });
        }

    } catch (err) {
        console.error('Error:', err);
    } finally {
        await mongoose.disconnect();
    }
}

checkContent();
