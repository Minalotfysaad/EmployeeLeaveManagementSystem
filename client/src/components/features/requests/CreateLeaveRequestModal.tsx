import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Modal } from '../../ui/Modal';
import { Button } from '../../ui/Button';
import { Input } from '../../ui/Input';
import { Select } from '../../ui/Select';
import { Alert } from '../../ui/Alert';
import { balancesApi } from '../../../api/balances.api';
import { leaveRequestsApi } from '../../../api/leaveRequests.api';
import { useToast } from '../../../hooks/useToast';
import { useAuth } from '../../../hooks/useAuth';
import { calculateDays, getTodayDateString } from '../../../utils/date';
import { getErrorMessage } from '../../../utils/errors';
import { Calendar, Clock, AlertTriangle } from 'lucide-react';

const leaveRequestSchema = z
  .object({
    leaveTypeId: z.string().min(1, 'Please select a leave type'),
    startDate: z.string().min(1, 'Please select a start date'),
    endDate: z.string().min(1, 'Please select an end date'),
    reason: z.string().min(5, 'Please provide a reason with at least 5 characters'),
  })
  .refine(
    (data) => {
      if (!data.startDate || !data.endDate) return true;
      return new Date(data.endDate) >= new Date(data.startDate);
    },
    {
      message: 'End date cannot be earlier than start date',
      path: ['endDate'],
    }
  );

type LeaveRequestFormData = z.infer<typeof leaveRequestSchema>;

interface CreateLeaveRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CreateLeaveRequestModal: React.FC<CreateLeaveRequestModalProps> = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  const { success, error: showError } = useToast();
  const queryClient = useQueryClient();

  const [totalRequestedDays, setTotalRequestedDays] = useState(0);

  // Fetch current user leave balances
  const { data: balances = [], isLoading: loadingBalances } = useQuery({
    queryKey: ['myBalances', user?.id],
    queryFn: () => balancesApi.getMyBalances(user?.id),
    enabled: isOpen,
  });

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<LeaveRequestFormData>({
    resolver: zodResolver(leaveRequestSchema),
    defaultValues: {
      leaveTypeId: '',
      startDate: getTodayDateString(),
      endDate: getTodayDateString(),
      reason: '',
    },
  });

  const selectedLeaveTypeId = watch('leaveTypeId');
  const selectedStartDate = watch('startDate');
  const selectedEndDate = watch('endDate');

  // Calculate live requested days and remaining balance check
  useEffect(() => {
    if (selectedStartDate && selectedEndDate) {
      const days = calculateDays(selectedStartDate, selectedEndDate);
      setTotalRequestedDays(days);
    } else {
      setTotalRequestedDays(0);
    }
  }, [selectedStartDate, selectedEndDate]);

  const selectedBalance = balances.find((b) => b.leaveTypeId === selectedLeaveTypeId);
  const isInsufficient = selectedBalance && totalRequestedDays > selectedBalance.remainingDays;

  const mutation = useMutation({
    mutationFn: (data: LeaveRequestFormData) =>
      leaveRequestsApi.createLeaveRequest(data, user?.id),
    onSuccess: () => {
      success('Leave request submitted successfully. Awaiting manager approval.');
      queryClient.invalidateQueries({ queryKey: ['myRequests'] });
      queryClient.invalidateQueries({ queryKey: ['employeeDashboard'] });
      queryClient.invalidateQueries({ queryKey: ['myBalances'] });
      queryClient.invalidateQueries({ queryKey: ['managerPending'] });
      reset();
      onClose();
    },
    onError: (err) => {
      showError(getErrorMessage(err));
    },
  });

  const onSubmit = (data: LeaveRequestFormData) => {
    if (isInsufficient) {
      showError(
        `Insufficient leave balance. You requested ${totalRequestedDays} days but have only ${selectedBalance?.remainingDays} days remaining.`
      );
      return;
    }
    mutation.mutate(data);
  };

  const handleModalClose = () => {
    reset();
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleModalClose}
      title="Request Leave"
      description="Submit a new time-off request for review and approval by your manager."
      size="md"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Leave Type Select */}
        <Select
          label="Leave Type"
          required
          error={errors.leaveTypeId?.message}
          {...register('leaveTypeId')}
        >
          <option value="">-- Select leave type --</option>
          {balances.map((b) => (
            <option key={b.leaveTypeId} value={b.leaveTypeId}>
              {b.leaveType} ({b.remainingDays} days available)
            </option>
          ))}
        </Select>

        {/* Selected Balance Info Box */}
        {selectedBalance && (
          <div className="p-3 rounded-xl bg-brand-lightTeal/60 border border-brand-teal/20 flex items-center justify-between text-xs">
            <span className="text-brand-darkTeal font-medium">Available balance for {selectedBalance.leaveType}:</span>
            <span className="font-bold text-navy-900 bg-white px-2.5 py-0.5 rounded-lg border border-brand-teal/20 shadow-xs">
              {selectedBalance.remainingDays} days remaining
            </span>
          </div>
        )}

        {/* Date Range Fields */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            type="date"
            label="Start Date"
            required
            error={errors.startDate?.message}
            leftIcon={<Calendar className="w-4 h-4 text-gray-400" />}
            {...register('startDate')}
          />

          <Input
            type="date"
            label="End Date"
            required
            error={errors.endDate?.message}
            leftIcon={<Calendar className="w-4 h-4 text-gray-400" />}
            {...register('endDate')}
          />
        </div>

        {/* Total Duration Banner */}
        {totalRequestedDays > 0 && (
          <div className="p-3 rounded-xl bg-gray-50 border border-gray-200 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 text-gray-700">
              <Clock className="w-4 h-4 text-brand-teal" />
              <span>Requested Duration:</span>
            </div>
            <span className="font-bold text-navy-900 text-sm">{totalRequestedDays} {totalRequestedDays === 1 ? 'day' : 'days'}</span>
          </div>
        )}

        {/* Insufficient Balance Alert */}
        {isInsufficient && (
          <Alert variant="warning" title="Insufficient Balance">
            You are requesting <strong>{totalRequestedDays} days</strong>, which exceeds your remaining balance of{' '}
            <strong>{selectedBalance.remainingDays} days</strong> for this leave type.
          </Alert>
        )}

        {/* Reason Textarea */}
        <div className="w-full flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-gray-700">
            Reason for Leave <span className="text-rose-500">*</span>
          </label>
          <textarea
            rows={3}
            placeholder="Briefly describe why you are requesting time off..."
            className="w-full bg-white text-gray-900 text-sm rounded-xl border border-gray-200 p-3 focus:outline-none focus:border-brand-teal focus:ring-2 focus:ring-brand-teal/15 transition-all resize-none"
            {...register('reason')}
          />
          {errors.reason && <p className="text-xs text-rose-600 font-medium">{errors.reason.message}</p>}
        </div>

        {/* Action Buttons */}
        <div className="pt-3 flex items-center justify-end gap-3 border-t border-gray-100">
          <Button type="button" variant="outline" onClick={handleModalClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            isLoading={isSubmitting || mutation.isPending}
            disabled={isInsufficient || totalRequestedDays <= 0}
          >
            Submit Request
          </Button>
        </div>
      </form>
    </Modal>
  );
};
