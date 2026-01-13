require('dotenv').config();
const mongoose = require('mongoose');
const Document = require('./src/models/Document');
const Business = require('./src/models/Business');
const urlScraper = require('./src/services/urlScraper.service');
const fs = require('fs');

async function verifyFixes() {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/business-ai');
        console.log('Connected to MongoDB');

        // 1. Test Scraper (Puppeteer)
        const url = 'https://mamuzaengineering.com/programs'; // The one that failed before
        console.log(`\n1. 🧪 Testing Scraper on: ${url}`);

        const startTime = Date.now();
        const scrapedData = await urlScraper.scrapeURL(url);
        const duration = (Date.now() - startTime) / 1000;

        if (!scrapedData.success || scrapedData.textContent.length < 100) {
            console.error('❌ Scraper Failed or Content Empty');
            console.log(`Length: ${scrapedData.textContent ? scrapedData.textContent.length : 0}`);
            return;
        }

        console.log(`   ✅ Scraped successfully in ${duration}s`);
        console.log(`   Title: ${scrapedData.title}`);
        console.log(`   Content Length: ${scrapedData.textContent.length} chars`);

        // 2. Test DB Creation (Simulate "Add URL")
        console.log('\n2. 💾 Saving to DB...');
        const slug = 'mamuza-engineering';
        const business = await Business.findOne({ businessSlug: slug });

        const doc = await Document.create({
            businessId: business._id,
            sourceType: 'url',
            sourceURL: url,
            urlTitle: scrapedData.title,
            textContent: scrapedData.textContent,
            lastScrapedAt: new Date()
        });
        console.log(`   ✅ Document created: ${doc._id}`);

        // 3. Test Refresh Logic (Re-scrape)
        console.log('\n3. 🔄 Testing Refresh...');
        const refreshStart = Date.now();
        const refreshedData = await urlScraper.scrapeURL(url);

        doc.textContent = refreshedData.textContent;
        doc.lastScrapedAt = new Date();
        await doc.save();

        console.log(`   ✅ Refreshed successfully (${(Date.now() - refreshStart) / 1000}s)`);

        // 4. Test Delete Logic
        console.log('\n4. 🗑️ Testing Delete...');

        // Mocking the delete controller logic
        const docToDelete = await Document.findById(doc._id);

        if (docToDelete.sourceType === 'file' && docToDelete.filename) {
            // This path shouldn't be loaded for URL
            console.log('   Warning: Identified as file?');
        } else {
            console.log('   ✅ Correctly identified as URL (Skipping file delete)');
        }

        await Document.deleteOne({ _id: doc._id });

        const check = await Document.findById(doc._id);
        if (!check) {
            console.log('   ✅ Database entry deleted');
        } else {
            console.error('   ❌ Database entry still exists');
        }

    } catch (err) {
        console.error('❌ Error:', err);
    } finally {
        await mongoose.disconnect();
    }
}

verifyFixes();
