import {
  INITIAL_DEPARTMENTS,
  INITIAL_LEAVE_TYPES,
  INITIAL_USERS,
  INITIAL_BALANCES,
  INITIAL_LEAVE_REQUESTS,
  INITIAL_HOLIDAYS,
} from './mockData';
import { RequestStatus, LeaveRequestDetailsDto, PendingLeaveRequestDto, CreateLeaveRequestDto } from '../../types/leaveRequest.types';
import { BalanceDto } from '../../types/balance.types';
import { DepartmentDetailsDto } from '../../types/department.types';
import { LeaveTypeDetailsDto } from '../../types/leaveType.types';
import { HolidayDetailsDto } from '../../types/holiday.types';
import { EmployeeDetailsDto, EmployeeSummaryDto, EmployeeQueryParameters } from '../../types/employee.types';
import { PagedResult } from '../../types/api.types';
import { calculateDays } from '../../utils/date';

class MockStore {
  private departments: DepartmentDetailsDto[];
  private leaveTypes: LeaveTypeDetailsDto[];
  private users: (EmployeeDetailsDto & { managerId?: string })[];
  private balances: Record<string, BalanceDto[]>;
  private requests: (LeaveRequestDetailsDto & { employeeId: string; employeeName: string; department: string })[];
  private holidays: HolidayDetailsDto[];

  constructor() {
    this.departments = this.load('leavo_mock_departments', INITIAL_DEPARTMENTS);
    this.leaveTypes = this.load('leavo_mock_leavetypes', INITIAL_LEAVE_TYPES);
    this.users = this.load('leavo_mock_users', INITIAL_USERS);
    this.balances = this.load('leavo_mock_balances', INITIAL_BALANCES);
    this.requests = this.load('leavo_mock_requests', INITIAL_LEAVE_REQUESTS);
    this.holidays = this.load('leavo_mock_holidays', INITIAL_HOLIDAYS);
  }

  private load<T>(key: string, fallback: T): T {
    try {
      const stored = localStorage.getItem(key);
      return stored ? JSON.parse(stored) : fallback;
    } catch {
      return fallback;
    }
  }

  private save(key: string, data: unknown) {
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (e) {
      console.error('Storage error', e);
    }
  }

  public resetToDefaults() {
    localStorage.removeItem('leavo_mock_departments');
    localStorage.removeItem('leavo_mock_leavetypes');
    localStorage.removeItem('leavo_mock_users');
    localStorage.removeItem('leavo_mock_balances');
    localStorage.removeItem('leavo_mock_requests');
    localStorage.removeItem('leavo_mock_holidays');
    this.departments = [...INITIAL_DEPARTMENTS];
    this.leaveTypes = [...INITIAL_LEAVE_TYPES];
    this.users = [...INITIAL_USERS];
    this.balances = JSON.parse(JSON.stringify(INITIAL_BALANCES));
    this.requests = [...INITIAL_LEAVE_REQUESTS];
    this.holidays = [...INITIAL_HOLIDAYS];
  }

  // Auth
  public getUserByEmail(email: string) {
    return this.users.find(u => u.email.toLowerCase() === email.toLowerCase());
  }

  public getUserById(id: string) {
    return this.users.find(u => u.id === id);
  }

  public getUsers() {
    return this.users;
  }

  // Balances
  public getBalances(employeeId: string): BalanceDto[] {
    if (!this.balances[employeeId]) {
      // Default populate
      this.balances[employeeId] = this.leaveTypes.map(lt => ({
        leaveTypeId: lt.id,
        leaveType: lt.name,
        remainingDays: lt.defaultDays,
      }));
      this.save('leavo_mock_balances', this.balances);
    }
    return this.balances[employeeId];
  }

  public updateBalance(employeeId: string, leaveTypeId: string, remainingDays: number) {
    const list = this.getBalances(employeeId);
    const item = list.find(b => b.leaveTypeId === leaveTypeId);
    if (item) {
      item.remainingDays = remainingDays;
      this.save('leavo_mock_balances', this.balances);
    }
  }

  // Leave Requests
  public getMyRequests(employeeId: string, params: EmployeeQueryParameters = {}): PagedResult<LeaveRequestDetailsDto> {
    let items = this.requests.filter(r => r.employeeId === employeeId);

    if (params.search) {
      const s = params.search.toLowerCase();
      items = items.filter(r => r.leaveType.toLowerCase().includes(s) || r.reason?.toLowerCase().includes(s));
    }

    const page = params.page || 1;
    const pageSize = params.pageSize || 10;
    const totalCount = items.length;
    const startIndex = (page - 1) * pageSize;
    const paginatedItems = items.slice(startIndex, startIndex + pageSize);

    return {
      items: paginatedItems,
      page,
      pageSize,
      totalCount,
      totalPages: Math.ceil(totalCount / pageSize) || 1,
      hasPreviousPage: page > 1,
      hasNextPage: page < Math.ceil(totalCount / pageSize),
    };
  }

  public getAllRequests(params: EmployeeQueryParameters = {}): PagedResult<LeaveRequestDetailsDto> {
    let items = [...this.requests];

    if (params.search) {
      const s = params.search.toLowerCase();
      items = items.filter(r => r.employeeName.toLowerCase().includes(s) || r.department.toLowerCase().includes(s) || r.leaveType.toLowerCase().includes(s));
    }

    const page = params.page || 1;
    const pageSize = params.pageSize || 10;
    const totalCount = items.length;
    const startIndex = (page - 1) * pageSize;
    const paginatedItems = items.slice(startIndex, startIndex + pageSize);

    return {
      items: paginatedItems,
      page,
      pageSize,
      totalCount,
      totalPages: Math.ceil(totalCount / pageSize) || 1,
      hasPreviousPage: page > 1,
      hasNextPage: page < Math.ceil(totalCount / pageSize),
    };
  }

  public getRequestById(id: string): LeaveRequestDetailsDto | undefined {
    return this.requests.find(r => r.id === id);
  }

  public createRequest(employeeId: string, dto: CreateLeaveRequestDto): LeaveRequestDetailsDto {
    const user = this.getUserById(employeeId);
    const leaveType = this.leaveTypes.find(lt => lt.id === dto.leaveTypeId);

    if (!leaveType) {
      throw new Error('Leave type not found');
    }

    const totalDays = calculateDays(dto.startDate, dto.endDate);
    const balances = this.getBalances(employeeId);
    const balance = balances.find(b => b.leaveTypeId === dto.leaveTypeId);

    if (!balance || balance.remainingDays < totalDays) {
      throw new Error(`Insufficient leave balance. Remaining days: ${balance?.remainingDays || 0}`);
    }

    const newRequest = {
      id: `req-${Date.now()}`,
      employeeId,
      employeeName: user ? `${user.firstName} ${user.lastName}` : 'Current Employee',
      department: user?.departmentName || 'General',
      leaveType: leaveType.name,
      startDate: dto.startDate,
      endDate: dto.endDate,
      totalDays,
      status: RequestStatus.Pending,
      reason: dto.reason,
      createdAt: new Date().toISOString(),
    };

    this.requests.unshift(newRequest);
    this.save('leavo_mock_requests', this.requests);
    return newRequest;
  }

  public cancelRequest(requestId: string, employeeId?: string) {
    const req = this.requests.find(r => r.id === requestId && (!employeeId || r.employeeId === employeeId));
    if (!req) throw new Error('Request not found');
    if (req.status !== RequestStatus.Pending) throw new Error('Only pending requests can be cancelled');

    req.status = RequestStatus.Cancelled;
    this.save('leavo_mock_requests', this.requests);
  }

  // Manager Approvals
  public getManagerPendingRequests(params: EmployeeQueryParameters = {}): PagedResult<PendingLeaveRequestDto> {
    let items = this.requests.filter(r => r.status === RequestStatus.Pending);

    if (params.search) {
      const s = params.search.toLowerCase();
      items = items.filter(r => r.employeeName.toLowerCase().includes(s) || r.department.toLowerCase().includes(s));
    }

    const page = params.page || 1;
    const pageSize = params.pageSize || 10;
    const totalCount = items.length;
    const startIndex = (page - 1) * pageSize;
    const paginatedItems = items.slice(startIndex, startIndex + pageSize);

    return {
      items: paginatedItems,
      page,
      pageSize,
      totalCount,
      totalPages: Math.ceil(totalCount / pageSize) || 1,
      hasPreviousPage: page > 1,
      hasNextPage: page < Math.ceil(totalCount / pageSize),
    };
  }

  public managerApprove(requestId: string, _comment?: string) {
    const req = this.requests.find(r => r.id === requestId);
    if (!req) throw new Error('Request not found');
    if (req.status !== RequestStatus.Pending) throw new Error('Request is not pending manager approval');

    req.status = RequestStatus.ManagerApproved;
    this.save('leavo_mock_requests', this.requests);
  }

  public managerReject(requestId: string, _comment?: string) {
    const req = this.requests.find(r => r.id === requestId);
    if (!req) throw new Error('Request not found');
    if (req.status !== RequestStatus.Pending) throw new Error('Request is not pending manager approval');

    req.status = RequestStatus.RejectedByManager;
    this.save('leavo_mock_requests', this.requests);
  }

  // HR Approvals
  public getHRPendingRequests(params: EmployeeQueryParameters = {}): PagedResult<PendingLeaveRequestDto> {
    let items = this.requests.filter(r => r.status === RequestStatus.ManagerApproved);

    if (params.search) {
      const s = params.search.toLowerCase();
      items = items.filter(r => r.employeeName.toLowerCase().includes(s) || r.department.toLowerCase().includes(s));
    }

    const page = params.page || 1;
    const pageSize = params.pageSize || 10;
    const totalCount = items.length;
    const startIndex = (page - 1) * pageSize;
    const paginatedItems = items.slice(startIndex, startIndex + pageSize);

    return {
      items: paginatedItems,
      page,
      pageSize,
      totalCount,
      totalPages: Math.ceil(totalCount / pageSize) || 1,
      hasPreviousPage: page > 1,
      hasNextPage: page < Math.ceil(totalCount / pageSize),
    };
  }

  public hrApprove(requestId: string, _comment?: string) {
    const req = this.requests.find(r => r.id === requestId);
    if (!req) throw new Error('Request not found');
    if (req.status !== RequestStatus.ManagerApproved) throw new Error('Request must be ManagerApproved');

    req.status = RequestStatus.HRApproved;

    // Deduct leave balance
    const balances = this.getBalances(req.employeeId);
    const balance = balances.find(b => b.leaveType === req.leaveType);
    if (balance) {
      balance.remainingDays = Math.max(0, balance.remainingDays - req.totalDays);
      this.save('leavo_mock_balances', this.balances);
    }

    this.save('leavo_mock_requests', this.requests);
  }

  public hrReject(requestId: string, _comment?: string) {
    const req = this.requests.find(r => r.id === requestId);
    if (!req) throw new Error('Request not found');
    if (req.status !== RequestStatus.ManagerApproved) throw new Error('Request must be ManagerApproved');

    req.status = RequestStatus.RejectedByHR;
    this.save('leavo_mock_requests', this.requests);
  }

  // Employee Management
  public getEmployees(params: EmployeeQueryParameters = {}): PagedResult<EmployeeSummaryDto> {
    let list = this.users;

    if (params.search) {
      const s = params.search.toLowerCase();
      list = list.filter(u => `${u.firstName} ${u.lastName}`.toLowerCase().includes(s) || u.email.toLowerCase().includes(s));
    }
    if (params.departmentId) {
      const dept = this.departments.find(d => d.id === params.departmentId);
      if (dept) {
        list = list.filter(u => u.departmentName === dept.name);
      }
    }
    if (params.role) {
      list = list.filter(u => u.roles.includes(params.role!));
    }

    const page = params.page || 1;
    const pageSize = params.pageSize || 10;
    const totalCount = list.length;
    const startIndex = (page - 1) * pageSize;
    const paginated = list.slice(startIndex, startIndex + pageSize).map(u => ({
      id: u.id,
      fullName: `${u.firstName} ${u.lastName}`,
      email: u.email,
    }));

    return {
      items: paginated,
      page,
      pageSize,
      totalCount,
      totalPages: Math.ceil(totalCount / pageSize) || 1,
      hasPreviousPage: page > 1,
      hasNextPage: page < Math.ceil(totalCount / pageSize),
    };
  }

  public updateEmployee(id: string, dto: { firstName: string; lastName: string }) {
    const user = this.getUserById(id);
    if (user) {
      user.firstName = dto.firstName;
      user.lastName = dto.lastName;
      this.save('leavo_mock_users', this.users);
    }
  }

  public deleteEmployee(id: string) {
    this.users = this.users.filter(u => u.id !== id);
    this.save('leavo_mock_users', this.users);
  }

  public updateEmployeeRole(id: string, role: 'Employee' | 'Manager' | 'HR') {
    const user = this.getUserById(id);
    if (user) {
      if (!user.roles.includes(role)) {
        user.roles = [role, 'Employee'];
      }
      this.save('leavo_mock_users', this.users);
    }
  }

  public assignManager(employeeId: string, managerId: string) {
    const user = this.getUserById(employeeId);
    if (user) {
      user.managerId = managerId;
      this.save('leavo_mock_users', this.users);
    }
  }

  public assignDepartment(employeeId: string, departmentId: string) {
    const user = this.getUserById(employeeId);
    const dept = this.departments.find(d => d.id === departmentId);
    if (user && dept) {
      user.departmentName = dept.name;
      this.save('leavo_mock_users', this.users);
    }
  }

  // Departments
  public getDepartments(): DepartmentDetailsDto[] {
    return this.departments;
  }

  public createDepartment(name: string): DepartmentDetailsDto {
    const newDept: DepartmentDetailsDto = {
      id: `dept-${Date.now()}`,
      name,
    };
    this.departments.push(newDept);
    this.save('leavo_mock_departments', this.departments);
    return newDept;
  }

  public updateDepartment(id: string, name: string) {
    const dept = this.departments.find(d => d.id === id);
    if (dept) {
      dept.name = name;
      this.save('leavo_mock_departments', this.departments);
    }
  }

  public deleteDepartment(id: string) {
    this.departments = this.departments.filter(d => d.id !== id);
    this.save('leavo_mock_departments', this.departments);
  }

  // Leave Types
  public getLeaveTypes(): LeaveTypeDetailsDto[] {
    return this.leaveTypes;
  }

  public createLeaveType(name: string, defaultDays: number, description?: string): LeaveTypeDetailsDto {
    const newType: LeaveTypeDetailsDto = {
      id: `lt-${Date.now()}`,
      name,
      defaultDays,
      description,
    };
    this.leaveTypes.push(newType);
    this.save('leavo_mock_leavetypes', this.leaveTypes);
    return newType;
  }

  public updateLeaveType(id: string, name: string, defaultDays: number, description?: string) {
    const lt = this.leaveTypes.find(l => l.id === id);
    if (lt) {
      lt.name = name;
      lt.defaultDays = defaultDays;
      lt.description = description;
      this.save('leavo_mock_leavetypes', this.leaveTypes);
    }
  }

  public deleteLeaveType(id: string) {
    this.leaveTypes = this.leaveTypes.filter(l => l.id !== id);
    this.save('leavo_mock_leavetypes', this.leaveTypes);
  }

  // Holidays
  public getHolidays(): HolidayDetailsDto[] {
    return this.holidays;
  }

  public createHoliday(name: string, startDate: string, endDate: string): HolidayDetailsDto {
    const newHol: HolidayDetailsDto = {
      id: `hol-${Date.now()}`,
      name,
      startDate: new Date(startDate).toISOString(),
      endDate: new Date(endDate).toISOString(),
      createdAt: new Date().toISOString(),
      createdBy: 'System Administrator',
    };
    this.holidays.push(newHol);
    this.save('leavo_mock_holidays', this.holidays);
    return newHol;
  }

  public updateHoliday(id: string, name: string, startDate: string, endDate: string) {
    const h = this.holidays.find(hol => hol.id === id);
    if (h) {
      h.name = name;
      h.startDate = new Date(startDate).toISOString();
      h.endDate = new Date(endDate).toISOString();
      this.save('leavo_mock_holidays', this.holidays);
    }
  }

  public deleteHoliday(id: string) {
    this.holidays = this.holidays.filter(h => h.id !== id);
    this.save('leavo_mock_holidays', this.holidays);
  }

  // Dashboards
  public getEmployeeDashboard(employeeId: string) {
    const balances = this.getBalances(employeeId);
    const myReqs = this.requests.filter(r => r.employeeId === employeeId);

    const pendingRequests = myReqs.filter(r => r.status === RequestStatus.Pending).length;
    const approvedRequests = myReqs.filter(r => r.status === RequestStatus.HRApproved).length;
    const rejectedRequests = myReqs.filter(
      r => r.status === RequestStatus.RejectedByManager || r.status === RequestStatus.RejectedByHR
    ).length;
    const upcomingLeaveRequests = myReqs.filter(
      r => r.status === RequestStatus.HRApproved && new Date(r.startDate) >= new Date()
    ).length;

    return {
      leaveBalances: balances,
      pendingRequests,
      approvedRequests,
      rejectedRequests,
      upcomingLeaveRequests,
    };
  }

  public getManagerDashboard() {
    const pending = this.requests.filter(r => r.status === RequestStatus.Pending).length;
    const approved = this.requests.filter(r => r.status === RequestStatus.HRApproved).length;
    const rejected = this.requests.filter(
      r => r.status === RequestStatus.RejectedByManager || r.status === RequestStatus.RejectedByHR
    ).length;

    return {
      teamSize: this.users.length,
      pendingRequests: pending,
      approvedRequests: approved,
      rejectedRequests: rejected,
      employeesCurrentlyOnLeave: 1,
    };
  }

  public getHRDashboard() {
    const pendingMgr = this.requests.filter(r => r.status === RequestStatus.Pending).length;
    const pendingHR = this.requests.filter(r => r.status === RequestStatus.ManagerApproved).length;

    return {
      totalEmployees: this.users.length,
      totalDepartments: this.departments.length,
      pendingManagerApprovals: pendingMgr,
      pendingHRApprovals: pendingHR,
      employeesCurrentlyOnLeave: 2,
      upcomingHolidays: this.holidays.length,
      leaveRequestsThisMonth: this.requests.length,
    };
  }
}

export const mockStore = new MockStore();
