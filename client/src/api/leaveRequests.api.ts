import { apiClient, isMockActive } from './axios';
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
    if (!isMockActive()) {
      const response = await apiClient.post<LeaveRequestDetailsDto>('/leaverequests', dto);
      return response.data;
    }

    const userId = currentUserId || '77777777-7777-7777-7777-777777777777';
    return mockStore.createRequest(userId, dto);
  },

  async getMyLeaveRequests(
    params?: EmployeeQueryParameters,
    employeeId?: string
  ): Promise<PagedResult<LeaveRequestDetailsDto>> {
    if (!isMockActive()) {
      const response = await apiClient.get<PagedResult<LeaveRequestDetailsDto>>(
        '/leaverequests/my',
        { params }
      );
      return response.data;
    }

    const userId = employeeId || '77777777-7777-7777-7777-777777777777';
    return mockStore.getMyRequests(userId, params);
  },

  async getAllLeaveRequests(
    params?: EmployeeQueryParameters
  ): Promise<PagedResult<LeaveRequestDetailsDto>> {
    if (!isMockActive()) {
      const response = await apiClient.get<PagedResult<LeaveRequestDetailsDto>>(
        '/leaverequests',
        { params }
      );
      return response.data;
    }

    return mockStore.getAllRequests(params);
  },

  async getLeaveRequestById(id: string): Promise<LeaveRequestDetailsDto> {
    if (!isMockActive()) {
      const response = await apiClient.get<LeaveRequestDetailsDto>(`/leaverequests/my/${id}`);
      return response.data;
    }

    const req = mockStore.getRequestById(id);
    if (!req) throw new Error('Leave request not found');
    return req;
  },

  async cancelLeaveRequest(requestId: string, currentUserId?: string): Promise<void> {
    if (!isMockActive()) {
      await apiClient.patch(`/leaverequests/my/${requestId}/cancel`);
      return;
    }

    mockStore.cancelRequest(requestId, currentUserId);
  },
};
