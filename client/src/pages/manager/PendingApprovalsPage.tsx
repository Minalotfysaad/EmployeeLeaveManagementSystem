import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { CheckCircle2, XCircle, Clock, Calendar, Search } from 'lucide-react';
import { PageHeader } from '../../components/shared/PageHeader';
import { SearchFilterBar } from '../../components/shared/SearchFilterBar';
import { Pagination } from '../../components/shared/Pagination';
import { EmptyState } from '../../components/shared/EmptyState';
import { ErrorState } from '../../components/shared/ErrorState';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Skeleton } from '../../components/ui/Skeleton';
import { Table, TableHead, TableBody, TableRow, TableHeaderCell, TableCell } from '../../components/ui/Table';
import { ApprovalActionModal } from '../../components/features/approvals/ApprovalActionModal';
import { approvalsApi } from '../../api/approvals.api';
import { PendingLeaveRequestDto } from '../../types/leaveRequest.types';
import { useToast } from '../../hooks/useToast';
import { useDebounce } from '../../hooks/useDebounce';
import { formatDateRange, formatDate } from '../../utils/date';
import { getErrorMessage } from '../../utils/errors';

export const PendingApprovalsPage: React.FC = () => {
  const { success, error: showError } = useToast();
  const queryClient = useQueryClient();

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 300);

  // Selected request for modal action
  const [activeRequest, setActiveRequest] = useState<PendingLeaveRequestDto | null>(null);
  const [actionType, setActionType] = useState<'approve' | 'reject' | null>(null);

  // Fetch pending manager requests
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['managerPending', page, debouncedSearch],
    queryFn: () => approvalsApi.getManagerPending({ page, pageSize: 10, search: debouncedSearch }),
  });

  const approveMutation = useMutation({
    mutationFn: ({ id, comment }: { id: string; comment?: string }) =>
      approvalsApi.managerApprove(id, { comment }),
    onSuccess: () => {
      success('Leave request approved! Forwarded to HR for final sign-off.');
      queryClient.invalidateQueries({ queryKey: ['managerPending'] });
      queryClient.invalidateQueries({ queryKey: ['managerDashboard'] });
      queryClient.invalidateQueries({ queryKey: ['hrPending'] });
      closeActionModal();
    },
    onError: (err) => {
      showError(getErrorMessage(err));
    },
  });

  const rejectMutation = useMutation({
    mutationFn: ({ id, comment }: { id: string; comment?: string }) =>
      approvalsApi.managerReject(id, { comment }),
    onSuccess: () => {
      success('Leave request has been rejected.');
      queryClient.invalidateQueries({ queryKey: ['managerPending'] });
      queryClient.invalidateQueries({ queryKey: ['managerDashboard'] });
      closeActionModal();
    },
    onError: (err) => {
      showError(getErrorMessage(err));
    },
  });

  const closeActionModal = () => {
    setActiveRequest(null);
    setActionType(null);
  };

  const handleConfirmDecision = async (comment?: string) => {
    if (!activeRequest) return;
    if (actionType === 'approve') {
      await approveMutation.mutateAsync({ id: activeRequest.id, comment });
    } else if (actionType === 'reject') {
      await rejectMutation.mutateAsync({ id: activeRequest.id, comment });
    }
  };

  const requests = data?.items || [];

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      <PageHeader
        title="Pending Approvals"
        subtitle="Review and make decisions on leave requests submitted by your direct and indirect reports."
      />

      <Card className="p-4">
        <SearchFilterBar
          search={search}
          onSearchChange={(val) => {
            setSearch(val);
            setPage(1);
          }}
          placeholder="Search employee or department..."
        />

        {isLoading ? (
          <div className="space-y-3 p-4">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-12 w-full rounded-xl" />
            ))}
          </div>
        ) : isError ? (
          <ErrorState message={getErrorMessage(error)} onRetry={() => refetch()} />
        ) : requests.length === 0 ? (
          <EmptyState
            icon={<Clock className="w-6 h-6 text-brand-orange" />}
            title="All caught up!"
            description="There are currently no pending leave requests awaiting your approval."
          />
        ) : (
          <div className="overflow-hidden rounded-xl border border-[#E5EAF0]">
            <Table>
              <TableHead>
                <tr>
                  <TableHeaderCell>Employee</TableHeaderCell>
                  <TableHeaderCell>Department</TableHeaderCell>
                  <TableHeaderCell>Leave Type</TableHeaderCell>
                  <TableHeaderCell>Dates</TableHeaderCell>
                  <TableHeaderCell>Duration</TableHeaderCell>
                  <TableHeaderCell>Reason</TableHeaderCell>
                  <TableHeaderCell className="text-right">Decision</TableHeaderCell>
                </tr>
              </TableHead>
              <TableBody>
                {requests.map((req) => (
                  <TableRow key={req.id}>
                    <TableCell>
                      <span className="font-bold text-navy-900">{req.employeeName}</span>
                    </TableCell>
                    <TableCell className="text-xs text-gray-500">{req.department}</TableCell>
                    <TableCell>
                      <span className="font-semibold text-gray-800">{req.leaveType}</span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1.5 text-xs text-gray-700">
                        <Calendar className="w-3.5 h-3.5 text-brand-teal" />
                        <span>{formatDateRange(req.startDate, req.endDate)}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="font-semibold text-navy-900">
                        {req.totalDays} {req.totalDays === 1 ? 'day' : 'days'}
                      </span>
                    </TableCell>
                    <TableCell className="max-w-xs truncate text-xs text-gray-500">
                      {req.reason || '—'}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="outline"
                          size="xs"
                          className="border-rose-200 text-rose-600 hover:bg-rose-50"
                          onClick={() => {
                            setActiveRequest(req);
                            setActionType('reject');
                          }}
                        >
                          Reject
                        </Button>
                        <Button
                          variant="primary"
                          size="xs"
                          onClick={() => {
                            setActiveRequest(req);
                            setActionType('approve');
                          }}
                        >
                          Approve
                        </Button>
                      </div>
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

      {/* Decision Modal */}
      <ApprovalActionModal
        request={activeRequest}
        actionType={actionType}
        isOpen={!!activeRequest && !!actionType}
        onClose={closeActionModal}
        onConfirm={handleConfirmDecision}
        isLoading={approveMutation.isPending || rejectMutation.isPending}
      />
    </div>
  );
};
