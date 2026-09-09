import React from 'react';
import { Modal } from '../../ui/Modal';
import { Button } from '../../ui/Button';
import { StatusBadge } from '../../shared/StatusBadge';
import { LeaveRequestDetailsDto, RequestStatus } from '../../../types/leaveRequest.types';
import { formatDate, formatDateRange } from '../../../utils/date';
import { Calendar, Clock, User, Building2, CheckCircle2, XCircle } from 'lucide-react';

interface RequestDetailsModalProps {
  request: LeaveRequestDetailsDto | null;
  isOpen: boolean;
  onClose: () => void;
  onCancelRequest?: (id: string) => void;
  isCancelling?: boolean;
}

export const RequestDetailsModal: React.FC<RequestDetailsModalProps> = ({
  request,
  isOpen,
  onClose,
  onCancelRequest,
  isCancelling = false,
}) => {
  if (!request) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Leave Request Details" size="md">
      <div className="space-y-5">
        {/* Header Status Bar */}
        <div className="flex items-center justify-between p-4 rounded-xl bg-gray-50 border border-gray-100">
          <div>
            <h4 className="text-sm font-bold text-navy-900">{request.leaveType}</h4>
            <span className="text-xs text-gray-500">Submitted on {formatDate(request.createdAt)}</span>
          </div>
          <StatusBadge status={request.status} size="md" />
        </div>

        {/* Date & Duration Info */}
        <div className="grid grid-cols-2 gap-4">
          <div className="p-3.5 rounded-xl border border-[#E5EAF0] bg-white">
            <div className="flex items-center gap-2 text-gray-500 text-xs mb-1">
              <Calendar className="w-4 h-4 text-brand-teal" />
              <span>Leave Period</span>
            </div>
            <p className="text-sm font-bold text-navy-900">
              {formatDateRange(request.startDate, request.endDate)}
            </p>
          </div>

          <div className="p-3.5 rounded-xl border border-[#E5EAF0] bg-white">
            <div className="flex items-center gap-2 text-gray-500 text-xs mb-1">
              <Clock className="w-4 h-4 text-brand-orange" />
              <span>Total Duration</span>
            </div>
            <p className="text-sm font-bold text-navy-900">
              {request.totalDays} {request.totalDays === 1 ? 'Day' : 'Days'}
            </p>
          </div>
        </div>

        {/* Reason */}
        <div className="p-4 rounded-xl border border-[#E5EAF0] bg-white">
          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1.5">
            Reason for request
          </span>
          <p className="text-xs text-gray-800 leading-relaxed bg-gray-50 p-3 rounded-lg border border-gray-100">
            {request.reason || 'No specific reason provided.'}
          </p>
        </div>

        {/* Approval Workflow Stepper */}
        <div className="p-4 rounded-xl border border-[#E5EAF0] bg-white space-y-3">
          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider block">
            Approval Progress
          </span>

          <div className="space-y-3 pt-1 text-xs">
            {/* Step 1: Manager */}
            <div className="flex items-start gap-3">
              {request.status === RequestStatus.Pending ? (
                <div className="w-5 h-5 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Clock className="w-3 h-3" />
                </div>
              ) : request.status === RequestStatus.RejectedByManager ? (
                <div className="w-5 h-5 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <XCircle className="w-3 h-3" />
                </div>
              ) : (
                <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <CheckCircle2 className="w-3 h-3" />
                </div>
              )}

              <div>
                <p className="font-semibold text-navy-900">1. Manager Review</p>
                <p className="text-gray-500 text-[11px]">
                  {request.status === RequestStatus.Pending
                    ? 'Pending approval from your reporting manager'
                    : request.status === RequestStatus.RejectedByManager
                    ? 'Rejected by manager'
                    : 'Approved by manager'}
                </p>
              </div>
            </div>

            {/* Step 2: HR */}
            <div className="flex items-start gap-3">
              {request.status === RequestStatus.ManagerApproved ? (
                <div className="w-5 h-5 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Clock className="w-3 h-3" />
                </div>
              ) : request.status === RequestStatus.HRApproved ? (
                <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <CheckCircle2 className="w-3 h-3" />
                </div>
              ) : request.status === RequestStatus.RejectedByHR ? (
                <div className="w-5 h-5 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <XCircle className="w-3 h-3" />
                </div>
              ) : (
                <div className="w-5 h-5 rounded-full bg-gray-100 text-gray-400 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-gray-400" />
                </div>
              )}

              <div>
                <p className="font-semibold text-navy-900">2. HR Department Approval</p>
                <p className="text-gray-500 text-[11px]">
                  {request.status === RequestStatus.HRApproved
                    ? 'Approved and balance updated'
                    : request.status === RequestStatus.RejectedByHR
                    ? 'Rejected by HR department'
                    : request.status === RequestStatus.ManagerApproved
                    ? 'Waiting for final HR confirmation'
                    : 'Awaiting manager approval first'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Actions */}
        <div className="pt-2 flex items-center justify-between border-t border-gray-100">
          <div>
            {request.status === RequestStatus.Pending && onCancelRequest && (
              <Button
                variant="danger"
                size="sm"
                onClick={() => onCancelRequest(request.id)}
                isLoading={isCancelling}
              >
                Cancel Request
              </Button>
            )}
          </div>

          <Button variant="outline" size="sm" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </Modal>
  );
};
