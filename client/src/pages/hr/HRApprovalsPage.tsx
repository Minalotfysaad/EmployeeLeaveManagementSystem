import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ShieldCheck, Calendar, Clock, CheckCircle2, XCircle } from 'lucide-react';
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
import { formatDateRange } from '../../utils/date';
import { getErrorMessage } from '../../utils/errors';

export const HRApprovalsPage: React.FC = () => {
  const { success, error: showError } = useToast();
  const queryClient = useQueryClient();

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 300);

  const [activeRequest, setActiveRequest] = useState<PendingLeaveRequestDto | null>(null);
  const [actionType, setActionType] = useState<'approve' | 'reject' | null>(null);

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['hrPending', page, debouncedSearch],
    queryFn: () => approvalsApi.getHRPending({ page, pageSize: 10, search: debouncedSearch }),
  });

  const approveMutation = useMutation({
    mutationFn: ({ id, comment }: { id: string; comment?: string }) =>
      approvalsApi.hrApprove(id, { comment }),
    onSuccess: () => {
      success('Leave request approved and employee leave balance deducted!');
      queryClient.invalidateQueries({ queryKey: ['hrPending'] });
      queryClient.invalidateQueries({ queryKey: ['hrDashboard'] });
      queryClient.invalidateQueries({ queryKey: ['myBalances'] });
      queryClient.invalidateQueries({ queryKey: ['upcomingTeamLeave'] });
      closeActionModal();
    },
    onError: (err) => {
      showError(getErrorMessage(err));
    },
  });

  const rejectMutation = useMutation({
    mutationFn: ({ id, comment }: { id: string; comment?: string }) =>
      approvalsApi.hrReject(id, { comment }),
    onSuccess: () => {
      success('Leave request rejected by HR.');
      queryClient.invalidateQueries({ queryKey: ['hrPending'] });
      queryClient.invalidateQueries({ queryKey: ['hrDashboard'] });
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
        title="HR Leave Approvals"
        subtitle="Final administrative approval step. Confirming requests automatically updates and deducts employee leave balances."
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
            icon={<ShieldCheck className="w-6 h-6 text-brand-darkTeal" />}
            title="No requests awaiting HR review"
            description="All manager-approved leave requests have been processed."
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
                  <TableHeaderCell>Days</TableHeaderCell>
                  <TableHeaderCell>Manager Status</TableHeaderCell>
                  <TableHeaderCell className="text-right">HR Action</TableHeaderCell>
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
                    <TableCell>
                      <span className="inline-flex items-center gap-1 text-xs font-semibold text-sky-700 bg-sky-50 px-2 py-0.5 rounded-full border border-sky-200">
                        <CheckCircle2 className="w-3 h-3 text-sky-500" />
                        Manager Approved
                      </span>
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
                          Final Approve
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
