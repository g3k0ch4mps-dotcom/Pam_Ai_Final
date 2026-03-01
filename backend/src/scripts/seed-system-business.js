const mongoose = require('mongoose');
require('dotenv').config();
const Business = require('../models/Business');
const User = require('../models/User');
const { connectDatabase } = require('../config/database');

async function seedSystemBusiness() {
    try {
        await connectDatabase();
        console.log('Connected to Database');

        const systemSlug = 'pamilo';

        // 1. Check if business exists
        let business = await Business.findOne({ businessSlug: systemSlug });

        if (!business) {
            console.log('Creating System Business (Pamilo)...');
            business = new Business({
                businessName: 'Pamilo AI Official',
                businessSlug: systemSlug,
                industry: 'AI & Software',
                isActive: true,
                isVerified: true,
                chatSettings: {
                    primaryColor: '#2563eb', // blue-600
                    welcomeMessage: 'Welcome to Pamilo AI! How can I help you build your own AI assistant today?',
                },
                subscription: {
                    plan: 'enterprise',
                    status: 'active'
                }
            });
            await business.save();
            console.log('✓ System Business created');
        } else {
            console.log('Updating System Business (Pamilo)...');
            business.chatSettings = {
                primaryColor: '#2563eb',
                welcomeMessage: 'Welcome to Pamilo AI! How can I help you build your own AI assistant today?'
            };
            business.subscription = {
                plan: 'enterprise',
                status: 'active'
            };
            await business.save();
            console.log('✓ System Business updated');
        }

        // 2. Ensure a System Admin is linked if needed (optional, Super Admin can manage any business)
        // For standard KB operations, a user usually needs to be linked to a business.
        // But Super Admins have global power in our backend controllers.

        process.exit(0);
    } catch (error) {
        console.error('Seed Error:', error);
        process.exit(1);
    }
}

seedSystemBusiness();
