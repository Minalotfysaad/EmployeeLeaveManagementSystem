export interface LeaveTypeSummaryDto {
  id: string;
  name: string;
  defaultDays: number;
}

export interface LeaveTypeDetailsDto {
  id: string;
  name: string;
  description?: string;
  defaultDays: number;
}

export interface CreateLeaveTypeDto {
  name: string;
  description?: string;
  defaultDays: number;
}

export interface UpdateLeaveTypeDto {
  name: string;
  description?: string;
  defaultDays: number;
}
