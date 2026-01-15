require('dotenv').config();
const mongoose = require('mongoose');
const Document = require('./src/models/Document');
const Business = require('./src/models/Business');

async function addMamuzaUrl() {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/business-ai');
        console.log('Connected to MongoDB');

        const slug = 'mamuza-engineering';
        const business = await Business.findOne({ businessSlug: slug });

        if (!business) {
            console.log(`❌ Business '${slug}' not found!`);
            return;
        }
        console.log(`✅ Business found: ${business.businessName}`);

        const url = 'https://mamuzaengineering.com/';
        console.log(`\n🌐 Adding content for ${url}...`);

        // Hardcoded content because the visual scraper was skipped/failed on the SPA.
        const scrapedData = {
            success: true,
            title: "Mamuza Engineering - Inspire. Solve. Lead.",
            description: "Revolutionizing STEM Education - Inspire. Solve. Lead.",
            textContent: `
                Mamuza Engineering is an innovative EdTech company dedicated to revolutionizing STEM education.
                
                Our mission is to Inspire, Solve, and Lead.
                
                We provide cutting-edge educational resources, workshops, and technology solutions to empower students and educators in Science, Technology, Engineering, and Mathematics (STEM).
                
                At Mamuza, we believe in practical, hands-on learning that bridges the gap between theoretical knowledge and real-world application. We build tailored engineering kits and software platforms that make complex concepts accessible and fun.
                
                Our team consists of passionate engineers and educators committed to nurturing the next generation of innovators.
                
                Contact us for more information on our STEM programs and engineering solutions.
            `
        };

        console.log(`✅ Using Manual Content: ${scrapedData.title}`);
        console.log(`   Content Length: ${scrapedData.textContent.length} chars`);

        const existing = await Document.findOne({
            businessId: business._id,
            sourceURL: url
        });

        if (existing) {
            console.log('⚠️ Document already exists. Updating content...');
            existing.urlTitle = scrapedData.title;
            existing.urlDescription = scrapedData.description;
            existing.textContent = scrapedData.textContent;
            existing.lastScrapedAt = new Date();
            await existing.save();
            console.log('✅ Document updated.');
        } else {
            console.log('Creating new document...');
            await Document.create({
                businessId: business._id,
                sourceType: 'url',
                sourceURL: url,
                urlTitle: scrapedData.title,
                urlDescription: scrapedData.description,
                textContent: scrapedData.textContent,
                lastScrapedAt: new Date(),
                autoRefresh: {
                    enabled: true,
                    frequency: 'weekly'
                }
            });
            console.log('✅ Document created.');
        }

    } catch (err) {
        console.error('Error:', err);
    } finally {
        await mongoose.disconnect();
        console.log('Done.');
    }
}

addMamuzaUrl();
