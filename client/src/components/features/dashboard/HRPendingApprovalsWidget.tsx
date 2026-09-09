import React from 'react';
import { NavLink } from 'react-router-dom';
import { ShieldCheck, ChevronRight, Calendar } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardHeader, CardTitle, CardContent } from '../../ui/Card';
import { approvalsApi } from '../../../api/approvals.api';
import { formatDateRange } from '../../../utils/date';
import { useAuth } from '../../../hooks/useAuth';

export const HRPendingApprovalsWidget: React.FC = () => {
  const { user, isDemoMode } = useAuth();
  const { data } = useQuery({
    queryKey: ['hrPendingWidget', user?.id, isDemoMode],
    queryFn: () => approvalsApi.getHRPending({ page: 1, pageSize: 4 }),
    staleTime: 0,
    refetchOnMount: 'always',
  });

  const pendingItems = data?.items || [];

  return (
    <Card className="flex flex-col h-full">
      <CardHeader>
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-brand-darkTeal" />
          <CardTitle>Pending HR Approvals</CardTitle>
        </div>
        <NavLink
          to="/hr/approvals"
          className="text-xs text-brand-teal hover:underline flex items-center gap-1 font-semibold"
        >
          <span>View all ({data?.totalCount || 0})</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </NavLink>
      </CardHeader>

      <CardContent className="flex-1 p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-gray-700">
            <thead className="bg-[#F8FAFC] text-gray-500 font-semibold border-b border-[#E5EAF0]">
              <tr>
                <th className="py-3 px-5">Employee</th>
                <th className="py-3 px-4">Type</th>
                <th className="py-3 px-4">Dates</th>
                <th className="py-3 px-5 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {pendingItems.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-10 text-center text-gray-400">
                    <ShieldCheck className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                    <p className="font-semibold text-gray-600">No pending approvals</p>
                    <p className="text-[11px] text-gray-400 mt-0.5">All leave requests have been reviewed.</p>
                  </td>
                </tr>
              ) : (
                pendingItems.map((req) => (
                  <tr key={req.id} className="hover:bg-gray-50/70 transition-colors">
                    <td className="py-3.5 px-5">
                      <div>
                        <span className="font-semibold text-navy-900 block">
                          {req.employeeName}
                        </span>
                        <span className="text-[11px] text-gray-400">
                          {req.department}
                        </span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-gray-600 font-medium">
                      {req.leaveType}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1.5 text-gray-600">
                        <Calendar className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                        <span>{formatDateRange(req.startDate, req.endDate)}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-5 text-right">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-brand-orange border border-amber-200/60">
                        Pending HR
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};
