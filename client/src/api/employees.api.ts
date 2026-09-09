import { apiClient, USE_MOCK } from './axios';
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
    if (!USE_MOCK) {
      try {
        const response = await apiClient.get<EmployeeDetailsDto>('/employee/me');
        return response.data;
      } catch (err) {
        console.warn('Backend API getMyProfile failed, evaluating mock...', err);
      }
    }

    const id = currentUserId || '77777777-7777-7777-7777-777777777777'; // Leila Vance fallback
    const user = mockStore.getUserById(id);
    if (!user) throw new Error('Employee profile not found');
    return user;
  },

  async getEmployees(params: EmployeeQueryParameters = {}): Promise<PagedResult<EmployeeSummaryDto>> {
    if (!USE_MOCK) {
      try {
        const response = await apiClient.get<PagedResult<EmployeeSummaryDto>>('/hr/employees', { params });
        return response.data;
      } catch (err) {
        console.warn('Backend API getEmployees failed, using mock...', err);
      }
    }

    return mockStore.getEmployees(params);
  },

  async getEmployeeById(id: string): Promise<EmployeeDetailsDto> {
    if (!USE_MOCK) {
      try {
        const response = await apiClient.get<EmployeeDetailsDto>(`/hr/employees/${id}`);
        return response.data;
      } catch (err) {
        console.warn('Backend API getEmployeeById failed, using mock...', err);
      }
    }

    const user = mockStore.getUserById(id);
    if (!user) throw new Error('Employee not found');
    return user;
  },

  async updateEmployee(id: string, dto: UpdateEmployeeDto): Promise<void> {
    if (!USE_MOCK) {
      try {
        await apiClient.put(`/hr/employees/${id}`, dto);
        return;
      } catch (err) {
        console.warn('Backend API updateEmployee failed, using mock...', err);
      }
    }

    mockStore.updateEmployee(id, dto);
  },

  async deleteEmployee(id: string): Promise<void> {
    if (!USE_MOCK) {
      try {
        await apiClient.delete(`/hr/employees/${id}`);
        return;
      } catch (err) {
        console.warn('Backend API deleteEmployee failed, using mock...', err);
      }
    }

    mockStore.deleteEmployee(id);
  },

  async updateEmployeeRole(id: string, dto: UpdateEmployeeRoleDto): Promise<void> {
    if (!USE_MOCK) {
      try {
        await apiClient.patch(`/hr/employees/${id}/role`, dto);
        return;
      } catch (err) {
        console.warn('Backend API updateEmployeeRole failed, using mock...', err);
      }
    }

    mockStore.updateEmployeeRole(id, dto.role);
  },

  async assignManager(employeeId: string, managerId: string): Promise<void> {
    if (!USE_MOCK) {
      try {
        await apiClient.patch(`/hr/employees/${employeeId}/manager/${managerId}`);
        return;
      } catch (err) {
        console.warn('Backend API assignManager failed, using mock...', err);
      }
    }

    mockStore.assignManager(employeeId, managerId);
  },

  async assignDepartment(employeeId: string, departmentId: string): Promise<void> {
    if (!USE_MOCK) {
      try {
        await apiClient.patch(`/hr/employees/${employeeId}/department/${departmentId}`);
        return;
      } catch (err) {
        console.warn('Backend API assignDepartment failed, using mock...', err);
      }
    }

    mockStore.assignDepartment(employeeId, departmentId);
  },
};
