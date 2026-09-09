import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../../ui/Card';
import { FileText } from 'lucide-react';
import { StatusBadge } from '../../shared/StatusBadge';
import { LeaveRequestDetailsDto } from '../../../types/leaveRequest.types';
import { formatDateShort } from '../../../utils/date';

interface RecentActivityCardProps {
  requests?: LeaveRequestDetailsDto[];
}

export const RecentActivityCard: React.FC<RecentActivityCardProps> = ({ requests = [] }) => {
  return (
    <Card className="flex flex-col h-full">
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>

      <CardContent className="flex-1 p-0 flex flex-col justify-center">
        {requests.length === 0 ? (
          <div className="py-12 px-4 text-center text-xs text-gray-500 flex flex-col items-center justify-center">
            <FileText className="w-8 h-8 text-gray-300 mb-2" />
            <p className="font-semibold text-gray-700">No recent activity</p>
            <p className="text-[11px] text-gray-400 mt-0.5">Submitted leave requests will appear here.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-gray-700">
              <thead className="bg-[#F8FAFC] text-gray-500 font-semibold border-b border-[#E5EAF0]">
                <tr>
                  <th className="py-3 px-5">Recent request</th>
                  <th className="py-3 px-5 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {requests.slice(0, 5).map((item, idx) => (
                  <tr key={item.id} className="hover:bg-gray-50/70 transition-colors">
                    <td className="py-3.5 px-5">
                      <div className="flex items-center gap-3">
                        <div className="relative flex flex-col items-center">
                          <span className="w-2.5 h-2.5 rounded-full bg-brand-teal flex-shrink-0" />
                          {idx !== Math.min(requests.length, 5) - 1 && (
                            <span className="absolute top-2.5 w-0.5 h-7 bg-brand-teal/20" />
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <FileText className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                          <div>
                            <span className="font-semibold text-navy-900 block">{item.leaveType}</span>
                            <span className="text-[10px] text-gray-400">
                              {formatDateShort(item.startDate)} - {formatDateShort(item.endDate)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-5 text-right">
                      <StatusBadge status={item.status} size="sm" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
