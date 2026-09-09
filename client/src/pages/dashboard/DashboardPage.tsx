import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { WelcomeBanner } from '../../components/features/dashboard/WelcomeBanner';
import { LeaveBalanceCard } from '../../components/features/dashboard/LeaveBalanceCard';
import { UpcomingTeamLeaveCard } from '../../components/features/dashboard/UpcomingTeamLeaveCard';
import { ProfileCard } from '../../components/features/dashboard/ProfileCard';
import { RecentActivityCard } from '../../components/features/dashboard/RecentActivityCard';
import { MyRequestsWidget } from '../../components/features/dashboard/MyRequestsWidget';
import { QuickActionsWidget } from '../../components/features/dashboard/QuickActionsWidget';
import { StatMetricCard } from '../../components/features/dashboard/StatMetricCard';
import { CreateLeaveRequestModal } from '../../components/features/requests/CreateLeaveRequestModal';
import { useAuth } from '../../hooks/useAuth';
import { dashboardApi } from '../../api/dashboard.api';
import { leaveRequestsApi } from '../../api/leaveRequests.api';
import { balancesApi } from '../../api/balances.api';
import { Users, Clock, ShieldCheck, CalendarDays, Building2, CheckCircle2 } from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const { user, isManager, isHR } = useAuth();
  const [requestModalOpen, setRequestModalOpen] = useState(false);

  // Fetch employee dashboard stats
  const { data: empDashboard } = useQuery({
    queryKey: ['employeeDashboard', user?.id],
    queryFn: () => dashboardApi.getEmployeeDashboard(user?.id),
  });

  // Fetch balances
  const { data: balances = [] } = useQuery({
    queryKey: ['myBalances', user?.id],
    queryFn: () => balancesApi.getMyBalances(user?.id),
  });

  // Fetch recent requests
  const { data: myRequestsData } = useQuery({
    queryKey: ['myRequests', user?.id],
    queryFn: () => leaveRequestsApi.getMyLeaveRequests({ page: 1, pageSize: 5 }, user?.id),
  });

  // Fetch manager dashboard if manager
  const { data: mgrDashboard } = useQuery({
    queryKey: ['managerDashboard'],
    queryFn: () => dashboardApi.getManagerDashboard(),
    enabled: isManager,
  });

  // Fetch HR dashboard if HR
  const { data: hrDashboard } = useQuery({
    queryKey: ['hrDashboard'],
    queryFn: () => dashboardApi.getHRDashboard(),
    enabled: isHR,
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Welcome Greeting */}
      <WelcomeBanner />

      {/* Role-Specific Metric KPI Cards */}
      {isHR && hrDashboard && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-2">
          <StatMetricCard
            title="Total Employees"
            value={hrDashboard.totalEmployees}
            subtitle="Across all departments"
            icon={<Users className="w-5 h-5" />}
            iconBg="bg-blue-50 text-blue-600"
          />
          <StatMetricCard
            title="Pending HR Approvals"
            value={hrDashboard.pendingHRApprovals}
            subtitle="Requires final review"
            icon={<ShieldCheck className="w-5 h-5" />}
            iconBg="bg-amber-50 text-brand-orange"
          />
          <StatMetricCard
            title="Currently On Leave"
            value={hrDashboard.employeesCurrentlyOnLeave}
            subtitle="Staff away today"
            icon={<Clock className="w-5 h-5" />}
            iconBg="bg-emerald-50 text-emerald-600"
          />
          <StatMetricCard
            title="Departments"
            value={hrDashboard.totalDepartments}
            subtitle="Active company units"
            icon={<Building2 className="w-5 h-5" />}
            iconBg="bg-brand-lightTeal text-brand-darkTeal"
          />
        </div>
      )}

      {isManager && !isHR && mgrDashboard && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-2">
          <StatMetricCard
            title="Team Size"
            value={mgrDashboard.teamSize}
            subtitle="Direct and indirect reports"
            icon={<Users className="w-5 h-5" />}
            iconBg="bg-blue-50 text-blue-600"
          />
          <StatMetricCard
            title="Pending Approvals"
            value={mgrDashboard.pendingRequests}
            subtitle="Awaiting your sign-off"
            icon={<Clock className="w-5 h-5" />}
            iconBg="bg-amber-50 text-brand-orange"
          />
          <StatMetricCard
            title="Team Away Today"
            value={mgrDashboard.employeesCurrentlyOnLeave}
            subtitle="On approved leave"
            icon={<CheckCircle2 className="w-5 h-5" />}
            iconBg="bg-emerald-50 text-emerald-600"
          />
        </div>
      )}

      {/* Main Visual Dashboard Cards Grid (Aligned with Mockup) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Row 1, Col 1: My Leave Balance (5 cols on large screens) */}
        <div className="lg:col-span-6 xl:col-span-5 flex flex-col">
          <LeaveBalanceCard balances={balances} />
        </div>

        {/* Row 1, Col 2: Upcoming Team Leave (4 cols) */}
        <div className="lg:col-span-6 xl:col-span-4 flex flex-col">
          <UpcomingTeamLeaveCard />
        </div>

        {/* Row 1, Col 3: Profile Card (3 cols) */}
        <div className="lg:col-span-12 xl:col-span-3 flex flex-col">
          <ProfileCard />
        </div>

        {/* Row 2, Col 1: Recent Activity (5 cols) */}
        <div className="lg:col-span-6 xl:col-span-5 flex flex-col">
          <RecentActivityCard />
        </div>

        {/* Row 2, Col 2: My Requests (4 cols) */}
        <div className="lg:col-span-6 xl:col-span-4 flex flex-col">
          <MyRequestsWidget requests={myRequestsData?.items || []} />
        </div>

        {/* Row 2, Col 3: Quick Actions (3 cols) */}
        <div className="lg:col-span-12 xl:col-span-3 flex flex-col">
          <QuickActionsWidget onRequestLeave={() => setRequestModalOpen(true)} />
        </div>
      </div>

      {/* Create Leave Request Modal */}
      <CreateLeaveRequestModal
        isOpen={requestModalOpen}
        onClose={() => setRequestModalOpen(false)}
      />
    </div>
  );
};
