import { apiClient, USE_MOCK } from './axios';
import { ApprovalDecisionDto } from '../types/approval.types';
import { PendingLeaveRequestDto } from '../types/leaveRequest.types';
import { EmployeeQueryParameters } from '../types/employee.types';
import { PagedResult } from '../types/api.types';
import { mockStore } from './mock/mockStore';

export const approvalsApi = {
  // Manager Approvals
  async getManagerPending(params: EmployeeQueryParameters = {}): Promise<PagedResult<PendingLeaveRequestDto>> {
    if (!USE_MOCK) {
      try {
        const response = await apiClient.get<PagedResult<PendingLeaveRequestDto>>('/manager/pending', {
          params,
        });
        return response.data;
      } catch (err) {
        console.warn('Backend API getManagerPending failed, using mock...', err);
      }
    }

    return mockStore.getManagerPendingRequests(params);
  },

  async managerApprove(requestId: string, decision: ApprovalDecisionDto = {}): Promise<void> {
    if (!USE_MOCK) {
      try {
        await apiClient.patch(`/manager/${requestId}/approve`, decision);
        return;
      } catch (err) {
        console.warn('Backend API managerApprove failed, using mock...', err);
      }
    }

    mockStore.managerApprove(requestId, decision.comment);
  },

  async managerReject(requestId: string, decision: ApprovalDecisionDto = {}): Promise<void> {
    if (!USE_MOCK) {
      try {
        await apiClient.patch(`/manager/${requestId}/reject`, decision);
        return;
      } catch (err) {
        console.warn('Backend API managerReject failed, using mock...', err);
      }
    }

    mockStore.managerReject(requestId, decision.comment);
  },

  // HR Approvals
  async getHRPending(params: EmployeeQueryParameters = {}): Promise<PagedResult<PendingLeaveRequestDto>> {
    if (!USE_MOCK) {
      try {
        const response = await apiClient.get<PagedResult<PendingLeaveRequestDto>>('/hr/pending', {
          params,
        });
        return response.data;
      } catch (err) {
        console.warn('Backend API getHRPending failed, using mock...', err);
      }
    }

    return mockStore.getHRPendingRequests(params);
  },

  async hrApprove(requestId: string, decision: ApprovalDecisionDto = {}): Promise<void> {
    if (!USE_MOCK) {
      try {
        await apiClient.patch(`/hr/${requestId}/approve`, decision);
        return;
      } catch (err) {
        console.warn('Backend API hrApprove failed, using mock...', err);
      }
    }

    mockStore.hrApprove(requestId, decision.comment);
  },

  async hrReject(requestId: string, decision: ApprovalDecisionDto = {}): Promise<void> {
    if (!USE_MOCK) {
      try {
        await apiClient.patch(`/hr/${requestId}/reject`, decision);
        return;
      } catch (err) {
        console.warn('Backend API hrReject failed, using mock...', err);
      }
    }

    mockStore.hrReject(requestId, decision.comment);
  },
};
