import { apiClient, isMockActive } from './axios';
import {
  EmployeeDetailsDto,
  EmployeeSummaryDto,
  EmployeeQueryParameters,
  UpdateEmployeeDto,
  UpdateEmployeeRoleDto,
} from '../types/employee.types';
import { PagedResult } from '../types/api.types';
import { mockStore } from './mock/mockStore';

export const employeesApi = {
  async getMyProfile(currentUserId?: string): Promise<EmployeeDetailsDto> {
    if (!isMockActive()) {
      const response = await apiClient.get<EmployeeDetailsDto>('/employee/me');
      return response.data;
    }

    const id = currentUserId || '77777777-7777-7777-7777-777777777777'; // Leila Vance fallback
    const user = mockStore.getUserById(id);
    if (!user) throw new Error('Employee profile not found');
    return user;
  },

  async getEmployees(params: EmployeeQueryParameters = {}): Promise<PagedResult<EmployeeSummaryDto>> {
    if (!isMockActive()) {
      const response = await apiClient.get<PagedResult<EmployeeSummaryDto>>('/hr/employees', { params });
      return response.data;
    }

    return mockStore.getEmployees(params);
  },

  async getEmployeeById(id: string): Promise<EmployeeDetailsDto> {
    if (!isMockActive()) {
      const response = await apiClient.get<EmployeeDetailsDto>(`/hr/employees/${id}`);
      return response.data;
    }

    const user = mockStore.getUserById(id);
    if (!user) throw new Error('Employee not found');
    return user;
  },

  async updateEmployee(id: string, dto: UpdateEmployeeDto): Promise<void> {
    if (!isMockActive()) {
      await apiClient.put(`/hr/employees/${id}`, dto);
      return;
    }

    mockStore.updateEmployee(id, dto);
  },

  async deleteEmployee(id: string): Promise<void> {
    if (!isMockActive()) {
      await apiClient.delete(`/hr/employees/${id}`);
      return;
    }

    mockStore.deleteEmployee(id);
  },

  async updateEmployeeRole(id: string, dto: UpdateEmployeeRoleDto): Promise<void> {
    if (!isMockActive()) {
      await apiClient.patch(`/hr/employees/${id}/role`, dto);
      return;
    }

    mockStore.updateEmployeeRole(id, dto.role);
  },

  async assignManager(employeeId: string, managerId: string): Promise<void> {
    if (!isMockActive()) {
      await apiClient.patch(`/hr/employees/${employeeId}/manager/${managerId}`);
      return;
    }

    mockStore.assignManager(employeeId, managerId);
  },

  async assignDepartment(employeeId: string, departmentId: string): Promise<void> {
    if (!isMockActive()) {
      await apiClient.patch(`/hr/employees/${employeeId}/department/${departmentId}`);
      return;
    }

    mockStore.assignDepartment(employeeId, departmentId);
  },
};
