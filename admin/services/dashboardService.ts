import { apiClient } from './api';

export const getDashboardAllData = async () => {
    try {
        // Return dummy data or fetch from real endpoints
        return {
            stats: {
                totalRevenue: 0,
                totalOrders: 0,
                totalCustomers: 0,
                totalProducts: 0
            },
            recentOrders: [],
            topCategories: [],
            // Add other mock data based on what the UI expects
        };
        const res = await apiClient.get('/dashboard');
        return res.data;
    } catch (error) {
        console.error('Error fetching dashboard data:', error);
        return null;
    }
};

