import { apiClient, USE_MOCK } from './axios';
import {
  CreateLeaveRequestDto,
  LeaveRequestDetailsDto,
} from '../types/leaveRequest.types';
import { EmployeeQueryParameters } from '../types/employee.types';
import { PagedResult } from '../types/api.types';
import { mockStore } from './mock/mockStore';

export const leaveRequestsApi = {
  async createLeaveRequest(
    dto: CreateLeaveRequestDto,
    currentUserId?: string
  ): Promise<LeaveRequestDetailsDto> {
    if (!USE_MOCK) {
      try {
        const response = await apiClient.post<LeaveRequestDetailsDto>('/leaverequests', dto);
        return response.data;
      } catch (err) {
        console.warn('Backend API createLeaveRequest failed, using mock...', err);
      }
    }

    const userId = currentUserId || '77777777-7777-7777-7777-777777777777';
    return mockStore.createRequest(userId, dto);
  },

  async getMyLeaveRequests(
    params: EmployeeQueryParameters = {},
    currentUserId?: string
  ): Promise<PagedResult<LeaveRequestDetailsDto>> {
    if (!USE_MOCK) {
      try {
        const response = await apiClient.get<PagedResult<LeaveRequestDetailsDto>>('/leaverequests/my', {
          params,
        });
        return response.data;
      } catch (err) {
        console.warn('Backend API getMyLeaveRequests failed, using mock...', err);
      }
    }

    const userId = currentUserId || '77777777-7777-7777-7777-777777777777';
    return mockStore.getMyRequests(userId, params);
  },

  async getMyLeaveRequestById(id: string): Promise<LeaveRequestDetailsDto> {
    if (!USE_MOCK) {
      try {
        const response = await apiClient.get<LeaveRequestDetailsDto>(`/leaverequests/my/${id}`);
        return response.data;
      } catch (err) {
        console.warn('Backend API getMyLeaveRequestById failed, using mock...', err);
      }
    }

    const req = mockStore.getRequestById(id);
    if (!req) throw new Error('Leave request not found');
    return req;
  },

  async cancelLeaveRequest(id: string, currentUserId?: string): Promise<void> {
    if (!USE_MOCK) {
      try {
        await apiClient.patch(`/leaverequests/my/${id}/cancel`);
        return;
      } catch (err) {
        console.warn('Backend API cancelLeaveRequest failed, using mock...', err);
      }
    }

    const userId = currentUserId || '77777777-7777-7777-7777-777777777777';
    mockStore.cancelRequest(userId, id);
  },
};
