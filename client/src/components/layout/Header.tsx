import React, { useState, useRef, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Bell,
  ChevronDown,
  ChevronRight,
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
import { cn } from '../../utils/cn';

interface HeaderProps {
  onOpenMobileNav: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenMobileNav }) => {
  const { user, logout, switchRole, isDemoMode } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const { success } = useToast();

  const [profileOpen, setProfileOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  const [notifications, setNotifications] = useState([
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
  ]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleMarkAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    success('Marked all notifications as read');
  };

  const handleNotificationClick = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

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

  // Compute breadcrumb navigation from route path
  const getBreadcrumb = () => {
    const path = location.pathname;
    if (path.includes('/dashboard')) return { section: 'Overview', page: 'Dashboard' };
    if (path.includes('/requests')) return { section: 'Time Off', page: 'My Requests' };
    if (path.includes('/balance')) return { section: 'Time Off', page: 'Leave Balances' };
    if (path.includes('/history')) return { section: 'Time Off', page: 'Leave History' };
    if (path.includes('/calendar')) return { section: 'Time Off', page: 'Team Calendar' };
    if (path.includes('/manager/approvals')) return { section: 'Management', page: 'Pending Approvals' };
    if (path.includes('/manager/team')) return { section: 'Management', page: 'Team Directory' };
    if (path.includes('/hr/approvals')) return { section: 'HR Admin', page: 'Approvals' };
    if (path.includes('/hr/employees')) return { section: 'HR Admin', page: 'Employees' };
    if (path.includes('/hr/departments')) return { section: 'HR Admin', page: 'Departments' };
    if (path.includes('/hr/leave-types')) return { section: 'HR Admin', page: 'Leave Types & Policy' };
    if (path.includes('/hr/holidays')) return { section: 'HR Admin', page: 'Public Holidays' };
    if (path.includes('/settings')) return { section: 'Account', page: 'Settings' };
    return { section: 'Portal', page: 'Dashboard' };
  };

  const breadcrumb = getBreadcrumb();

  const handleResetData = () => {
    mockStore.resetToDefaults();
    success('Mock datasets restored to original state');
    setProfileOpen(false);
    window.location.reload();
  };

  return (
    <header className="h-20 bg-white border-b border-[#E5EAF0] px-4 sm:px-8 flex items-center justify-between sticky top-0 z-20">
      {/* Left Breadcrumbs & Mobile Menu Trigger */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobileNav}
          className="lg:hidden p-2 rounded-xl text-gray-500 hover:text-navy-900 hover:bg-gray-100 transition-colors"
          aria-label="Open navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs">
          <span className="font-medium text-gray-400">
            {breadcrumb.section}
          </span>
          <ChevronRight className="w-3.5 h-3.5 text-gray-300 flex-shrink-0" />
          <span className="font-semibold text-navy-900">
            {breadcrumb.page}
          </span>
        </nav>
      </div>

      {/* Right User Actions & Persona Quick-Switcher */}
      <div className="flex items-center gap-3 sm:gap-5">
        {/* Role Quick Switcher (ONLY shown in Demo Mode) */}
        {isDemoMode && (
          <div className="hidden sm:flex items-center bg-[#F6F8FB] border border-[#E5EAF0] rounded-xl p-1 gap-1">
            <span className="px-2 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
              Demo:
            </span>
            <button
              onClick={() => {
                switchRole('Employee');
                success('Switched demo persona to Leila Vance (Employee)');
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
                success('Switched demo persona to David Chen (Manager)');
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
                success('Switched demo persona to System Admin (HR)');
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
        )}

        {/* Notifications Dropdown */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setNotificationsOpen(!notificationsOpen)}
            className="relative p-2.5 rounded-xl text-gray-500 hover:text-navy-900 hover:bg-gray-100 transition-colors"
            aria-label="Notifications"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-brand-orange ring-2 ring-white animate-pulse" />
            )}
          </button>

          {notificationsOpen && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl border border-[#E5EAF0] shadow-dropdown py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="px-4 py-2.5 border-b border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-navy-900 uppercase tracking-wider">Notifications</span>
                  {unreadCount > 0 && (
                    <span className="px-1.5 py-0.5 rounded-full bg-brand-orange/10 text-brand-orange text-[10px] font-bold">
                      {unreadCount} new
                    </span>
                  )}
                </div>
                <button
                  type="button"
                  onClick={handleMarkAllRead}
                  disabled={unreadCount === 0}
                  className="text-[11px] text-brand-teal hover:text-brand-darkTeal font-semibold transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                >
                  Mark all read
                </button>
              </div>
              <div className="divide-y divide-gray-50 max-h-72 overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="p-4 text-center text-xs text-gray-400">No notifications</div>
                ) : (
                  notifications.map((notif) => {
                    const Icon = notif.icon;
                    return (
                      <div
                        key={notif.id}
                        onClick={() => handleNotificationClick(notif.id)}
                        className={cn(
                          'px-4 py-3 hover:bg-gray-50 transition-colors flex items-start gap-3 cursor-pointer',
                          !notif.read && 'bg-brand-teal/5'
                        )}
                      >
                        <div className={`p-1.5 rounded-lg bg-gray-100 ${notif.color} mt-0.5`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between gap-2">
                            <p className={cn('text-xs', !notif.read ? 'font-bold text-navy-900' : 'font-medium text-gray-700')}>
                              {notif.title}
                            </p>
                            {!notif.read && (
                              <span className="w-1.5 h-1.5 rounded-full bg-brand-orange flex-shrink-0" />
                            )}
                          </div>
                          <span className="text-[10px] text-gray-400">{notif.time}</span>
                        </div>
                      </div>
                    );
                  })
                )}
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
                  className="w-full px-4 py-2 text-xs text-rose-600 hover:bg-rose-50 flex items-center gap-2.5 transition-colors"
                >
                  <LogOut className="w-4 h-4 text-rose-500" />
                  {isDemoMode ? 'Exit Demo Mode' : 'Sign Out'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
