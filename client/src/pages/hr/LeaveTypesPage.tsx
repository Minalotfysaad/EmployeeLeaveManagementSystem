import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Layers, Plus, Edit2, Trash2 } from 'lucide-react';
import { PageHeader } from '../../components/shared/PageHeader';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { Input } from '../../components/ui/Input';
import { Skeleton } from '../../components/ui/Skeleton';
import { Table, TableHead, TableBody, TableRow, TableHeaderCell, TableCell } from '../../components/ui/Table';
import { ConfirmDialog } from '../../components/shared/ConfirmDialog';
import { leaveTypesApi } from '../../api/leaveTypes.api';
import { LeaveTypeDetailsDto } from '../../types/leaveType.types';
import { useToast } from '../../hooks/useToast';
import { getErrorMessage } from '../../utils/errors';

export const LeaveTypesPage: React.FC = () => {
  const { success, error: showError } = useToast();
  const queryClient = useQueryClient();

  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editingType, setEditingType] = useState<LeaveTypeDetailsDto | null>(null);

  const [name, setName] = useState('');
  const [defaultDays, setDefaultDays] = useState(20);
  const [description, setDescription] = useState('');

  const [deleteTypeId, setDeleteTypeId] = useState<string | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ['leaveTypes'],
    queryFn: () => leaveTypesApi.getLeaveTypes(),
  });

  const createMutation = useMutation({
    mutationFn: (dto: { name: string; defaultDays: number; description?: string }) =>
      leaveTypesApi.createLeaveType(dto),
    onSuccess: () => {
      success('Leave type created successfully.');
      queryClient.invalidateQueries({ queryKey: ['leaveTypes'] });
      setCreateModalOpen(false);
      resetForm();
    },
    onError: (err) => showError(getErrorMessage(err)),
  });

  const updateMutation = useMutation({
    mutationFn: ({
      id,
      dto,
    }: {
      id: string;
      dto: { name: string; defaultDays: number; description?: string };
    }) => leaveTypesApi.updateLeaveType(id, dto),
    onSuccess: () => {
      success('Leave type updated.');
      queryClient.invalidateQueries({ queryKey: ['leaveTypes'] });
      setEditingType(null);
      resetForm();
    },
    onError: (err) => showError(getErrorMessage(err)),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => leaveTypesApi.deleteLeaveType(id),
    onSuccess: () => {
      success('Leave type deleted.');
      queryClient.invalidateQueries({ queryKey: ['leaveTypes'] });
      setDeleteTypeId(null);
    },
    onError: (err) => showError(getErrorMessage(err)),
  });

  const resetForm = () => {
    setName('');
    setDefaultDays(20);
    setDescription('');
  };

  const openEditModal = (lt: LeaveTypeDetailsDto) => {
    setEditingType(lt);
    setName(lt.name);
    setDefaultDays(lt.defaultDays);
    setDescription(lt.description || '');
  };

  const leaveTypes = data?.items || [];

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      <PageHeader
        title="Leave Types & Allowances"
        subtitle="Configure organization leave categories, default annual day allowances, and policies."
        actions={
          <Button
            variant="primary"
            leftIcon={<Plus className="w-4 h-4" />}
            onClick={() => {
              resetForm();
              setCreateModalOpen(true);
            }}
          >
            Add Leave Type
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
                  <TableHeaderCell>Category Name</TableHeaderCell>
                  <TableHeaderCell>Default Allowance</TableHeaderCell>
                  <TableHeaderCell>Description</TableHeaderCell>
                  <TableHeaderCell className="text-right">Actions</TableHeaderCell>
                </tr>
              </TableHead>
              <TableBody>
                {leaveTypes.map((lt) => (
                  <TableRow key={lt.id}>
                    <TableCell>
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-brand-lightTeal text-brand-darkTeal flex items-center justify-center">
                          <Layers className="w-4 h-4" />
                        </div>
                        <span className="font-bold text-navy-900">{lt.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="font-bold text-navy-900 bg-gray-100 px-2.5 py-1 rounded-lg text-xs">
                        {lt.defaultDays} days / year
                      </span>
                    </TableCell>
                    <TableCell className="max-w-md text-xs text-gray-500">
                      {(lt as any).description || 'Standard category leave allowance.'}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Button
                          variant="ghost"
                          size="xs"
                          onClick={() => openEditModal(lt as any)}
                          leftIcon={<Edit2 className="w-3.5 h-3.5 text-gray-500" />}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="ghost"
                          size="xs"
                          className="text-rose-600 hover:text-rose-700 hover:bg-rose-50"
                          onClick={() => setDeleteTypeId(lt.id)}
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
        title="Create Leave Type"
        size="sm"
      >
        <div className="space-y-4">
          <Input
            label="Category Name"
            placeholder="e.g. Parental Leave, Study Leave"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <Input
            type="number"
            label="Default Days per Year"
            required
            min={1}
            max={90}
            value={defaultDays}
            onChange={(e) => setDefaultDays(parseInt(e.target.value) || 0)}
          />

          <Input
            label="Description (Optional)"
            placeholder="Brief notes about eligibility..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <div className="pt-3 flex items-center justify-end gap-2 border-t border-gray-100">
            <Button variant="outline" size="sm" onClick={() => setCreateModalOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="primary"
              size="sm"
              isLoading={createMutation.isPending}
              disabled={!name.trim() || defaultDays <= 0}
              onClick={() =>
                createMutation.mutate({
                  name: name.trim(),
                  defaultDays,
                  description: description.trim(),
                })
              }
            >
              Create
            </Button>
          </div>
        </div>
      </Modal>

      {/* Edit Modal */}
      <Modal
        isOpen={!!editingType}
        onClose={() => setEditingType(null)}
        title="Edit Leave Type"
        size="sm"
      >
        <div className="space-y-4">
          <Input
            label="Category Name"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <Input
            type="number"
            label="Default Days per Year"
            required
            min={1}
            max={90}
            value={defaultDays}
            onChange={(e) => setDefaultDays(parseInt(e.target.value) || 0)}
          />

          <Input
            label="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <div className="pt-3 flex items-center justify-end gap-2 border-t border-gray-100">
            <Button variant="outline" size="sm" onClick={() => setEditingType(null)}>
              Cancel
            </Button>
            <Button
              variant="primary"
              size="sm"
              isLoading={updateMutation.isPending}
              disabled={!name.trim() || defaultDays <= 0}
              onClick={() =>
                editingType &&
                updateMutation.mutate({
                  id: editingType.id,
                  dto: { name: name.trim(), defaultDays, description: description.trim() },
                })
              }
            >
              Save Changes
            </Button>
          </div>
        </div>
      </Modal>

      {/* Delete Dialog */}
      <ConfirmDialog
        isOpen={!!deleteTypeId}
        onClose={() => setDeleteTypeId(null)}
        onConfirm={() => deleteTypeId && deleteMutation.mutate(deleteTypeId)}
        title="Delete Leave Type?"
        message="Are you sure you want to delete this leave category? Existing balance allocations may be affected."
        confirmText="Yes, Delete"
        variant="danger"
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
};
