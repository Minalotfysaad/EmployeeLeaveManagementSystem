import React from 'react';
import { NavLink } from 'react-router-dom';
import { Calendar, ChevronRight } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../../ui/Card';
import { StatusBadge } from '../../shared/StatusBadge';
import { LeaveRequestDetailsDto } from '../../../types/leaveRequest.types';
import { formatDateRange } from '../../../utils/date';

interface MyRequestsWidgetProps {
  requests?: LeaveRequestDetailsDto[];
}

export const MyRequestsWidget: React.FC<MyRequestsWidgetProps> = ({ requests = [] }) => {
  const displayedRequests = requests.slice(0, 3);

  return (
    <Card className="flex flex-col h-full">
      <CardHeader>
        <CardTitle>My Requests</CardTitle>
        <NavLink
          to="/requests"
          className="text-xs text-brand-teal hover:underline flex items-center gap-1 font-semibold"
        >
          <span>View all</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </NavLink>
      </CardHeader>

      <CardContent className="flex-1 p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-gray-700">
            <thead className="bg-[#F8FAFC] text-gray-500 font-semibold border-b border-[#E5EAF0]">
              <tr>
                <th className="py-3 px-5">Date</th>
                <th className="py-3 px-4">Type</th>
                <th className="py-3 px-5 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {displayedRequests.length === 0 ? (
                <tr>
                  <td colSpan={3} className="py-8 text-center text-gray-400">
                    No recent leave requests
                  </td>
                </tr>
              ) : (
                displayedRequests.map((req) => (
                  <tr key={req.id} className="hover:bg-gray-50/70 transition-colors">
                    <td className="py-3.5 px-5">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                        <span className="font-semibold text-navy-900">
                          {formatDateRange(req.startDate, req.endDate)}
                        </span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-gray-500 font-medium">
                      ({req.leaveType})
                    </td>
                    <td className="py-3.5 px-5 text-right">
                      <StatusBadge status={req.status} size="sm" />
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
