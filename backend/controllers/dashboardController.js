const { User, Product, Order, ActivityLog, Analytics, Category } = require('../models');

// @desc    Get dashboard data
// @route   GET /api/dashboard
// @access  Admin
const getDashboardData = async (req, res) => {
    try {
        const totalCustomers = await User.countDocuments();
        const totalProducts = await Product.countDocuments();
        const totalOrders = await Order.countDocuments();
        
        // Use total field from orders to sum revenue (ignoring status for now to match UI easily)
        const orders = await Order.find({});
        const totalRevenue = orders.reduce((acc, order) => acc + (order.total || 0), 0);

        const recentOrders = await Order.find().sort({ createdAt: -1 }).limit(5).populate('user', 'firstName lastName email');
        const activityLogs = await ActivityLog.find().sort({ createdAt: -1 }).limit(10);
        
        const topCategories = await Category.find().limit(5); // Just a fallback if needed
        
        let analytics = await Analytics.findOne();
        if (!analytics) {
            analytics = await Analytics.create({});
        }

        res.json({
            stats: {
                totalRevenue,
                totalOrders,
                totalCustomers,
                totalProducts
            },
            recentOrders,
            activityLogs,
            analytics,
            topCategories
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getDashboardData
};

