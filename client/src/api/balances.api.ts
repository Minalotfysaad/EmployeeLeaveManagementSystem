import { apiClient, isMockActive } from './axios';
import { BalanceDto, UpdateBalanceDto } from '../types/balance.types';
import { mockStore } from './mock/mockStore';

export const balancesApi = {
  async getMyBalances(currentUserId?: string): Promise<BalanceDto[]> {
    if (!isMockActive()) {
      const response = await apiClient.get<BalanceDto[]>('/employee/me/balances');
      return response.data;
    }

    const userId = currentUserId || '77777777-7777-7777-7777-777777777777';
    return mockStore.getBalances(userId);
  },

  async getMyBalance(leaveTypeId: string, currentUserId?: string): Promise<BalanceDto> {
    if (!isMockActive()) {
      const response = await apiClient.get<BalanceDto>(`/employee/me/balances/${leaveTypeId}`);
      return response.data;
    }

    const userId = currentUserId || '77777777-7777-7777-7777-777777777777';
    const balances = mockStore.getBalances(userId);
    const balance = balances.find((b) => b.leaveTypeId === leaveTypeId);
    if (!balance) throw new Error('Balance not found for leave type');
    return balance;
  },

  async getEmployeeBalances(employeeId: string): Promise<BalanceDto[]> {
    if (!isMockActive()) {
      const response = await apiClient.get<BalanceDto[]>(`/hr/employees/${employeeId}/balances`);
      return response.data;
    }

    return mockStore.getBalances(employeeId);
  },

  async updateEmployeeBalance(
    employeeId: string,
    leaveTypeId: string,
    dto: UpdateBalanceDto
  ): Promise<void> {
    if (!isMockActive()) {
      await apiClient.patch(`/hr/employees/${employeeId}/balances/${leaveTypeId}`, dto);
      return;
    }

    mockStore.updateBalance(employeeId, leaveTypeId, dto.remainingDays);
  },
};
