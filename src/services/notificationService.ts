import { api } from './apiClient';

export const notificationService = {
  getNotifications: async () => {
    const response = await api.get('/notifications');
    // Array.isArray(res.data) ? res.data : (res as any)?.data?.data ?? [];
    return response.data;
  },
  
  markAsRead: async (notificationId: string) => {
    const response = await api.put(`/notifications/${notificationId}/read`);
    return response.data;
  },

  markAllAsRead: async () => {
    const response = await api.put('/notifications/read-all');
    return response.data;
  },
};