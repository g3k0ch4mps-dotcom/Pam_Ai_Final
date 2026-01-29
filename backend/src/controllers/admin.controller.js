const User = require('../models/User');
const Business = require('../models/Business');

/**
 * Get Admin Dashboard Stats
 */
const getDashboardStats = async (req, res) => {
    try {
        const totalBusiness = await Business.countDocuments();
        const totalUsers = await User.countDocuments();
        const activeBusinesses = await Business.countDocuments({ isActive: true });

        // Simple aggregation example
        const recentBusinesses = await Business.find()
            .sort({ createdAt: -1 })
            .limit(5);

        res.json({
            success: true,
            data: {
                counts: {
                    businesses: totalBusiness,
                    users: totalUsers,
                    activeBusinesses: activeBusinesses
                },
                recentActivity: recentBusinesses
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

/**
 * List all Businesses (System View)
 */
const listAllBusinesses = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = 20;

        const businesses = await Business.find()
            .skip((page - 1) * limit)
            .limit(limit)
            .sort({ createdAt: -1 });

        res.json({ success: true, data: businesses });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Failed to list businesses' });
    }
};

module.exports = {
    getDashboardStats,
    listAllBusinesses
};
