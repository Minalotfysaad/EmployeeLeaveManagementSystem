import { apiClient, isMockActive } from './axios';
import {
  LeaveTypeDetailsDto,
  LeaveTypeSummaryDto,
  CreateLeaveTypeDto,
  UpdateLeaveTypeDto,
} from '../types/leaveType.types';
import { EmployeeQueryParameters } from '../types/employee.types';
import { PagedResult } from '../types/api.types';
import { mockStore } from './mock/mockStore';

export const leaveTypesApi = {
  async getLeaveTypes(params: EmployeeQueryParameters = {}): Promise<PagedResult<LeaveTypeSummaryDto>> {
    if (!isMockActive()) {
      const response = await apiClient.get<PagedResult<LeaveTypeSummaryDto>>('/leavetypes', {
        params,
      });
      return response.data;
    }

    const all = mockStore.getLeaveTypes();
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

  async getLeaveType(id: string): Promise<LeaveTypeDetailsDto> {
    if (!isMockActive()) {
      const response = await apiClient.get<LeaveTypeDetailsDto>(`/leavetypes/${id}`);
      return response.data;
    }

    const item = mockStore.getLeaveTypes().find((l) => l.id === id);
    if (!item) throw new Error('Leave type not found');
    return item;
  },

  async createLeaveType(dto: CreateLeaveTypeDto): Promise<LeaveTypeDetailsDto> {
    if (!isMockActive()) {
      const response = await apiClient.post<LeaveTypeDetailsDto>('/leavetypes', dto);
      return response.data;
    }

    return mockStore.createLeaveType(dto.name, dto.defaultDays, dto.description);
  },

  async updateLeaveType(id: string, dto: UpdateLeaveTypeDto): Promise<void> {
    if (!isMockActive()) {
      await apiClient.put(`/leavetypes/${id}`, dto);
      return;
    }

    mockStore.updateLeaveType(id, dto.name, dto.defaultDays, dto.description);
  },

  async deleteLeaveType(id: string): Promise<void> {
    if (!isMockActive()) {
      await apiClient.delete(`/leavetypes/${id}`);
      return;
    }

    mockStore.deleteLeaveType(id);
  },
};
