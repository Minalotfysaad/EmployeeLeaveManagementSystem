export interface PagedResult<T> {
  items: T[];
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

export interface QueryParameters {
  page?: number;
  pageSize?: number;
}

export interface EmployeeQueryParameters extends QueryParameters {
  search?: string;
  departmentId?: string;
  role?: string;
}

export interface ApiProblemDetails {
  type?: string;
  title: string;
  status: number;
  detail?: string;
  instance?: string;
  errors?: Record<string, string[]>;
}
