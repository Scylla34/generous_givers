import { api } from '@/lib/api';

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'DONATION_RECEIVED' | 'DONATION_COMPLETED' | 'DONATION_FAILED' | 'PROJECT_CREATED' | 'PROJECT_UPDATED' | 'PROJECT_COMPLETED' | 'VISIT_SCHEDULED' | 'VISIT_COMPLETED' | 'USER_REGISTERED' | 'SYSTEM_ALERT';
  entityType?: string;
  entityId?: string;
  metadata?: Record<string, unknown>;
  isRead: boolean;
  isGlobal: boolean;
  createdAt: string;
  readAt?: string;
}

export interface NotificationsResponse {
  notifications: Notification[];
  currentPage: number;
  totalPages: number;
  totalElements: number;
  hasMore: boolean;
}

export interface UnreadCountResponse {
  count: number;
}

export const notificationService = {
  async getNotifications(page = 0, size = 20): Promise<NotificationsResponse> {
    const response = await api.get<NotificationsResponse>('/notifications', {
      params: { page, size },
    });
    return response.data;
  },

  async getUnreadNotifications(): Promise<Notification[]> {
    const response = await api.get<Notification[]>('/notifications/unread');
    return response.data;
  },

  async getUnreadCount(): Promise<number> {
    const response = await api.get<UnreadCountResponse>('/notifications/unread/count');
    return response.data.count;
  },

  async markAsRead(notificationId: string): Promise<void> {
    await api.patch(`/notifications/${notificationId}/read`);
  },

  async markAllAsRead(): Promise<void> {
    await api.patch('/notifications/read-all');
  },
};
