require('dotenv').config();
const mongoose = require('mongoose');
const Document = require('./src/models/Document');
const Business = require('./src/models/Business');

async function checkUrl() {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/business-ai');
        console.log('Connected to MongoDB');

        const slug = 'mamuza-engineering';
        const business = await Business.findOne({ businessSlug: slug });

        if (!business) {
            console.log(`❌ Business '${slug}' not found!`);
            return;
        }

        const targetUrl = 'https://mamuzaengineering.com/programs';
        console.log(`\nChecking for URL: ${targetUrl}`);

        const doc = await Document.findOne({
            businessId: business._id,
            sourceURL: targetUrl
        });

        if (doc) {
            console.log('✅ Document FOUND.');
            console.log(`   ID: ${doc._id}`);
            console.log(`   Title: ${doc.urlTitle}`);
            console.log(`   Content Length: ${doc.textContent.length}`);
            console.log(`   Last Scraped: ${doc.lastScrapedAt}`);
        } else {
            console.log('❌ Document NOT FOUND.');
            console.log('   The database does not contain this specific URL.');

            // Helpful: Check what IS there
            const allDocs = await Document.find({ businessId: business._id });
            console.log(`\nOther documents for this business (${allDocs.length}):`);
            allDocs.forEach(d => {
                if (d.sourceType === 'url') {
                    console.log(`- ${d.sourceURL}`);
                } else {
                    console.log(`- [File] ${d.originalName}`);
                }
            });
        }

    } catch (err) {
        console.error('Error:', err);
    } finally {
        await mongoose.disconnect();
    }
}

checkUrl();
