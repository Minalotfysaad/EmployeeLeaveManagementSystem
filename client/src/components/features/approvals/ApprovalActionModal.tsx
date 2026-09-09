import React, { useState } from 'react';
import { Modal } from '../../ui/Modal';
import { Button } from '../../ui/Button';
import { PendingLeaveRequestDto } from '../../../types/leaveRequest.types';
import { formatDateRange, formatDate } from '../../../utils/date';
import { CheckCircle2, XCircle, User, Calendar, Clock, Building2 } from 'lucide-react';

interface ApprovalActionModalProps {
  request: PendingLeaveRequestDto | null;
  actionType: 'approve' | 'reject' | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (comment?: string) => Promise<void>;
  isLoading?: boolean;
}

export const ApprovalActionModal: React.FC<ApprovalActionModalProps> = ({
  request,
  actionType,
  isOpen,
  onClose,
  onConfirm,
  isLoading = false,
}) => {
  const [comment, setComment] = useState('');

  if (!request || !actionType) return null;

  const isApprove = actionType === 'approve';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onConfirm(comment);
    setComment('');
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isApprove ? 'Approve Leave Request' : 'Reject Leave Request'}
      size="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Request Brief */}
        <div className="p-4 rounded-xl bg-gray-50 border border-gray-100 space-y-2.5 text-xs">
          <div className="flex items-center justify-between">
            <span className="font-bold text-navy-900 text-sm">{request.employeeName}</span>
            <span className="text-gray-500 font-medium">{request.department}</span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-gray-600">
            <div className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-brand-teal" />
              <span>{formatDateRange(request.startDate, request.endDate)}</span>
            </div>
            <div className="flex items-center gap-1.5 font-semibold text-navy-900">
              <Clock className="w-3.5 h-3.5 text-brand-orange" />
              <span>{request.totalDays} days ({request.leaveType})</span>
            </div>
          </div>

          {request.reason && (
            <div className="mt-2 pt-2 border-t border-gray-200">
              <span className="text-gray-400 text-[10px] uppercase font-bold tracking-wider">Employee Note:</span>
              <p className="text-gray-700 italic mt-0.5 font-sans">"{request.reason}"</p>
            </div>
          )}
        </div>

        {/* Action Description */}
        <p className="text-xs text-gray-500">
          {isApprove
            ? 'Are you sure you want to approve this leave request? This decision will advance the request in the workflow.'
            : 'Are you sure you want to reject this leave request? Please provide a reason below so the employee understands.'}
        </p>

        {/* Comment field */}
        <div className="w-full flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-gray-700">
            {isApprove ? 'Optional Note' : 'Reason for rejection'}
          </label>
          <textarea
            rows={2}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder={isApprove ? 'Add an optional comment...' : 'State the reason for rejecting...'}
            className="w-full bg-white text-gray-900 text-xs rounded-xl border border-gray-200 p-3 focus:outline-none focus:border-brand-teal focus:ring-2 focus:ring-brand-teal/15 transition-all resize-none"
          />
        </div>

        {/* Actions */}
        <div className="pt-3 flex items-center justify-end gap-3 border-t border-gray-100">
          <Button type="button" variant="outline" size="sm" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>

          <Button
            type="submit"
            size="sm"
            variant={isApprove ? 'primary' : 'danger'}
            isLoading={isLoading}
            leftIcon={isApprove ? <CheckCircle2 className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
          >
            {isApprove ? 'Confirm Approval' : 'Reject Request'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
