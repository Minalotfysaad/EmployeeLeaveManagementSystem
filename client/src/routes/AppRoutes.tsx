import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AppLayout } from '../components/layout/AppLayout';
import { ProtectedRoute } from './ProtectedRoute';
import { RoleRoute } from './RoleRoute';

// Pages
import { LoginPage } from '../pages/auth/LoginPage';
import { RegisterPage } from '../pages/auth/RegisterPage';
import { DashboardPage } from '../pages/dashboard/DashboardPage';
import { MyRequestsPage } from '../pages/requests/MyRequestsPage';
import { LeaveBalancePage } from '../pages/balance/LeaveBalancePage';
import { LeaveHistoryPage } from '../pages/history/LeaveHistoryPage';
import { CalendarPage } from '../pages/calendar/CalendarPage';
import { SettingsPage } from '../pages/settings/SettingsPage';

// Manager Pages
import { PendingApprovalsPage } from '../pages/manager/PendingApprovalsPage';
import { TeamPage } from '../pages/manager/TeamPage';

// HR Pages
import { HRApprovalsPage } from '../pages/hr/HRApprovalsPage';
import { EmployeesPage } from '../pages/hr/EmployeesPage';
import { DepartmentsPage } from '../pages/hr/DepartmentsPage';
import { LeaveTypesPage } from '../pages/hr/LeaveTypesPage';
import { HolidaysPage } from '../pages/hr/HolidaysPage';

import { NotFoundPage } from '../pages/NotFoundPage';

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Public Auth Routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Protected App Routes */}
      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/calendar" element={<CalendarPage />} />
          <Route path="/settings" element={<SettingsPage />} />

          {/* Employee & Manager personal leave routes (HR has administrative privileges only) */}
          <Route
            element={
              <RoleRoute
                allowedRoles={['Employee', 'Manager']}
                errorMessage="HR accounts have administrative privileges only and do not have personal leave requests, balances, or history."
              />
            }
          >
            <Route path="/requests" element={<MyRequestsPage />} />
            <Route path="/balance" element={<LeaveBalancePage />} />
            <Route path="/history" element={<LeaveHistoryPage />} />
          </Route>

          {/* Manager Routes (HR is restricted from manager pending approvals) */}
          <Route element={<RoleRoute allowedRoles={['Manager']} />}>
            <Route path="/manager/approvals" element={<PendingApprovalsPage />} />
            <Route path="/manager/team" element={<TeamPage />} />
          </Route>

          {/* HR Admin Routes */}
          <Route element={<RoleRoute allowedRoles={['HR']} />}>
            <Route path="/hr/approvals" element={<HRApprovalsPage />} />
            <Route path="/hr/employees" element={<EmployeesPage />} />
            <Route path="/hr/departments" element={<DepartmentsPage />} />
            <Route path="/hr/leave-types" element={<LeaveTypesPage />} />
            <Route path="/hr/holidays" element={<HolidaysPage />} />
          </Route>
        </Route>
      </Route>

      {/* 404 Fallback */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};
