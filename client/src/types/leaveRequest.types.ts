export enum RequestStatus {
  Pending = 0,
  Cancelled = 1,
  RejectedByManager = 2,
  ManagerApproved = 3,
  RejectedByHR = 4,
  HRApproved = 5,
}

export const RequestStatusLabels: Record<RequestStatus, string> = {
  [RequestStatus.Pending]: 'Pending',
  [RequestStatus.Cancelled]: 'Cancelled',
  [RequestStatus.RejectedByManager]: 'Rejected by Manager',
  [RequestStatus.ManagerApproved]: 'Manager Approved',
  [RequestStatus.RejectedByHR]: 'Rejected by HR',
  [RequestStatus.HRApproved]: 'Approved',
};

export interface CreateLeaveRequestDto {
  leaveTypeId: string;
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
  reason: string;
}

export interface LeaveRequestDetailsDto {
  id: string;
  leaveType: string;
  startDate: string;
  endDate: string;
  totalDays: number;
  status: RequestStatus;
  reason: string;
  createdAt: string;
}

export interface PendingLeaveRequestDto {
  id: string;
  employeeName: string;
  department: string;
  leaveType: string;
  startDate: string;
  endDate: string;
  totalDays: number;
  reason?: string;
  createdAt: string;
}
