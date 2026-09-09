import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Users,
  Search,
  Plus,
  Edit2,
  Shield,
  Building2,
  UserCheck,
  PieChart,
  Trash2,
  Mail,
} from 'lucide-react';
import { PageHeader } from '../../components/shared/PageHeader';
import { SearchFilterBar } from '../../components/shared/SearchFilterBar';
import { Pagination } from '../../components/shared/Pagination';
import { EmptyState } from '../../components/shared/EmptyState';
import { ErrorState } from '../../components/shared/ErrorState';
import { ConfirmDialog } from '../../components/shared/ConfirmDialog';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Skeleton } from '../../components/ui/Skeleton';
import { Table, TableHead, TableBody, TableRow, TableHeaderCell, TableCell } from '../../components/ui/Table';
import { employeesApi } from '../../api/employees.api';
import { departmentsApi } from '../../api/departments.api';
import { balancesApi } from '../../api/balances.api';
import { EmployeeSummaryDto, EmployeeDetailsDto } from '../../types/employee.types';
import { useToast } from '../../hooks/useToast';
import { useDebounce } from '../../hooks/useDebounce';
import { getErrorMessage } from '../../utils/errors';

export const EmployeesPage: React.FC = () => {
  const { success, error: showError } = useToast();
  const queryClient = useQueryClient();

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('');
  const debouncedSearch = useDebounce(search, 300);

  // Modals state
  const [roleModalEmployee, setRoleModalEmployee] = useState<EmployeeSummaryDto | null>(null);
  const [selectedRole, setSelectedRole] = useState<'Employee' | 'Manager' | 'HR'>('Employee');

  const [deptModalEmployee, setDeptModalEmployee] = useState<EmployeeSummaryDto | null>(null);
  const [selectedDeptId, setSelectedDeptId] = useState('');

  const [balanceModalEmployee, setBalanceModalEmployee] = useState<EmployeeSummaryDto | null>(null);
  const [empBalances, setEmpBalances] = useState<any[]>([]);
  const [adjustDays, setAdjustDays] = useState<number>(10);
  const [adjustLeaveTypeId, setAdjustLeaveTypeId] = useState<string>('');

  const [deleteEmployeeId, setDeleteEmployeeId] = useState<string | null>(null);

  // Fetch employees
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['employees', page, debouncedSearch, roleFilter, departmentFilter],
    queryFn: () =>
      employeesApi.getEmployees({
        page,
        pageSize: 10,
        search: debouncedSearch,
        role: roleFilter || undefined,
        departmentId: departmentFilter || undefined,
      }),
  });

  // Fetch departments for filter & assignment
  const { data: deptData } = useQuery({
    queryKey: ['departments'],
    queryFn: () => departmentsApi.getDepartments(),
  });

  const departments = deptData?.items || [];

  // Update Role Mutation
  const roleMutation = useMutation({
    mutationFn: ({ id, role }: { id: string; role: 'Employee' | 'Manager' | 'HR' }) =>
      employeesApi.updateEmployeeRole(id, { role }),
    onSuccess: () => {
      success('Employee role updated successfully.');
      queryClient.invalidateQueries({ queryKey: ['employees'] });
      setRoleModalEmployee(null);
    },
    onError: (err) => showError(getErrorMessage(err)),
  });

  // Assign Department Mutation
  const deptMutation = useMutation({
    mutationFn: ({ id, deptId }: { id: string; deptId: string }) =>
      employeesApi.assignDepartment(id, deptId),
    onSuccess: () => {
      success('Employee department updated successfully.');
      queryClient.invalidateQueries({ queryKey: ['employees'] });
      setDeptModalEmployee(null);
    },
    onError: (err) => showError(getErrorMessage(err)),
  });

  // Adjust Balance Mutation
  const balanceMutation = useMutation({
    mutationFn: ({ empId, ltId, days }: { empId: string; ltId: string; days: number }) =>
      balancesApi.updateEmployeeBalance(empId, ltId, { remainingDays: days }),
    onSuccess: () => {
      success('Leave balance adjusted successfully.');
      queryClient.invalidateQueries({ queryKey: ['myBalances'] });
      setBalanceModalEmployee(null);
    },
    onError: (err) => showError(getErrorMessage(err)),
  });

  // Delete Employee Mutation
  const deleteMutation = useMutation({
    mutationFn: (id: string) => employeesApi.deleteEmployee(id),
    onSuccess: () => {
      success('Employee record removed.');
      queryClient.invalidateQueries({ queryKey: ['employees'] });
      setDeleteEmployeeId(null);
    },
    onError: (err) => showError(getErrorMessage(err)),
  });

  const openBalanceModal = async (emp: EmployeeSummaryDto) => {
    setBalanceModalEmployee(emp);
    const list = await balancesApi.getEmployeeBalances(emp.id);
    setEmpBalances(list);
    if (list.length > 0) {
      setAdjustLeaveTypeId(list[0].leaveTypeId);
      setAdjustDays(list[0].remainingDays);
    }
  };

  const employees = data?.items || [];

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      <PageHeader
        title="Employee Directory"
        subtitle="Manage employees, organizational roles, department assignments, and leave balances."
      />

      <Card className="p-4">
        <SearchFilterBar
          search={search}
          onSearchChange={(v) => {
            setSearch(v);
            setPage(1);
          }}
          placeholder="Search by employee name or email..."
        >
          <div className="flex items-center gap-2 flex-wrap">
            <select
              value={roleFilter}
              onChange={(e) => {
                setRoleFilter(e.target.value);
                setPage(1);
              }}
              className="bg-white text-gray-800 text-xs rounded-xl border border-gray-200 py-2 px-3 focus:outline-none focus:border-brand-teal"
            >
              <option value="">All Roles</option>
              <option value="Employee">Employee</option>
              <option value="Manager">Manager</option>
              <option value="HR">HR</option>
            </select>

            <select
              value={departmentFilter}
              onChange={(e) => {
                setDepartmentFilter(e.target.value);
                setPage(1);
              }}
              className="bg-white text-gray-800 text-xs rounded-xl border border-gray-200 py-2 px-3 focus:outline-none focus:border-brand-teal"
            >
              <option value="">All Departments</option>
              {departments.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name}
                </option>
              ))}
            </select>
          </div>
        </SearchFilterBar>

        {isLoading ? (
          <div className="space-y-3 p-4">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-12 w-full rounded-xl" />
            ))}
          </div>
        ) : isError ? (
          <ErrorState message={getErrorMessage(error)} onRetry={() => refetch()} />
        ) : employees.length === 0 ? (
          <EmptyState
            title="No employees found"
            description="No employee records matched your search filters."
          />
        ) : (
          <div className="overflow-hidden rounded-xl border border-[#E5EAF0]">
            <Table>
              <TableHead>
                <tr>
                  <TableHeaderCell>Employee</TableHeaderCell>
                  <TableHeaderCell>Email</TableHeaderCell>
                  <TableHeaderCell>Role & Actions</TableHeaderCell>
                  <TableHeaderCell className="text-right">Manage</TableHeaderCell>
                </tr>
              </TableHead>
              <TableBody>
                {employees.map((emp) => (
                  <TableRow key={emp.id}>
                    <TableCell>
                      <span className="font-bold text-navy-900">{emp.fullName}</span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1.5 text-xs text-gray-600">
                        <Mail className="w-3.5 h-3.5 text-gray-400" />
                        <span>{emp.email}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="xs"
                          onClick={() => {
                            setRoleModalEmployee(emp);
                            setSelectedRole('Employee');
                          }}
                          className="text-xs"
                          leftIcon={<Shield className="w-3 h-3 text-brand-darkTeal" />}
                        >
                          Role
                        </Button>
                        <Button
                          variant="ghost"
                          size="xs"
                          onClick={() => {
                            setDeptModalEmployee(emp);
                            setSelectedDeptId(departments[0]?.id || '');
                          }}
                          className="text-xs"
                          leftIcon={<Building2 className="w-3 h-3 text-gray-500" />}
                        >
                          Dept
                        </Button>
                        <Button
                          variant="ghost"
                          size="xs"
                          onClick={() => openBalanceModal(emp)}
                          className="text-xs"
                          leftIcon={<PieChart className="w-3 h-3 text-brand-orange" />}
                        >
                          Balance
                        </Button>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="xs"
                        className="text-rose-600 hover:text-rose-700 hover:bg-rose-50"
                        onClick={() => setDeleteEmployeeId(emp.id)}
                        title="Delete employee"
                        leftIcon={<Trash2 className="w-3.5 h-3.5" />}
                      >
                        Remove
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            <Pagination
              currentPage={data?.page || 1}
              totalPages={data?.totalPages || 1}
              totalCount={data?.totalCount || 0}
              pageSize={10}
              onPageChange={setPage}
            />
          </div>
        )}
      </Card>

      {/* Role Assignment Modal */}
      <Modal
        isOpen={!!roleModalEmployee}
        onClose={() => setRoleModalEmployee(null)}
        title="Update Employee Role"
        size="sm"
      >
        <div className="space-y-4 text-xs">
          <p className="text-gray-600">
            Select new role for <strong>{roleModalEmployee?.fullName}</strong>:
          </p>

          <Select
            label="Designated Role"
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value as any)}
          >
            <option value="Employee">Employee</option>
            <option value="Manager">Manager</option>
            <option value="HR">HR Administrator</option>
          </Select>

          <div className="pt-3 flex items-center justify-end gap-2 border-t border-gray-100">
            <Button variant="outline" size="sm" onClick={() => setRoleModalEmployee(null)}>
              Cancel
            </Button>
            <Button
              variant="primary"
              size="sm"
              isLoading={roleMutation.isPending}
              onClick={() =>
                roleModalEmployee &&
                roleMutation.mutate({ id: roleModalEmployee.id, role: selectedRole })
              }
            >
              Save Role
            </Button>
          </div>
        </div>
      </Modal>

      {/* Department Assignment Modal */}
      <Modal
        isOpen={!!deptModalEmployee}
        onClose={() => setDeptModalEmployee(null)}
        title="Assign Department"
        size="sm"
      >
        <div className="space-y-4 text-xs">
          <p className="text-gray-600">
            Select department for <strong>{deptModalEmployee?.fullName}</strong>:
          </p>

          <Select
            label="Department"
            value={selectedDeptId}
            onChange={(e) => setSelectedDeptId(e.target.value)}
          >
            {departments.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name}
              </option>
            ))}
          </Select>

          <div className="pt-3 flex items-center justify-end gap-2 border-t border-gray-100">
            <Button variant="outline" size="sm" onClick={() => setDeptModalEmployee(null)}>
              Cancel
            </Button>
            <Button
              variant="primary"
              size="sm"
              isLoading={deptMutation.isPending}
              onClick={() =>
                deptModalEmployee &&
                deptMutation.mutate({ id: deptModalEmployee.id, deptId: selectedDeptId })
              }
            >
              Assign Department
            </Button>
          </div>
        </div>
      </Modal>

      {/* Leave Balance Adjustment Modal */}
      <Modal
        isOpen={!!balanceModalEmployee}
        onClose={() => setBalanceModalEmployee(null)}
        title="Adjust Leave Balance"
        size="sm"
      >
        <div className="space-y-4 text-xs">
          <p className="text-gray-600">
            Modify leave balance for <strong>{balanceModalEmployee?.fullName}</strong>:
          </p>

          <Select
            label="Leave Type"
            value={adjustLeaveTypeId}
            onChange={(e) => {
              const id = e.target.value;
              setAdjustLeaveTypeId(id);
              const found = empBalances.find((b) => b.leaveTypeId === id);
              if (found) setAdjustDays(found.remainingDays);
            }}
          >
            {empBalances.map((b) => (
              <option key={b.leaveTypeId} value={b.leaveTypeId}>
                {b.leaveType} (Current: {b.remainingDays}d)
              </option>
            ))}
          </Select>

          <Input
            type="number"
            label="New Remaining Days"
            min={0}
            max={60}
            value={adjustDays}
            onChange={(e) => setAdjustDays(parseInt(e.target.value) || 0)}
          />

          <div className="pt-3 flex items-center justify-end gap-2 border-t border-gray-100">
            <Button variant="outline" size="sm" onClick={() => setBalanceModalEmployee(null)}>
              Cancel
            </Button>
            <Button
              variant="primary"
              size="sm"
              isLoading={balanceMutation.isPending}
              onClick={() =>
                balanceModalEmployee &&
                balanceMutation.mutate({
                  empId: balanceModalEmployee.id,
                  ltId: adjustLeaveTypeId,
                  days: adjustDays,
                })
              }
            >
              Update Balance
            </Button>
          </div>
        </div>
      </Modal>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={!!deleteEmployeeId}
        onClose={() => setDeleteEmployeeId(null)}
        onConfirm={() => deleteEmployeeId && deleteMutation.mutate(deleteEmployeeId)}
        title="Remove Employee Record?"
        message="Are you sure you want to remove this employee from the organization directory?"
        confirmText="Yes, Remove"
        variant="danger"
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
};
