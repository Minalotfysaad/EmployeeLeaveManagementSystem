import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../../ui/Card';
import { FileText } from 'lucide-react';
import { StatusBadge } from '../../shared/StatusBadge';
import { RequestStatus } from '../../../types/leaveRequest.types';

export const RecentActivityCard: React.FC = () => {
  const activities = [
    { id: '1234', title: 'Vacation Request #1234', status: RequestStatus.HRApproved, date: '2 days ago' },
    { id: '1235', title: 'Vacation Request #1235', status: RequestStatus.HRApproved, date: 'Last week' },
    { id: '1236', title: 'Vacation Request #1236', status: RequestStatus.HRApproved, date: '3 weeks ago' },
  ];

  return (
    <Card className="flex flex-col h-full">
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>

      <CardContent className="flex-1 p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-gray-700">
            <thead className="bg-[#F8FAFC] text-gray-500 font-semibold border-b border-[#E5EAF0]">
              <tr>
                <th className="py-3 px-5">Recent request</th>
                <th className="py-3 px-5 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {activities.map((item, idx) => (
                <tr key={item.id} className="hover:bg-gray-50/70 transition-colors">
                  <td className="py-3.5 px-5">
                    <div className="flex items-center gap-3">
                      {/* Timeline dot and connecting line */}
                      <div className="relative flex flex-col items-center">
                        <span className="w-2.5 h-2.5 rounded-full bg-brand-teal flex-shrink-0" />
                        {idx !== activities.length - 1 && (
                          <span className="absolute top-2.5 w-0.5 h-7 bg-brand-teal/20" />
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        <FileText className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                        <span className="font-semibold text-navy-900">{item.title}</span>
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
      </CardContent>
    </Card>
  );
};
