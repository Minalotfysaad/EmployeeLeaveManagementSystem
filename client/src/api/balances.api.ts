import { apiClient, USE_MOCK } from './axios';
import { BalanceDto, UpdateBalanceDto } from '../types/balance.types';
import { mockStore } from './mock/mockStore';

export const balancesApi = {
  async getMyBalances(currentUserId?: string): Promise<BalanceDto[]> {
    if (!USE_MOCK) {
      try {
        const response = await apiClient.get<BalanceDto[]>('/employee/me/balances');
        return response.data;
      } catch (err) {
        console.warn('Backend API getMyBalances failed, using mock...', err);
      }
    }

    const userId = currentUserId || '77777777-7777-7777-7777-777777777777';
    return mockStore.getBalances(userId);
  },

  async getMyBalance(leaveTypeId: string, currentUserId?: string): Promise<BalanceDto> {
    if (!USE_MOCK) {
      try {
        const response = await apiClient.get<BalanceDto>(`/employee/me/balances/${leaveTypeId}`);
        return response.data;
      } catch (err) {
        console.warn('Backend API getMyBalance failed, using mock...', err);
      }
    }

    const userId = currentUserId || '77777777-7777-7777-7777-777777777777';
    const balances = mockStore.getBalances(userId);
    const balance = balances.find((b) => b.leaveTypeId === leaveTypeId);
    if (!balance) throw new Error('Balance not found for leave type');
    return balance;
  },

  async getEmployeeBalances(employeeId: string): Promise<BalanceDto[]> {
    if (!USE_MOCK) {
      try {
        const response = await apiClient.get<BalanceDto[]>(`/hr/employees/${employeeId}/balances`);
        return response.data;
      } catch (err) {
        console.warn('Backend API getEmployeeBalances failed, using mock...', err);
      }
    }

    return mockStore.getBalances(employeeId);
  },

  async updateEmployeeBalance(
    employeeId: string,
    leaveTypeId: string,
    dto: UpdateBalanceDto
  ): Promise<void> {
    if (!USE_MOCK) {
      try {
        await apiClient.patch(`/hr/employees/${employeeId}/balances/${leaveTypeId}`, dto);
        return;
      } catch (err) {
        console.warn('Backend API updateEmployeeBalance failed, using mock...', err);
      }
    }

    mockStore.updateBalance(employeeId, leaveTypeId, dto.remainingDays);
  },
};
