import { apiClient, USE_MOCK } from './axios';
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
    if (!USE_MOCK) {
      try {
        const response = await apiClient.get<PagedResult<LeaveTypeSummaryDto>>('/leavetypes', {
          params,
        });
        return response.data;
      } catch (err) {
        console.warn('Backend API getLeaveTypes failed, using mock...', err);
      }
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
    if (!USE_MOCK) {
      try {
        const response = await apiClient.get<LeaveTypeDetailsDto>(`/leavetypes/${id}`);
        return response.data;
      } catch (err) {
        console.warn('Backend API getLeaveType failed, using mock...', err);
      }
    }

    const item = mockStore.getLeaveTypes().find((l) => l.id === id);
    if (!item) throw new Error('Leave type not found');
    return item;
  },

  async createLeaveType(dto: CreateLeaveTypeDto): Promise<LeaveTypeDetailsDto> {
    if (!USE_MOCK) {
      try {
        const response = await apiClient.post<LeaveTypeDetailsDto>('/leavetypes', dto);
        return response.data;
      } catch (err) {
        console.warn('Backend API createLeaveType failed, using mock...', err);
      }
    }

    return mockStore.createLeaveType(dto.name, dto.defaultDays, dto.description);
  },

  async updateLeaveType(id: string, dto: UpdateLeaveTypeDto): Promise<void> {
    if (!USE_MOCK) {
      try {
        await apiClient.put(`/leavetypes/${id}`, dto);
        return;
      } catch (err) {
        console.warn('Backend API updateLeaveType failed, using mock...', err);
      }
    }

    mockStore.updateLeaveType(id, dto.name, dto.defaultDays, dto.description);
  },

  async deleteLeaveType(id: string): Promise<void> {
    if (!USE_MOCK) {
      try {
        await apiClient.delete(`/leavetypes/${id}`);
        return;
      } catch (err) {
        console.warn('Backend API deleteLeaveType failed, using mock...', err);
      }
    }

    mockStore.deleteLeaveType(id);
  },
};
