import { apiClient, USE_MOCK } from './axios';
import {
  EmployeeDashboardDto,
  ManagerDashboardDto,
  HRDashboardDto,
} from '../types/dashboard.types';
import { mockStore } from './mock/mockStore';

export const dashboardApi = {
  async getEmployeeDashboard(currentUserId?: string): Promise<EmployeeDashboardDto> {
    if (!USE_MOCK) {
      try {
        const response = await apiClient.get<EmployeeDashboardDto>('/employee/dashboard');
        return response.data;
      } catch (err) {
        console.warn('Backend API getEmployeeDashboard failed, using mock...', err);
      }
    }

    const userId = currentUserId || '77777777-7777-7777-7777-777777777777';
    return mockStore.getEmployeeDashboard(userId);
  },

  async getManagerDashboard(): Promise<ManagerDashboardDto> {
    if (!USE_MOCK) {
      try {
        const response = await apiClient.get<ManagerDashboardDto>('/manager/dashboard');
        return response.data;
      } catch (err) {
        console.warn('Backend API getManagerDashboard failed, using mock...', err);
      }
    }

    return mockStore.getManagerDashboard();
  },

  async getHRDashboard(): Promise<HRDashboardDto> {
    if (!USE_MOCK) {
      try {
        const response = await apiClient.get<HRDashboardDto>('/hr/dashboard');
        return response.data;
      } catch (err) {
        console.warn('Backend API getHRDashboard failed, using mock...', err);
      }
    }

    return mockStore.getHRDashboard();
  },
};
