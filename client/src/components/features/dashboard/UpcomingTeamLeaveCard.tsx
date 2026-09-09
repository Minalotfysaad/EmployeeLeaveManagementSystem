import React from 'react';
import { NavLink } from 'react-router-dom';
import { ChevronRight, Calendar } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardHeader, CardTitle, CardContent } from '../../ui/Card';
import { Avatar } from '../../ui/Avatar';
import { dashboardApi } from '../../../api/dashboard.api';
import { useAuth } from '../../../hooks/useAuth';

export const UpcomingTeamLeaveCard: React.FC = () => {
  const { user, isDemoMode } = useAuth();
  const { data: teamLeaves = [] } = useQuery({
    queryKey: ['upcomingTeamLeave', user?.id, isDemoMode],
    queryFn: () => dashboardApi.getUpcomingTeamLeave(),
    staleTime: 0,
    refetchOnMount: 'always',
  });

  return (
    <Card className="flex flex-col h-full">
      <CardHeader>
        <CardTitle>Upcoming Team Leave</CardTitle>
        <NavLink
          to="/calendar"
          className="text-gray-400 hover:text-brand-teal transition-colors p-1 rounded-md"
          title="View Team Calendar"
        >
          <ChevronRight className="w-4 h-4" />
        </NavLink>
      </CardHeader>

      <CardContent className="flex-1 overflow-y-auto max-h-[300px] p-0 flex flex-col justify-center">
        {teamLeaves.length === 0 ? (
          <div className="py-10 px-4 text-center text-xs text-gray-500 flex flex-col items-center justify-center">
            <Calendar className="w-8 h-8 text-gray-300 mb-2" />
            <p className="font-semibold text-gray-700">No upcoming team leave</p>
            <p className="text-[11px] text-gray-400 mt-0.5">Team members' scheduled time off will appear here.</p>
            <NavLink
              to="/calendar"
              className="mt-3 text-brand-darkTeal hover:underline font-semibold text-[11px] inline-flex items-center gap-1"
            >
              <span>View team calendar</span>
              <ChevronRight className="w-3 h-3" />
            </NavLink>
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {teamLeaves.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between px-5 py-3 hover:bg-gray-50/60 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Avatar name={item.name} src={item.avatar} size="sm" />
                  <div>
                    <h4 className="text-xs font-bold text-navy-900 leading-tight">{item.name}</h4>
                    <span className="text-[11px] text-gray-500 font-medium">({item.type})</span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-600 bg-gray-50 px-2.5 py-1 rounded-lg border border-gray-100">
                  <Calendar className="w-3.5 h-3.5 text-brand-teal" />
                  <span>{item.dates}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
