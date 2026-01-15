const mongoose = require('mongoose');
const Business = require('./src/models/Business'); // Adjust path if needed
require('dotenv').config();

async function checkBusiness() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        const slug = 'mamuza-engineering';
        const business = await Business.findOne({ businessSlug: slug });

        if (business) {
            console.log('Found Business:', business.businessName);
            console.log('Slug:', business.businessSlug);
            console.log('Chat Settings:', business.chatSettings);
        } else {
            console.log('Business NOT found.');
        }

        await mongoose.disconnect();
    } catch (error) {
        console.error('Error:', error);
    }
}

checkBusiness();
