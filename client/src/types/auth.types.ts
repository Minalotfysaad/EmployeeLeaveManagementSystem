export interface LoginRequestDto {
  email: string;
  password: string;
}

export interface RegisterRequestDto {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  departmentId?: string;
}

export interface AuthResponseDto {
  email: string;
  token: string;
  fullName: string;
}

export interface DecodedJwtToken {
  nameid: string; // Employee Guid
  email: string;
  name: string;
  role: string | string[];
  nbf?: number;
  exp?: number;
  iss?: string;
  aud?: string;
}

export interface AuthUser {
  id: string;
  email: string;
  fullName: string;
  roles: string[];
}
