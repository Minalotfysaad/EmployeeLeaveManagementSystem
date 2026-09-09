import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { PlusCircle, Search, Calendar, Filter, Eye, XCircle, ChevronDown } from 'lucide-react';
import { PageHeader } from '../../components/shared/PageHeader';
import { SearchFilterBar } from '../../components/shared/SearchFilterBar';
import { StatusBadge } from '../../components/shared/StatusBadge';
import { Pagination } from '../../components/shared/Pagination';
import { EmptyState } from '../../components/shared/EmptyState';
import { ErrorState } from '../../components/shared/ErrorState';
import { ConfirmDialog } from '../../components/shared/ConfirmDialog';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Select } from '../../components/ui/Select';
import { Skeleton } from '../../components/ui/Skeleton';
import { Table, TableHead, TableBody, TableRow, TableHeaderCell, TableCell } from '../../components/ui/Table';
import { CreateLeaveRequestModal } from '../../components/features/requests/CreateLeaveRequestModal';
import { RequestDetailsModal } from '../../components/features/requests/RequestDetailsModal';
import { leaveRequestsApi } from '../../api/leaveRequests.api';
import { LeaveRequestDetailsDto, RequestStatus } from '../../types/leaveRequest.types';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../hooks/useToast';
import { useDebounce } from '../../hooks/useDebounce';
import { formatDateRange, formatDate } from '../../utils/date';
import { getErrorMessage } from '../../utils/errors';

export const MyRequestsPage: React.FC = () => {
  const { user } = useAuth();
  const { success, error: showError } = useToast();
  const queryClient = useQueryClient();

  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const debouncedSearch = useDebounce(search, 300);

  // Modals
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<LeaveRequestDetailsDto | null>(null);
  const [cancelRequestId, setCancelRequestId] = useState<string | null>(null);

  // Fetch requests
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['myRequests', user?.id, page, pageSize, debouncedSearch, statusFilter],
    queryFn: () =>
      leaveRequestsApi.getMyLeaveRequests(
        {
          page,
          pageSize,
          search: debouncedSearch,
        },
        user?.id
      ),
  });

  // Cancel Request mutation
  const cancelMutation = useMutation({
    mutationFn: (id: string) => leaveRequestsApi.cancelLeaveRequest(id, user?.id),
    onSuccess: () => {
      success('Leave request has been cancelled.');
      queryClient.invalidateQueries({ queryKey: ['myRequests'] });
      queryClient.invalidateQueries({ queryKey: ['employeeDashboard'] });
      queryClient.invalidateQueries({ queryKey: ['myBalances'] });
      setCancelRequestId(null);
      setSelectedRequest(null);
    },
    onError: (err) => {
      showError(getErrorMessage(err));
    },
  });

  const rawItems = data?.items || [];
  const filteredItems =
    statusFilter === 'all'
      ? rawItems
      : rawItems.filter((r) => String(r.status) === statusFilter);

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      <PageHeader
        title="My Leave Requests"
        subtitle="View, manage, and track the status of all your time-off applications."
        actions={
          <Button
            variant="primary"
            leftIcon={<PlusCircle className="w-4 h-4" />}
            onClick={() => setCreateModalOpen(true)}
          >
            Request Leave
          </Button>
        }
      />

      {/* Filter and Search Bar */}
      <Card className="p-4">
        <SearchFilterBar
          search={search}
          onSearchChange={(val) => {
            setSearch(val);
            setPage(1);
          }}
          placeholder="Search by leave type or reason..."
        >
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-gray-500 whitespace-nowrap">Filter Status:</span>
            <div className="relative flex items-center group">
              <select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  setPage(1);
                }}
                className="appearance-none bg-[#F8FAFC] hover:bg-white text-gray-800 text-xs font-medium rounded-xl border border-gray-200/90 hover:border-gray-300 py-2 pl-3 pr-8 shadow-2xs transition-all cursor-pointer focus:outline-none focus:bg-white focus:border-brand-teal focus:ring-2 focus:ring-brand-teal/15"
              >
                <option value="all">All Statuses</option>
                <option value={String(RequestStatus.Pending)}>Pending Manager</option>
                <option value={String(RequestStatus.ManagerApproved)}>Manager Approved</option>
                <option value={String(RequestStatus.HRApproved)}>Fully Approved</option>
                <option value={String(RequestStatus.RejectedByManager)}>Rejected by Manager</option>
                <option value={String(RequestStatus.RejectedByHR)}>Rejected by HR</option>
                <option value={String(RequestStatus.Cancelled)}>Cancelled</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-gray-400 group-hover:text-gray-600 pointer-events-none absolute right-2.5 transition-colors" />
            </div>
          </div>
        </SearchFilterBar>

        {/* Requests Table */}
        {isLoading ? (
          <div className="space-y-3 p-4">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-12 w-full rounded-xl" />
            ))}
          </div>
        ) : isError ? (
          <ErrorState message={getErrorMessage(error)} onRetry={() => refetch()} />
        ) : filteredItems.length === 0 ? (
          <EmptyState
            title="No leave requests found"
            description={
              search || statusFilter !== 'all'
                ? 'Try adjusting your search criteria or status filter.'
                : 'You have not submitted any leave requests yet.'
            }
            action={
              <Button
                variant="primary"
                size="sm"
                leftIcon={<PlusCircle className="w-4 h-4" />}
                onClick={() => setCreateModalOpen(true)}
              >
                Submit First Request
              </Button>
            }
          />
        ) : (
          <div className="overflow-hidden rounded-xl border border-[#E5EAF0]">
            <Table>
              <TableHead>
                <tr>
                  <TableHeaderCell>Leave Type</TableHeaderCell>
                  <TableHeaderCell>Dates</TableHeaderCell>
                  <TableHeaderCell>Days</TableHeaderCell>
                  <TableHeaderCell>Submitted</TableHeaderCell>
                  <TableHeaderCell>Status</TableHeaderCell>
                  <TableHeaderCell className="text-right">Actions</TableHeaderCell>
                </tr>
              </TableHead>
              <TableBody>
                {filteredItems.map((req) => (
                  <TableRow key={req.id} className="cursor-pointer" onClick={() => setSelectedRequest(req)}>
                    <TableCell>
                      <span className="font-bold text-navy-900">{req.leaveType}</span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1.5 text-xs text-gray-700">
                        <Calendar className="w-3.5 h-3.5 text-brand-teal" />
                        <span>{formatDateRange(req.startDate, req.endDate)}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="font-semibold text-gray-800">
                        {req.totalDays} {req.totalDays === 1 ? 'day' : 'days'}
                      </span>
                    </TableCell>
                    <TableCell className="text-xs text-gray-500">
                      {formatDate(req.createdAt)}
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={req.status} size="sm" />
                    </TableCell>
                    <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-1.5">
                        <Button
                          variant="ghost"
                          size="xs"
                          title="View details"
                          onClick={() => setSelectedRequest(req)}
                          leftIcon={<Eye className="w-3.5 h-3.5 text-gray-500" />}
                        >
                          Details
                        </Button>

                        {req.status === RequestStatus.Pending && (
                          <Button
                            variant="ghost"
                            size="xs"
                            className="text-rose-600 hover:text-rose-700 hover:bg-rose-50"
                            title="Cancel request"
                            onClick={() => setCancelRequestId(req.id)}
                          >
                            Cancel
                          </Button>
                        )}
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
              pageSize={pageSize}
              onPageChange={setPage}
            />
          </div>
        )}
      </Card>

      {/* Modals */}
      <CreateLeaveRequestModal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
      />

      <RequestDetailsModal
        request={selectedRequest}
        isOpen={!!selectedRequest}
        onClose={() => setSelectedRequest(null)}
        onCancelRequest={(id) => setCancelRequestId(id)}
      />

      {/* Cancel Confirmation Dialog */}
      <ConfirmDialog
        isOpen={!!cancelRequestId}
        onClose={() => setCancelRequestId(null)}
        onConfirm={() => cancelRequestId && cancelMutation.mutate(cancelRequestId)}
        title="Cancel Leave Request?"
        message="Are you sure you want to cancel this pending leave request? This action cannot be undone."
        confirmText="Yes, Cancel Request"
        variant="danger"
        isLoading={cancelMutation.isPending}
      />
    </div>
  );
};
