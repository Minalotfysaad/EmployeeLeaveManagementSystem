import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Building2, Plus, Edit2, Trash2 } from 'lucide-react';
import { PageHeader } from '../../components/shared/PageHeader';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { Input } from '../../components/ui/Input';
import { Skeleton } from '../../components/ui/Skeleton';
import { Table, TableHead, TableBody, TableRow, TableHeaderCell, TableCell } from '../../components/ui/Table';
import { ConfirmDialog } from '../../components/shared/ConfirmDialog';
import { departmentsApi } from '../../api/departments.api';
import { DepartmentDetailsDto } from '../../types/department.types';
import { useToast } from '../../hooks/useToast';
import { getErrorMessage } from '../../utils/errors';

export const DepartmentsPage: React.FC = () => {
  const { success, error: showError } = useToast();
  const queryClient = useQueryClient();

  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editingDept, setEditingDept] = useState<DepartmentDetailsDto | null>(null);
  const [deptName, setDeptName] = useState('');
  const [deleteDeptId, setDeleteDeptId] = useState<string | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ['departments'],
    queryFn: () => departmentsApi.getDepartments(),
  });

  const createMutation = useMutation({
    mutationFn: (name: string) => departmentsApi.createDepartment({ name }),
    onSuccess: () => {
      success('Department created successfully.');
      queryClient.invalidateQueries({ queryKey: ['departments'] });
      setCreateModalOpen(false);
      setDeptName('');
    },
    onError: (err) => showError(getErrorMessage(err)),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, name }: { id: string; name: string }) =>
      departmentsApi.updateDepartment(id, { name }),
    onSuccess: () => {
      success('Department updated successfully.');
      queryClient.invalidateQueries({ queryKey: ['departments'] });
      setEditingDept(null);
      setDeptName('');
    },
    onError: (err) => showError(getErrorMessage(err)),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => departmentsApi.deleteDepartment(id),
    onSuccess: () => {
      success('Department deleted.');
      queryClient.invalidateQueries({ queryKey: ['departments'] });
      setDeleteDeptId(null);
    },
    onError: (err) => showError(getErrorMessage(err)),
  });

  const departments = data?.items || [];

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      <PageHeader
        title="Departments"
        subtitle="Organize company divisions and departmental approval structures."
        actions={
          <Button
            variant="primary"
            leftIcon={<Plus className="w-4 h-4" />}
            onClick={() => {
              setDeptName('');
              setCreateModalOpen(true);
            }}
          >
            Add Department
          </Button>
        }
      />

      <Card className="p-4">
        {isLoading ? (
          <div className="space-y-3 p-4">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-12 w-full rounded-xl" />
            ))}
          </div>
        ) : (
          <div className="overflow-hidden rounded-xl border border-[#E5EAF0]">
            <Table>
              <TableHead>
                <tr>
                  <TableHeaderCell>Department Name</TableHeaderCell>
                  <TableHeaderCell>Identifier</TableHeaderCell>
                  <TableHeaderCell className="text-right">Actions</TableHeaderCell>
                </tr>
              </TableHead>
              <TableBody>
                {departments.map((dept) => (
                  <TableRow key={dept.id}>
                    <TableCell>
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-gray-500">
                          <Building2 className="w-4 h-4" />
                        </div>
                        <span className="font-bold text-navy-900">{dept.name}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-xs text-gray-400 font-mono">{dept.id}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Button
                          variant="ghost"
                          size="xs"
                          onClick={() => {
                            setEditingDept(dept);
                            setDeptName(dept.name);
                          }}
                          leftIcon={<Edit2 className="w-3.5 h-3.5 text-gray-500" />}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="ghost"
                          size="xs"
                          className="text-rose-600 hover:text-rose-700 hover:bg-rose-50"
                          onClick={() => setDeleteDeptId(dept.id)}
                          leftIcon={<Trash2 className="w-3.5 h-3.5" />}
                        >
                          Delete
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </Card>

      {/* Create Modal */}
      <Modal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        title="Create Department"
        size="sm"
      >
        <div className="space-y-4">
          <Input
            label="Department Name"
            placeholder="e.g. Engineering, Sales, Product"
            required
            value={deptName}
            onChange={(e) => setDeptName(e.target.value)}
          />

          <div className="pt-3 flex items-center justify-end gap-2 border-t border-gray-100">
            <Button variant="outline" size="sm" onClick={() => setCreateModalOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="primary"
              size="sm"
              isLoading={createMutation.isPending}
              disabled={!deptName.trim()}
              onClick={() => createMutation.mutate(deptName.trim())}
            >
              Create
            </Button>
          </div>
        </div>
      </Modal>

      {/* Edit Modal */}
      <Modal
        isOpen={!!editingDept}
        onClose={() => setEditingDept(null)}
        title="Edit Department"
        size="sm"
      >
        <div className="space-y-4">
          <Input
            label="Department Name"
            required
            value={deptName}
            onChange={(e) => setDeptName(e.target.value)}
          />

          <div className="pt-3 flex items-center justify-end gap-2 border-t border-gray-100">
            <Button variant="outline" size="sm" onClick={() => setEditingDept(null)}>
              Cancel
            </Button>
            <Button
              variant="primary"
              size="sm"
              isLoading={updateMutation.isPending}
              disabled={!deptName.trim()}
              onClick={() =>
                editingDept && updateMutation.mutate({ id: editingDept.id, name: deptName.trim() })
              }
            >
              Save Changes
            </Button>
          </div>
        </div>
      </Modal>

      {/* Delete Dialog */}
      <ConfirmDialog
        isOpen={!!deleteDeptId}
        onClose={() => setDeleteDeptId(null)}
        onConfirm={() => deleteDeptId && deleteMutation.mutate(deleteDeptId)}
        title="Delete Department?"
        message="Are you sure you want to delete this department? Employees assigned to it may need reassignment."
        confirmText="Yes, Delete"
        variant="danger"
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
};
