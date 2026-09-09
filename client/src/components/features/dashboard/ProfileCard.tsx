import React from 'react';
import { NavLink } from 'react-router-dom';
import { Mail, Building2, ExternalLink } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../../ui/Card';
import { Avatar } from '../../ui/Avatar';
import { useAuth } from '../../../hooks/useAuth';

export const ProfileCard: React.FC = () => {
  const { user } = useAuth();

  return (
    <Card className="flex flex-col h-full">
      <CardHeader>
        <CardTitle>Profile</CardTitle>
        <NavLink to="/settings" className="text-xs text-brand-teal hover:underline flex items-center gap-1 font-semibold">
          <span>Edit</span>
          <ExternalLink className="w-3 h-3" />
        </NavLink>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col items-center text-center pt-2">
        <Avatar
          name={user?.fullName || 'Leila Vance'}
          src={
            user?.email === 'leila.vance@company.com'
              ? 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80'
              : undefined
          }
          size="xl"
          className="mb-3 ring-4 ring-brand-teal/15 shadow-sm"
        />

        <h4 className="text-base font-bold text-navy-900 leading-snug">{user?.fullName || 'Leila Vance'}</h4>
        <p className="text-xs text-gray-500 font-medium mt-0.5">
          {user?.roles?.includes('HR')
            ? 'Human Resources Administrator'
            : user?.roles?.includes('Manager')
            ? 'Engineering Team Lead'
            : 'Senior Product Designer'}
        </p>

        <div className="w-full mt-5 pt-4 border-t border-gray-100 flex flex-col gap-2.5 text-left text-xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400">Basic details</span>

          <div className="flex items-center gap-2.5 text-gray-700">
            <Mail className="w-4 h-4 text-gray-400 flex-shrink-0" />
            <span className="truncate">{user?.email || 'leila.vance@company.com'}</span>
          </div>

          <div className="flex items-center gap-2.5 text-gray-700">
            <Building2 className="w-4 h-4 text-gray-400 flex-shrink-0" />
            <span>Information Technology</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
