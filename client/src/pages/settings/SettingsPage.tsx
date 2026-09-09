import React, { useState } from 'react';
import { PageHeader } from '../../components/shared/PageHeader';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Avatar } from '../../components/ui/Avatar';
import { Badge } from '../../components/ui/Badge';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../hooks/useToast';
import { User, Mail, Shield, Bell, CheckCircle2, RotateCcw } from 'lucide-react';
import { mockStore } from '../../api/mock/mockStore';

export const SettingsPage: React.FC = () => {
  const { user, switchRole } = useAuth();
  const { success } = useToast();

  const [notificationsEmail, setNotificationsEmail] = useState(true);
  const [notificationsSlack, setNotificationsSlack] = useState(true);

  const handleSavePreferences = (e: React.FormEvent) => {
    e.preventDefault();
    success('Notification preferences updated successfully.');
  };

  const handleResetData = () => {
    mockStore.resetToDefaults();
    success('Mock datasets restored to initial state.');
    setTimeout(() => window.location.reload(), 600);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto animate-in fade-in duration-150">
      <PageHeader
        title="Settings & Profile"
        subtitle="Manage your personal profile, notification preferences, and organizational access."
      />

      {/* User Profile Card */}
      <Card className="p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
          <Avatar
            name={user?.fullName || 'Leila Vance'}
            src={
              user?.email === 'leila.vance@company.com'
                ? 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80'
                : undefined
            }
            size="xl"
            className="ring-4 ring-brand-teal/15 shadow-sm"
          />

          <div className="flex-1">
            <h3 className="text-xl font-bold text-navy-900">{user?.fullName || 'Leila Vance'}</h3>
            <p className="text-xs text-gray-500 mt-0.5">{user?.email}</p>

            <div className="flex items-center gap-2 mt-3">
              {user?.roles?.map((r) => (
                <Badge key={r} variant="teal" size="sm">
                  {r}
                </Badge>
              ))}
              <span className="text-xs text-gray-400 font-medium">Department: Information Technology</span>
            </div>
          </div>
        </div>
      </Card>

      {/* Switch Demo Role Persona */}
      <Card className="p-6">
        <h3 className="text-base font-bold text-navy-900 mb-1">Interactive Persona Switcher</h3>
        <p className="text-xs text-gray-500 mb-4">
          Switch between predefined roles to preview and test role-specific workflows (approvals, administration, and team management).
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <button
            onClick={() => {
              switchRole('Employee');
              success('Switched to Leila Vance (Employee)');
            }}
            className={`p-4 rounded-xl border text-left transition-all ${
              user?.roles?.includes('Employee') && !user?.roles?.includes('HR') && !user?.roles?.includes('Manager')
                ? 'border-brand-teal bg-brand-lightTeal/40 ring-2 ring-brand-teal/20'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <span className="font-bold text-navy-900 text-sm block">Leila Vance</span>
            <span className="text-xs text-gray-500 block mt-0.5">Role: Employee</span>
            <span className="text-[11px] text-brand-darkTeal font-medium mt-2 block">
              Requests, Balances, Calendar
            </span>
          </button>

          <button
            onClick={() => {
              switchRole('Manager');
              success('Switched to David Chen (Manager)');
            }}
            className={`p-4 rounded-xl border text-left transition-all ${
              user?.roles?.includes('Manager') && !user?.roles?.includes('HR')
                ? 'border-brand-orange bg-amber-50/50 ring-2 ring-brand-orange/20'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <span className="font-bold text-navy-900 text-sm block">David Chen</span>
            <span className="text-xs text-gray-500 block mt-0.5">Role: Manager</span>
            <span className="text-[11px] text-brand-orange font-medium mt-2 block">
              Pending Approvals, Team Management
            </span>
          </button>

          <button
            onClick={() => {
              switchRole('HR');
              success('Switched to System Administrator (HR Admin)');
            }}
            className={`p-4 rounded-xl border text-left transition-all ${
              user?.roles?.includes('HR')
                ? 'border-brand-cyan bg-sky-50/50 ring-2 ring-brand-cyan/20'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <span className="font-bold text-navy-900 text-sm block">System Administrator</span>
            <span className="text-xs text-gray-500 block mt-0.5">Role: HR Admin</span>
            <span className="text-[11px] text-sky-700 font-medium mt-2 block">
              HR Approvals, Directory, Depts, Holidays
            </span>
          </button>
        </div>
      </Card>

      {/* Notifications Preferences */}
      <Card className="p-6">
        <h3 className="text-base font-bold text-navy-900 mb-1">Notification Preferences</h3>
        <p className="text-xs text-gray-500 mb-4">
          Choose which notifications you wish to receive regarding leave request updates.
        </p>

        <form onSubmit={handleSavePreferences} className="space-y-4">
          <div className="flex items-center justify-between py-2 border-b border-gray-100">
            <div>
              <p className="text-xs font-bold text-gray-800">Email Notifications</p>
              <span className="text-[11px] text-gray-500">
                Receive email alerts when leave requests are approved or rejected.
              </span>
            </div>
            <input
              type="checkbox"
              checked={notificationsEmail}
              onChange={(e) => setNotificationsEmail(e.target.checked)}
              className="w-4 h-4 text-brand-teal rounded border-gray-300 focus:ring-brand-teal"
            />
          </div>

          <div className="flex items-center justify-between py-2 border-b border-gray-100">
            <div>
              <p className="text-xs font-bold text-gray-800">Upcoming Holiday Reminders</p>
              <span className="text-[11px] text-gray-500">
                Receive notifications 3 days prior to recognized organization holidays.
              </span>
            </div>
            <input
              type="checkbox"
              checked={notificationsSlack}
              onChange={(e) => setNotificationsSlack(e.target.checked)}
              className="w-4 h-4 text-brand-teal rounded border-gray-300 focus:ring-brand-teal"
            />
          </div>

          <div className="pt-2 flex items-center justify-between">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleResetData}
              leftIcon={<RotateCcw className="w-3.5 h-3.5" />}
            >
              Reset Sample Data
            </Button>

            <Button type="submit" variant="primary" size="sm">
              Save Preferences
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};
