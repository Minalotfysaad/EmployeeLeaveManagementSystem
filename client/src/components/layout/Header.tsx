import React, { useState, useRef, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Bell,
  ChevronDown,
  LogOut,
  User as UserIcon,
  Menu,
  Shield,
  Briefcase,
  CheckCircle2,
  Clock,
  RotateCcw,
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { Avatar } from '../ui/Avatar';
import { mockStore } from '../../api/mock/mockStore';
import { useToast } from '../../hooks/useToast';

interface HeaderProps {
  onOpenMobileNav: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenMobileNav }) => {
  const { user, logout, switchRole } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const { success } = useToast();

  const [profileOpen, setProfileOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  const profileRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setProfileOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setNotificationsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Compute title from route path
  const getPageTitle = () => {
    const path = location.pathname;
    if (path.includes('/dashboard')) return 'Dashboard';
    if (path.includes('/requests')) return 'My Leave Requests';
    if (path.includes('/balance')) return 'Leave Balance';
    if (path.includes('/history')) return 'Leave History';
    if (path.includes('/calendar')) return 'Team Availability Calendar';
    if (path.includes('/manager/approvals')) return 'Pending Approvals';
    if (path.includes('/manager/team')) return 'Team Management';
    if (path.includes('/hr/approvals')) return 'HR Leave Approvals';
    if (path.includes('/hr/employees')) return 'Employee Directory';
    if (path.includes('/hr/departments')) return 'Departments Management';
    if (path.includes('/hr/leave-types')) return 'Leave Types & Allowances';
    if (path.includes('/hr/holidays')) return 'Public Holidays';
    if (path.includes('/settings')) return 'Settings';
    return 'Dashboard';
  };

  const notifications = [
    {
      id: 'n1',
      title: 'Leave Request Approved',
      time: '2 hours ago',
      read: false,
      icon: CheckCircle2,
      color: 'text-emerald-600',
    },
    {
      id: 'n2',
      title: 'Upcoming Leave Reminder',
      time: '1 day ago',
      read: false,
      icon: Clock,
      color: 'text-brand-teal',
    },
    {
      id: 'n3',
      title: 'Holiday: Thanksgiving coming up',
      time: '3 days ago',
      read: true,
      icon: Briefcase,
      color: 'text-brand-orange',
    },
  ];

  const handleResetData = () => {
    mockStore.resetToDefaults();
    success('Mock datasets restored to original state');
    setProfileOpen(false);
    window.location.reload();
  };

  return (
    <header className="h-20 bg-white border-b border-[#E5EAF0] px-4 sm:px-8 flex items-center justify-between sticky top-0 z-20">
      {/* Left Title & Mobile Menu Trigger */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobileNav}
          className="lg:hidden p-2 rounded-xl text-gray-500 hover:text-navy-900 hover:bg-gray-100 transition-colors"
          aria-label="Open navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-navy-900 tracking-tight font-sans">
            {getPageTitle()}
          </h2>
        </div>
      </div>

      {/* Right User Actions & Persona Quick-Switcher */}
      <div className="flex items-center gap-3 sm:gap-5">
        {/* Role Quick Switcher for Reviewers */}
        <div className="hidden sm:flex items-center bg-[#F6F8FB] border border-[#E5EAF0] rounded-xl p-1 gap-1">
          <button
            onClick={() => {
              switchRole('Employee');
              success('Switched persona to Leila Vance (Employee)');
            }}
            className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-all ${
              user?.roles?.includes('Employee') && !user?.roles?.includes('HR') && !user?.roles?.includes('Manager')
                ? 'bg-white text-navy-900 shadow-sm'
                : 'text-gray-500 hover:text-gray-800'
            }`}
          >
            Employee
          </button>
          <button
            onClick={() => {
              switchRole('Manager');
              success('Switched persona to David Chen (Manager)');
            }}
            className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-all ${
              user?.roles?.includes('Manager') && !user?.roles?.includes('HR')
                ? 'bg-white text-brand-orange shadow-sm font-bold'
                : 'text-gray-500 hover:text-gray-800'
            }`}
          >
            Manager
          </button>
          <button
            onClick={() => {
              switchRole('HR');
              success('Switched persona to System Admin (HR)');
            }}
            className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-all ${
              user?.roles?.includes('HR')
                ? 'bg-white text-brand-darkTeal shadow-sm font-bold'
                : 'text-gray-500 hover:text-gray-800'
            }`}
          >
            HR Admin
          </button>
        </div>

        {/* Notifications Dropdown */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setNotificationsOpen(!notificationsOpen)}
            className="relative p-2.5 rounded-xl text-gray-500 hover:text-navy-900 hover:bg-gray-100 transition-colors"
            aria-label="Notifications"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-brand-orange ring-2 ring-white" />
          </button>

          {notificationsOpen && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl border border-[#E5EAF0] shadow-dropdown py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="px-4 py-2 border-b border-gray-100 flex items-center justify-between">
                <span className="text-xs font-bold text-navy-900 uppercase tracking-wider">Notifications</span>
                <span className="text-[11px] text-brand-teal font-semibold">Mark all read</span>
              </div>
              <div className="divide-y divide-gray-50 max-h-72 overflow-y-auto">
                {notifications.map((notif) => {
                  const Icon = notif.icon;
                  return (
                    <div
                      key={notif.id}
                      className="px-4 py-3 hover:bg-gray-50 transition-colors flex items-start gap-3 cursor-pointer"
                    >
                      <div className={`p-1.5 rounded-lg bg-gray-100 ${notif.color} mt-0.5`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="flex-1">
                        <p className="text-xs font-semibold text-gray-800">{notif.title}</p>
                        <span className="text-[10px] text-gray-400">{notif.time}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* User Profile Dropdown */}
        <div className="relative" ref={profileRef}>
          <button
            onClick={() => setProfileOpen(!profileOpen)}
            className="flex items-center gap-3 p-1 pl-2 rounded-xl hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-200"
          >
            <Avatar
              name={user?.fullName || 'Leila Vance'}
              src={
                user?.email === 'leila.vance@company.com'
                  ? 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80'
                  : undefined
              }
              size="sm"
            />
            <div className="hidden md:flex flex-col text-left">
              <span className="text-xs font-bold text-navy-900 leading-tight">
                {user?.fullName || 'Leila Vance'}
              </span>
              <span className="text-[11px] text-gray-500 font-medium">
                {user?.roles?.includes('HR')
                  ? 'HR Admin'
                  : user?.roles?.includes('Manager')
                  ? 'Engineering Manager'
                  : 'Product Designer'}
              </span>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
          </button>

          {profileOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl border border-[#E5EAF0] shadow-dropdown py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="px-4 py-2 border-b border-gray-100">
                <p className="text-xs font-bold text-navy-900">{user?.fullName}</p>
                <p className="text-[11px] text-gray-500 truncate">{user?.email}</p>
              </div>

              <div className="py-1">
                <button
                  onClick={() => {
                    navigate('/settings');
                    setProfileOpen(false);
                  }}
                  className="w-full px-4 py-2 text-xs text-gray-700 hover:bg-gray-50 flex items-center gap-2.5 transition-colors"
                >
                  <UserIcon className="w-4 h-4 text-gray-400" />
                  My Profile
                </button>
                <button
                  onClick={handleResetData}
                  className="w-full px-4 py-2 text-xs text-gray-700 hover:bg-gray-50 flex items-center gap-2.5 transition-colors"
                >
                  <RotateCcw className="w-4 h-4 text-gray-400" />
                  Reset Sample Data
                </button>
              </div>

              <div className="border-t border-gray-100 pt-1">
                <button
                  onClick={() => {
                    logout();
                    navigate('/login');
                  }}
                  className="w-full px-4 py-2 text-xs text-rose-600 hover:bg-rose-50 flex items-center gap-2.5 transition-colors font-medium"
                >
                  <LogOut className="w-4 h-4 text-rose-500" />
                  Log out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
