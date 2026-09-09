import { RequestStatus } from '../../types/leaveRequest.types';
import { EmployeeDetailsDto, EmployeeSummaryDto } from '../../types/employee.types';
import { DepartmentDetailsDto } from '../../types/department.types';
import { LeaveTypeDetailsDto } from '../../types/leaveType.types';
import { BalanceDto } from '../../types/balance.types';
import { LeaveRequestDetailsDto, PendingLeaveRequestDto } from '../../types/leaveRequest.types';
import { HolidayDetailsDto } from '../../types/holiday.types';

export const INITIAL_DEPARTMENTS: DepartmentDetailsDto[] = [
  { id: '11111111-1111-1111-1111-111111111111', name: 'Information Technology' },
  { id: '22222222-2222-2222-2222-222222222222', name: 'Human Resources' },
  { id: '33333333-3333-3333-3333-333333333333', name: 'Finance' },
  { id: '44444444-4444-4444-4444-444444444444', name: 'Operations' },
  { id: '55555555-5555-5555-5555-555555555555', name: 'Marketing' },
];

export const INITIAL_LEAVE_TYPES: LeaveTypeDetailsDto[] = [
  {
    id: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    name: 'Annual Leave',
    defaultDays: 22,
    description: 'Standard paid annual time off for rest and vacation.',
  },
  {
    id: 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
    name: 'Sick Leave',
    defaultDays: 10,
    description: 'Paid medical leave for illness and recovery.',
  },
  {
    id: 'cccccccc-cccc-cccc-cccc-cccccccccccc',
    name: 'Emergency Leave',
    defaultDays: 5,
    description: 'Leave for urgent unexpected personal or family emergencies.',
  },
];

export const INITIAL_USERS: (EmployeeDetailsDto & { managerId?: string })[] = [
  {
    id: '99999999-9999-9999-9999-999999999999',
    firstName: 'System',
    lastName: 'Administrator',
    email: 'admin@company.com',
    departmentName: 'Human Resources',
    phoneNumber: '+1 (555) 019-2831',
    roles: ['HR', 'Manager', 'Employee'],
    createdDate: '2025-01-01T00:00:00Z',
  },
  {
    id: '88888888-8888-8888-8888-888888888888',
    firstName: 'David',
    lastName: 'Chen',
    email: 'david.chen@company.com',
    departmentName: 'Information Technology',
    phoneNumber: '+1 (555) 018-9271',
    roles: ['Manager', 'Employee'],
    createdDate: '2025-01-15T00:00:00Z',
  },
  {
    id: '77777777-7777-7777-7777-777777777777',
    firstName: 'Leila',
    lastName: 'Vance',
    email: 'leila.vance@company.com',
    departmentName: 'Information Technology',
    phoneNumber: '+1 (555) 012-3456',
    roles: ['Employee'],
    createdDate: '2025-02-01T00:00:00Z',
    managerId: '88888888-8888-8888-8888-888888888888',
  },
  {
    id: '66666666-6666-6666-6666-666666666666',
    firstName: 'Sarah',
    lastName: 'Kim',
    email: 'sarah.kim@company.com',
    departmentName: 'Marketing',
    phoneNumber: '+1 (555) 014-4912',
    roles: ['Employee'],
    createdDate: '2025-02-10T00:00:00Z',
  },
  {
    id: '55555555-5555-5555-5555-555555555555',
    firstName: 'Annan',
    lastName: 'Fiala',
    email: 'annan.fiala@company.com',
    departmentName: 'Finance',
    phoneNumber: '+1 (555) 017-7321',
    roles: ['Employee'],
    createdDate: '2025-02-15T00:00:00Z',
  },
  {
    id: '44444444-4444-4444-4444-444444444444',
    firstName: 'Ciney',
    lastName: 'Monn',
    email: 'ciney.monn@company.com',
    departmentName: 'Operations',
    phoneNumber: '+1 (555) 016-1294',
    roles: ['Employee'],
    createdDate: '2025-02-20T00:00:00Z',
  }
];

export const INITIAL_BALANCES: Record<string, BalanceDto[]> = {
  // Leila Vance's balances - matches mockup: 22 accrued, 12 used, 10 remaining
  '77777777-7777-7777-7777-777777777777': [
    {
      leaveTypeId: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
      leaveType: 'Annual Leave',
      remainingDays: 10,
    },
    {
      leaveTypeId: 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
      leaveType: 'Sick Leave',
      remainingDays: 8,
    },
    {
      leaveTypeId: 'cccccccc-cccc-cccc-cccc-cccccccccccc',
      leaveType: 'Emergency Leave',
      remainingDays: 4,
    },
  ],
  // David Chen
  '88888888-8888-8888-8888-888888888888': [
    {
      leaveTypeId: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
      leaveType: 'Annual Leave',
      remainingDays: 16,
    },
    {
      leaveTypeId: 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
      leaveType: 'Sick Leave',
      remainingDays: 10,
    },
    {
      leaveTypeId: 'cccccccc-cccc-cccc-cccc-cccccccccccc',
      leaveType: 'Emergency Leave',
      remainingDays: 5,
    },
  ],
  // System Admin
  '99999999-9999-9999-9999-999999999999': [
    {
      leaveTypeId: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
      leaveType: 'Annual Leave',
      remainingDays: 20,
    },
    {
      leaveTypeId: 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
      leaveType: 'Sick Leave',
      remainingDays: 10,
    },
    {
      leaveTypeId: 'cccccccc-cccc-cccc-cccc-cccccccccccc',
      leaveType: 'Emergency Leave',
      remainingDays: 5,
    },
  ],
};

export const INITIAL_LEAVE_REQUESTS: (LeaveRequestDetailsDto & { employeeId: string; employeeName: string; department: string })[] = [
  {
    id: 'req-1001',
    employeeId: '77777777-7777-7777-7777-777777777777',
    employeeName: 'Leila Vance',
    department: 'Information Technology',
    leaveType: 'Annual Leave',
    startDate: '2026-10-15',
    endDate: '2026-10-18',
    totalDays: 4,
    status: RequestStatus.Pending,
    reason: 'Family trip and autumn break with family.',
    createdAt: '2026-09-08T10:15:00Z',
  },
  {
    id: 'req-1002',
    employeeId: '77777777-7777-7777-7777-777777777777',
    employeeName: 'Leila Vance',
    department: 'Information Technology',
    leaveType: 'Annual Leave',
    startDate: '2026-08-10',
    endDate: '2026-08-17',
    totalDays: 8,
    status: RequestStatus.HRApproved,
    reason: 'Summer vacation trip.',
    createdAt: '2026-08-01T09:30:00Z',
  },
  {
    id: 'req-1003',
    employeeId: '77777777-7777-7777-7777-777777777777',
    employeeName: 'Leila Vance',
    department: 'Information Technology',
    leaveType: 'Sick Leave',
    startDate: '2026-07-03',
    endDate: '2026-07-04',
    totalDays: 2,
    status: RequestStatus.HRApproved,
    reason: 'Medical recovery following minor procedure.',
    createdAt: '2026-07-02T16:00:00Z',
  },
  {
    id: 'req-1004',
    employeeId: '77777777-7777-7777-7777-777777777777',
    employeeName: 'Leila Vance',
    department: 'Information Technology',
    leaveType: 'Sick Leave',
    startDate: '2026-05-12',
    endDate: '2026-05-13',
    totalDays: 2,
    status: RequestStatus.HRApproved,
    reason: 'Flu symptoms.',
    createdAt: '2026-05-11T18:20:00Z',
  },
  // Other employee requests for team & manager approval demo
  {
    id: 'req-2001',
    employeeId: '66666666-6666-6666-6666-666666666666',
    employeeName: 'Sarah Kim',
    department: 'Marketing',
    leaveType: 'Annual Leave',
    startDate: '2026-10-12',
    endDate: '2026-10-12',
    totalDays: 1,
    status: RequestStatus.Pending,
    reason: 'Personal appointments and errands.',
    createdAt: '2026-09-07T11:00:00Z',
  },
  {
    id: 'req-2002',
    employeeId: '55555555-5555-5555-5555-555555555555',
    employeeName: 'Annan Fiala',
    department: 'Finance',
    leaveType: 'Annual Leave',
    startDate: '2026-10-13',
    endDate: '2026-10-28',
    totalDays: 16,
    status: RequestStatus.ManagerApproved,
    reason: 'International annual vacation.',
    createdAt: '2026-09-06T14:45:00Z',
  },
  {
    id: 'req-2003',
    employeeId: '44444444-4444-4444-4444-444444444444',
    employeeName: 'Ciney Monn',
    department: 'Operations',
    leaveType: 'Emergency Leave',
    startDate: '2026-10-17',
    endDate: '2026-10-18',
    totalDays: 2,
    status: RequestStatus.Pending,
    reason: 'Family urgent circumstance.',
    createdAt: '2026-09-08T08:10:00Z',
  },
];

export const INITIAL_HOLIDAYS: HolidayDetailsDto[] = [
  {
    id: 'hol-1',
    name: "New Year's Day",
    startDate: '2026-01-01T00:00:00Z',
    endDate: '2026-01-01T00:00:00Z',
    createdAt: '2025-12-01T00:00:00Z',
    createdBy: 'System Administrator',
  },
  {
    id: 'hol-2',
    name: 'Labour Day',
    startDate: '2026-05-01T00:00:00Z',
    endDate: '2026-05-01T00:00:00Z',
    createdAt: '2025-12-01T00:00:00Z',
    createdBy: 'System Administrator',
  },
  {
    id: 'hol-3',
    name: 'Christmas Day',
    startDate: '2026-12-25T00:00:00Z',
    endDate: '2026-12-25T00:00:00Z',
    createdAt: '2025-12-01T00:00:00Z',
    createdBy: 'System Administrator',
  },
  {
    id: 'hol-4',
    name: 'Thanksgiving',
    startDate: '2026-11-26T00:00:00Z',
    endDate: '2026-11-27T00:00:00Z',
    createdAt: '2025-12-01T00:00:00Z',
    createdBy: 'System Administrator',
  },
];

export const UPCOMING_TEAM_LEAVE = [
  {
    id: 'tl-1',
    name: 'David Chen',
    type: 'Vacation',
    dates: 'Oct 10-15',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
  },
  {
    id: 'tl-2',
    name: 'Sarah Kim',
    type: 'Personal',
    dates: 'Oct 12',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
  },
  {
    id: 'tl-3',
    name: 'Annan Fiala',
    type: 'Vacation',
    dates: 'Oct 13-28',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
  },
  {
    id: 'tl-4',
    name: 'Ciney Monn',
    type: 'Personal',
    dates: 'Oct 17',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  },
];
