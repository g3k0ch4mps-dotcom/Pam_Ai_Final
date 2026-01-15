require('dotenv').config();
const mongoose = require('mongoose');
const Document = require('./src/models/Document');
const Business = require('./src/models/Business');

async function debugSearch() {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/business-ai');
        console.log('Connected to MongoDB');

        const slug = 'mamuza-engineering';
        const business = await Business.findOne({ businessSlug: slug });
        if (!business) { console.log('Business not found'); return; }

        console.log(`Business ID: ${business._id}`);

        // 1. List all docs to confirm content existence
        const allDocs = await Document.find({ businessId: business._id });
        console.log(`\nTotal Documents: ${allDocs.length}`);
        allDocs.forEach(d => {
            console.log(`- ID: ${d._id}`);
            console.log(`  Title: ${d.urlTitle || d.originalName}`);
            console.log(`  Content Length: ${d.textContent.length}`);
            console.log(`  Snippet: ${d.textContent.substring(0, 50).replace(/\n/g, ' ')}...`);
        });

        // 2. Run the specific search query that is failing
        const queries = ['mamuza', 'what does mamuza do?', 'engineering'];

        console.log('\n--- Running Search Tests ---');
        for (const q of queries) {
            console.log(`\nQuery: "${q}"`);
            const results = await Document.find(
                {
                    businessId: business._id,
                    $text: { $search: q }
                },
                { score: { $meta: 'textScore' } }
            )
                .sort({ score: { $meta: 'textScore' } })
                .limit(3);

            if (results.length === 0) {
                console.log('❌ No results found.');
            } else {
                results.forEach(r => {
                    console.log(`✅ Found: ${r.urlTitle} (Score: ${r.score})`);
                });
            }
        }

        // 3. Check Indexes
        console.log('\n--- Checking Indexes ---');
        const indexes = await Document.collection.getIndexes();
        console.log(JSON.stringify(indexes, null, 2));

    } catch (err) {
        console.error('Error:', err);
    } finally {
        await mongoose.disconnect();
    }
}

debugSearch();
