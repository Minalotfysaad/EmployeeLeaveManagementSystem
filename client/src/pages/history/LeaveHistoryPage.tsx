import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { PageHeader } from '../../components/shared/PageHeader';
import { Card } from '../../components/ui/Card';
import { Table, TableHead, TableBody, TableRow, TableHeaderCell, TableCell } from '../../components/ui/Table';
import { StatusBadge } from '../../components/shared/StatusBadge';
import { Skeleton } from '../../components/ui/Skeleton';
import { EmptyState } from '../../components/shared/EmptyState';
import { StatMetricCard } from '../../components/features/dashboard/StatMetricCard';
import { leaveRequestsApi } from '../../api/leaveRequests.api';
import { useAuth } from '../../hooks/useAuth';
import { formatDateRange, formatDate } from '../../utils/date';
import { History, Calendar, CheckCircle2, XCircle } from 'lucide-react';
import { RequestStatus } from '../../types/leaveRequest.types';

export const LeaveHistoryPage: React.FC = () => {
  const { user } = useAuth();
  const [filterYear, setFilterYear] = useState('2026');

  const { data, isLoading } = useQuery({
    queryKey: ['myLeaveHistory', user?.id],
    queryFn: () => leaveRequestsApi.getMyLeaveRequests({ page: 1, pageSize: 50 }, user?.id),
  });

  const allRequests = data?.items || [];
  // History shows resolved requests (HRApproved, Rejected, Cancelled)
  const historyRequests = allRequests.filter(
    (r) =>
      r.status === RequestStatus.HRApproved ||
      r.status === RequestStatus.RejectedByHR ||
      r.status === RequestStatus.RejectedByManager ||
      r.status === RequestStatus.Cancelled
  );

  const approvedDaysTaken = historyRequests
    .filter((r) => r.status === RequestStatus.HRApproved)
    .reduce((acc, curr) => acc + curr.totalDays, 0);

  const totalCompletedRequests = historyRequests.length;

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      <PageHeader
        title="Leave History"
        subtitle="Complete record of your past vacations, sick leaves, and concluded requests."
      />

      {/* History Summary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatMetricCard
          title="Days Taken (2026)"
          value={`${approvedDaysTaken} days`}
          subtitle="Approved and completed leave"
          icon={<CheckCircle2 className="w-5 h-5" />}
          iconBg="bg-emerald-50 text-emerald-600"
        />
        <StatMetricCard
          title="Completed Requests"
          value={totalCompletedRequests}
          subtitle="Processed time-off requests"
          icon={<History className="w-5 h-5" />}
          iconBg="bg-blue-50 text-blue-600"
        />
        <StatMetricCard
          title="Attendance Rate"
          value="96.4%"
          subtitle="Current calendar year"
          icon={<Calendar className="w-5 h-5" />}
          iconBg="bg-brand-lightTeal text-brand-darkTeal"
        />
      </div>

      {/* History Table */}
      <Card className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold text-navy-900 uppercase tracking-wider">Historical Records</h3>
          <select
            value={filterYear}
            onChange={(e) => setFilterYear(e.target.value)}
            className="bg-white text-gray-800 text-xs rounded-xl border border-gray-200 py-1.5 px-3 focus:outline-none focus:border-brand-teal"
          >
            <option value="2026">Year 2026</option>
            <option value="2025">Year 2025</option>
          </select>
        </div>

        {isLoading ? (
          <div className="space-y-3 p-4">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-12 w-full rounded-xl" />
            ))}
          </div>
        ) : historyRequests.length === 0 ? (
          <EmptyState
            title="No past leave records"
            description="You don't have any concluded leave records for this period."
          />
        ) : (
          <div className="overflow-hidden rounded-xl border border-[#E5EAF0]">
            <Table>
              <TableHead>
                <tr>
                  <TableHeaderCell>Leave Type</TableHeaderCell>
                  <TableHeaderCell>Dates</TableHeaderCell>
                  <TableHeaderCell>Duration</TableHeaderCell>
                  <TableHeaderCell>Reason</TableHeaderCell>
                  <TableHeaderCell>Status</TableHeaderCell>
                  <TableHeaderCell className="text-right">Completed Date</TableHeaderCell>
                </tr>
              </TableHead>
              <TableBody>
                {historyRequests.map((req) => (
                  <TableRow key={req.id}>
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
                    <TableCell className="max-w-xs truncate text-xs text-gray-500">
                      {req.reason}
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={req.status} size="sm" />
                    </TableCell>
                    <TableCell className="text-right text-xs text-gray-500">
                      {formatDate(req.createdAt)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </Card>
    </div>
  );
};
