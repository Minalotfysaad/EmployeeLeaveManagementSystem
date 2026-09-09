import React from 'react';
import { useAuth } from '../../../hooks/useAuth';
import { Calendar as CalendarIcon } from 'lucide-react';
import { formatDate } from '../../../utils/date';

export const WelcomeBanner: React.FC = () => {
  const { user } = useAuth();
  const firstName = user?.fullName?.split(' ')[0] || 'there';

  return (
    <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-navy-900 tracking-tight font-sans">
          Welcome back, {user?.fullName || 'Leila Vance'}!
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 mt-1">
          Track your leave balances, view team availability, and manage time off requests.
        </p>
      </div>

      <div className="flex items-center gap-2 text-xs font-semibold text-gray-600 bg-white border border-[#E5EAF0] px-3.5 py-2 rounded-xl shadow-xs self-start md:self-auto">
        <CalendarIcon className="w-4 h-4 text-brand-teal" />
        <span>Today: {formatDate(new Date().toISOString())}</span>
      </div>
    </div>
  );
};
