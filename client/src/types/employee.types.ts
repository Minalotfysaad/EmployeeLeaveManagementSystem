export interface EmployeeSummaryDto {
  id: string;
  fullName: string;
  email: string;
  roles?: string[];
  isSoleHR?: boolean;
}

export interface EmployeeDetailsDto {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  departmentName?: string;
  phoneNumber?: string;
  roles: string[];
  createdDate: string;
}

export interface UpdateEmployeeDto {
  firstName: string;
  lastName: string;
}

export interface UpdateEmployeeRoleDto {
  role: 'Employee' | 'Manager' | 'HR';
}

export type { EmployeeQueryParameters } from './api.types';
