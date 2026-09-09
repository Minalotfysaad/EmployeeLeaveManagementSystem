import { apiClient, isMockActive } from './axios';
import {
  DepartmentDetailsDto,
  CreateDepartmentDto,
  UpdateDepartmentDto,
} from '../types/department.types';
import { EmployeeQueryParameters } from '../types/employee.types';
import { PagedResult } from '../types/api.types';
import { mockStore } from './mock/mockStore';

export const departmentsApi = {
  async getDepartments(params: EmployeeQueryParameters = {}): Promise<PagedResult<DepartmentDetailsDto>> {
    if (!isMockActive()) {
      const response = await apiClient.get<PagedResult<DepartmentDetailsDto>>('/hr/departments', {
        params,
      });
      return response.data;
    }

    const all = mockStore.getDepartments();
    return {
      items: all,
      page: 1,
      pageSize: 50,
      totalCount: all.length,
      totalPages: 1,
      hasPreviousPage: false,
      hasNextPage: false,
    };
  },

  async getDepartment(id: string): Promise<DepartmentDetailsDto> {
    if (!isMockActive()) {
      const response = await apiClient.get<DepartmentDetailsDto>(`/hr/departments/${id}`);
      return response.data;
    }

    const dept = mockStore.getDepartments().find((d) => d.id === id);
    if (!dept) throw new Error('Department not found');
    return dept;
  },

  async createDepartment(dto: CreateDepartmentDto): Promise<DepartmentDetailsDto> {
    if (!isMockActive()) {
      const response = await apiClient.post<DepartmentDetailsDto>('/hr/departments', dto);
      return response.data;
    }

    return mockStore.createDepartment(dto.name);
  },

  async updateDepartment(id: string, dto: UpdateDepartmentDto): Promise<void> {
    if (!isMockActive()) {
      await apiClient.put(`/hr/departments/${id}`, dto);
      return;
    }

    mockStore.updateDepartment(id, dto.name);
  },

  async deleteDepartment(id: string): Promise<void> {
    if (!isMockActive()) {
      await apiClient.delete(`/hr/departments/${id}`);
      return;
    }

    mockStore.deleteDepartment(id);
  },
};
