import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { CalendarDays, Plus, Edit2, Trash2, Calendar } from 'lucide-react';
import { PageHeader } from '../../components/shared/PageHeader';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { Input } from '../../components/ui/Input';
import { Skeleton } from '../../components/ui/Skeleton';
import { Table, TableHead, TableBody, TableRow, TableHeaderCell, TableCell } from '../../components/ui/Table';
import { ConfirmDialog } from '../../components/shared/ConfirmDialog';
import { holidaysApi } from '../../api/holidays.api';
import { HolidayDetailsDto } from '../../types/holiday.types';
import { useToast } from '../../hooks/useToast';
import { formatDateRange, getTodayDateString } from '../../utils/date';
import { getErrorMessage } from '../../utils/errors';

export const HolidaysPage: React.FC = () => {
  const { success, error: showError } = useToast();
  const queryClient = useQueryClient();

  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editingHoliday, setEditingHoliday] = useState<HolidayDetailsDto | null>(null);

  const [name, setName] = useState('');
  const [startDate, setStartDate] = useState(getTodayDateString());
  const [endDate, setEndDate] = useState(getTodayDateString());

  const [deleteHolidayId, setDeleteHolidayId] = useState<string | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ['holidays'],
    queryFn: () => holidaysApi.getHolidays(),
  });

  const createMutation = useMutation({
    mutationFn: (dto: { name: string; startDate: string; endDate: string }) =>
      holidaysApi.createHoliday(dto),
    onSuccess: () => {
      success('Public holiday created successfully.');
      queryClient.invalidateQueries({ queryKey: ['holidays'] });
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
      dto: { name: string; startDate: string; endDate: string };
    }) => holidaysApi.updateHoliday(id, dto),
    onSuccess: () => {
      success('Public holiday updated.');
      queryClient.invalidateQueries({ queryKey: ['holidays'] });
      setEditingHoliday(null);
      resetForm();
    },
    onError: (err) => showError(getErrorMessage(err)),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => holidaysApi.deleteHoliday(id),
    onSuccess: () => {
      success('Public holiday removed.');
      queryClient.invalidateQueries({ queryKey: ['holidays'] });
      setDeleteHolidayId(null);
    },
    onError: (err) => showError(getErrorMessage(err)),
  });

  const resetForm = () => {
    setName('');
    setStartDate(getTodayDateString());
    setEndDate(getTodayDateString());
  };

  const openEditModal = (h: HolidayDetailsDto) => {
    setEditingHoliday(h);
    setName(h.name);
    setStartDate(h.startDate.slice(0, 10));
    setEndDate(h.endDate.slice(0, 10));
  };

  const holidays = data?.items || [];

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      <PageHeader
        title="Public Holidays"
        subtitle="Manage official statutory and organization holidays recognized across the company."
        actions={
          <Button
            variant="primary"
            leftIcon={<Plus className="w-4 h-4" />}
            onClick={() => {
              resetForm();
              setCreateModalOpen(true);
            }}
          >
            Add Holiday
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
                  <TableHeaderCell>Holiday Name</TableHeaderCell>
                  <TableHeaderCell>Observed Dates</TableHeaderCell>
                  <TableHeaderCell>Added By</TableHeaderCell>
                  <TableHeaderCell className="text-right">Actions</TableHeaderCell>
                </tr>
              </TableHead>
              <TableBody>
                {holidays.map((h) => (
                  <TableRow key={h.id}>
                    <TableCell>
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
                          <CalendarDays className="w-4 h-4" />
                        </div>
                        <span className="font-bold text-navy-900">{h.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1.5 text-xs text-gray-700">
                        <Calendar className="w-3.5 h-3.5 text-brand-teal" />
                        <span>{formatDateRange(h.startDate, h.endDate)}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-xs text-gray-500">{h.createdBy}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Button
                          variant="ghost"
                          size="xs"
                          onClick={() => openEditModal(h as any)}
                          leftIcon={<Edit2 className="w-3.5 h-3.5 text-gray-500" />}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="ghost"
                          size="xs"
                          className="text-rose-600 hover:text-rose-700 hover:bg-rose-50"
                          onClick={() => setDeleteHolidayId(h.id)}
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
        title="Add Public Holiday"
        size="sm"
      >
        <div className="space-y-4">
          <Input
            label="Holiday Name"
            placeholder="e.g. Independence Day"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <div className="grid grid-cols-2 gap-3">
            <Input
              type="date"
              label="Start Date"
              required
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
            <Input
              type="date"
              label="End Date"
              required
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>

          <div className="pt-3 flex items-center justify-end gap-2 border-t border-gray-100">
            <Button variant="outline" size="sm" onClick={() => setCreateModalOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="primary"
              size="sm"
              isLoading={createMutation.isPending}
              disabled={!name.trim()}
              onClick={() =>
                createMutation.mutate({
                  name: name.trim(),
                  startDate,
                  endDate,
                })
              }
            >
              Add Holiday
            </Button>
          </div>
        </div>
      </Modal>

      {/* Edit Modal */}
      <Modal
        isOpen={!!editingHoliday}
        onClose={() => setEditingHoliday(null)}
        title="Edit Public Holiday"
        size="sm"
      >
        <div className="space-y-4">
          <Input
            label="Holiday Name"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <div className="grid grid-cols-2 gap-3">
            <Input
              type="date"
              label="Start Date"
              required
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
            <Input
              type="date"
              label="End Date"
              required
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>

          <div className="pt-3 flex items-center justify-end gap-2 border-t border-gray-100">
            <Button variant="outline" size="sm" onClick={() => setEditingHoliday(null)}>
              Cancel
            </Button>
            <Button
              variant="primary"
              size="sm"
              isLoading={updateMutation.isPending}
              disabled={!name.trim()}
              onClick={() =>
                editingHoliday &&
                updateMutation.mutate({
                  id: editingHoliday.id,
                  dto: { name: name.trim(), startDate, endDate },
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
        isOpen={!!deleteHolidayId}
        onClose={() => setDeleteHolidayId(null)}
        onConfirm={() => deleteHolidayId && deleteMutation.mutate(deleteHolidayId)}
        title="Delete Holiday?"
        message="Are you sure you want to remove this public holiday from the calendar?"
        confirmText="Yes, Remove"
        variant="danger"
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
};
