import { apiClient, isMockActive } from './axios';
import {
  EmployeeDashboardDto,
  ManagerDashboardDto,
  HRDashboardDto,
} from '../types/dashboard.types';
import { mockStore } from './mock/mockStore';

export const dashboardApi = {
  async getEmployeeDashboard(currentUserId?: string): Promise<EmployeeDashboardDto> {
    if (!isMockActive()) {
      const response = await apiClient.get<EmployeeDashboardDto>('/employee/dashboard');
      return response.data;
    }

    const userId = currentUserId || '77777777-7777-7777-7777-777777777777';
    return mockStore.getEmployeeDashboard(userId);
  },

  async getManagerDashboard(): Promise<ManagerDashboardDto> {
    if (!isMockActive()) {
      const response = await apiClient.get<ManagerDashboardDto>('/manager/dashboard');
      return response.data;
    }

    return mockStore.getManagerDashboard();
  },

  async getHRDashboard(): Promise<HRDashboardDto> {
    if (!isMockActive()) {
      const response = await apiClient.get<HRDashboardDto>('/hr/dashboard');
      return response.data;
    }

    return mockStore.getHRDashboard();
  },
};
