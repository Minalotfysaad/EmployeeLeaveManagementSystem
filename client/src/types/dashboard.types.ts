import { BalanceDto } from './balance.types';

export interface EmployeeDashboardDto {
  leaveBalances: BalanceDto[];
  pendingRequests: number;
  approvedRequests: number;
  rejectedRequests: number;
  upcomingLeaveRequests: number;
}

export interface ManagerDashboardDto {
  teamSize: number;
  pendingRequests: number;
  approvedRequests: number;
  rejectedRequests: number;
  employeesCurrentlyOnLeave: number;
}

export interface HRDashboardDto {
  totalEmployees: number;
  totalDepartments: number;
  pendingManagerApprovals: number;
  pendingHRApprovals: number;
  employeesCurrentlyOnLeave: number;
  upcomingHolidays: number;
  leaveRequestsThisMonth: number;
}
