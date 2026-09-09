import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Mail, Calendar, Users, CheckCircle2, Clock } from 'lucide-react';
import { PageHeader } from '../../components/shared/PageHeader';
import { Card } from '../../components/ui/Card';
import { Avatar } from '../../components/ui/Avatar';
import { Badge } from '../../components/ui/Badge';
import { Skeleton } from '../../components/ui/Skeleton';
import { SearchFilterBar } from '../../components/shared/SearchFilterBar';
import { employeesApi } from '../../api/employees.api';
import { useDebounce } from '../../hooks/useDebounce';

export const TeamPage: React.FC = () => {
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 300);

  const { data, isLoading } = useQuery({
    queryKey: ['teamMembers', debouncedSearch],
    queryFn: () => employeesApi.getEmployees({ page: 1, pageSize: 20, search: debouncedSearch }),
  });

  const team = data?.items || [];

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      <PageHeader
        title="Team Directory"
        subtitle="Overview of your reporting team, current working status, and department alignment."
      />

      <Card className="p-4">
        <SearchFilterBar
          search={search}
          onSearchChange={setSearch}
          placeholder="Search team member..."
        />

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Skeleton key={i} className="h-44 w-full rounded-2xl" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {team.map((member, idx) => {
              const isOnLeave = idx === 1; // Sample status

              return (
                <Card key={member.id} className="p-5 flex flex-col justify-between hover:border-gray-300">
                  <div>
                    <div className="flex items-start justify-between">
                      <Avatar name={member.fullName} size="lg" status={isOnLeave ? 'on-leave' : 'online'} />
                      <Badge variant={isOnLeave ? 'orange' : 'green'} size="sm">
                        {isOnLeave ? 'On Leave' : 'Active Today'}
                      </Badge>
                    </div>

                    <h4 className="text-sm font-bold text-navy-900 mt-3">{member.fullName}</h4>
                    <p className="text-xs text-gray-500 font-medium">Software Engineer</p>

                    <div className="mt-4 pt-3 border-t border-gray-100 space-y-1.5 text-xs text-gray-600">
                      <div className="flex items-center gap-2">
                        <Mail className="w-3.5 h-3.5 text-gray-400" />
                        <span className="truncate">{member.email}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="w-3.5 h-3.5 text-gray-400" />
                        <span>Information Technology</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs">
                    <span className="text-gray-400 font-medium">Annual Leave Left:</span>
                    <span className="font-bold text-navy-900">10 days</span>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </Card>
    </div>
  );
};
