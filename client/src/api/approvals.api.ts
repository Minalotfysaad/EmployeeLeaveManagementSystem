import { apiClient, isMockActive } from './axios';
import { ApprovalDecisionDto } from '../types/approval.types';
import { PendingLeaveRequestDto } from '../types/leaveRequest.types';
import { EmployeeQueryParameters } from '../types/employee.types';
import { PagedResult } from '../types/api.types';
import { mockStore } from './mock/mockStore';

export const approvalsApi = {
  // Manager Approvals
  async getManagerPending(params: EmployeeQueryParameters = {}): Promise<PagedResult<PendingLeaveRequestDto>> {
    if (!isMockActive()) {
      const response = await apiClient.get<PagedResult<PendingLeaveRequestDto>>('/manager/pending', {
        params,
      });
      return response.data;
    }

    return mockStore.getManagerPendingRequests(params);
  },

  async managerApprove(requestId: string, decision: ApprovalDecisionDto = {}): Promise<void> {
    if (!isMockActive()) {
      await apiClient.patch(`/manager/${requestId}/approve`, decision);
      return;
    }

    mockStore.managerApprove(requestId, decision.comment);
  },

  async managerReject(requestId: string, decision: ApprovalDecisionDto = {}): Promise<void> {
    if (!isMockActive()) {
      await apiClient.patch(`/manager/${requestId}/reject`, decision);
      return;
    }

    mockStore.managerReject(requestId, decision.comment);
  },

  // HR Approvals
  async getHRPending(params: EmployeeQueryParameters = {}): Promise<PagedResult<PendingLeaveRequestDto>> {
    if (!isMockActive()) {
      const response = await apiClient.get<PagedResult<PendingLeaveRequestDto>>('/hr/pending', {
        params,
      });
      return response.data;
    }

    return mockStore.getHRPendingRequests(params);
  },

  async hrApprove(requestId: string, decision: ApprovalDecisionDto = {}): Promise<void> {
    if (!isMockActive()) {
      await apiClient.patch(`/hr/${requestId}/approve`, decision);
      return;
    }

    mockStore.hrApprove(requestId, decision.comment);
  },

  async hrReject(requestId: string, decision: ApprovalDecisionDto = {}): Promise<void> {
    if (!isMockActive()) {
      await apiClient.patch(`/hr/${requestId}/reject`, decision);
      return;
    }

    mockStore.hrReject(requestId, decision.comment);
  },
};
