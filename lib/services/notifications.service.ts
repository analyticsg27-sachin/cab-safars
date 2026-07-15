import { apiClient, ApiResponse } from './api-client';

export interface Notification {
  id: string;
  type: string;
  title: string;
  body: string;
  is_read: boolean;
  data?: Record<string, unknown>;
  trip_id?: number;
  created_at: string;
}

export interface NotificationPreferences {
  push_enabled: boolean;
  trip_alerts: boolean;
  contact_alerts: boolean;
  subscription_alerts: boolean;
  payment_alerts: boolean;
}

const NotificationsService = {
  async getAll(page = 1, unreadOnly = false): Promise<ApiResponse<Notification[]>> {
    const q = new URLSearchParams({ page: String(page) });
    if (unreadOnly) q.set('unread', '1');
    return apiClient.get<Notification[]>(`/notifications?${q}`);
  },

  async markRead(id: string): Promise<void> {
    await apiClient.post(`/notifications/${id}/read`);
  },

  async markAllRead(): Promise<void> {
    await apiClient.post('/notifications/read-all');
  },

  async getPreferences(): Promise<NotificationPreferences> {
    const res = await apiClient.get<NotificationPreferences>('/notifications/preferences');
    return res.data!;
  },

  async updatePreferences(prefs: Partial<NotificationPreferences>): Promise<void> {
    await apiClient.put('/notifications/preferences', prefs);
  },
};

export default NotificationsService;
