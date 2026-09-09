import { isMockActive } from './axios';
import { mockStore } from './mock/mockStore';
import { AppNotification } from './mock/mockData';

export type { AppNotification };

export const notificationsApi = {
  async getNotifications(): Promise<AppNotification[]> {
    if (!isMockActive()) {
      return [];
    }
    return mockStore.getNotifications();
  },

  async markAsRead(id: string): Promise<void> {
    if (!isMockActive()) {
      return;
    }
    mockStore.markNotificationAsRead(id);
  },

  async markAllAsRead(): Promise<void> {
    if (!isMockActive()) {
      return;
    }
    mockStore.markAllNotificationsAsRead();
  },
};
