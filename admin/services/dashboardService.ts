import { apiClient } from './api';

export const getDashboardAllData = async (_period?: string) => {
    try {
        const res = await apiClient.get('/dashboard', {
            params: _period ? { period: _period } : undefined
        });
        return res.data;
    } catch (error) {
        console.error('Error fetching dashboard data:', error);
        return null;
    }
};

