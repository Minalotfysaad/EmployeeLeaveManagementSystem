import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  FileText,
  PieChart,
  History,
  Calendar,
  Settings,
  Users,
  CheckSquare,
  ShieldCheck,
  Building2,
  Layers,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { Logo } from '../ui/Logo';
import { useAuth } from '../../hooks/useAuth';
import { cn } from '../../utils/cn';

interface SidebarProps {
  className?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({ className }) => {
  const { isManager, isHR } = useAuth();
  const [collapsed, setCollapsed] = useState(false);

  const employeeLinks = [
    { to: '/dashboard', label: 'Overview', icon: LayoutDashboard },
    { to: '/requests', label: 'Requests', icon: FileText },
    { to: '/balance', label: 'Balance', icon: PieChart },
    { to: '/history', label: 'History', icon: History },
    { to: '/calendar', label: 'Calendar', icon: Calendar },
    { to: '/settings', label: 'Settings', icon: Settings },
  ];

  const managerLinks = [
    { to: '/manager/approvals', label: 'Pending Approvals', icon: CheckSquare },
    { to: '/manager/team', label: 'Team', icon: Users },
  ];

  const hrLinks = [
    { to: '/hr/approvals', label: 'HR Approvals', icon: ShieldCheck },
    { to: '/hr/employees', label: 'Employees', icon: Users },
    { to: '/hr/departments', label: 'Departments', icon: Building2 },
    { to: '/hr/leave-types', label: 'Leave Types', icon: Layers },
    { to: '/hr/holidays', label: 'Holidays', icon: CalendarDays },
  ];

  return (
    <aside
      className={cn(
        'relative flex flex-col bg-navy-900 text-gray-300 transition-all duration-300 select-none z-30',
        'border-r border-navy-950/40 shadow-xl',
        collapsed ? 'w-20' : 'w-64',
        className
      )}
    >
      {/* Brand Header */}
      <div className="h-20 flex items-center justify-between px-5 border-b border-white/5">
        <NavLink to="/dashboard" className="flex items-center">
          <Logo variant="dark" size="md" collapsed={collapsed} />
        </NavLink>

        {/* Collapse button on desktop */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="hidden md:flex p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 overflow-y-auto py-5 px-3 space-y-6">
        {/* Main Employee Navigation */}
        <div>
          {!collapsed && (
            <span className="px-3 text-[11px] font-bold uppercase tracking-wider text-gray-400/80">
              Employee
            </span>
          )}
          <nav className="mt-2 space-y-1">
            {employeeLinks.map((link) => {
              const Icon = link.icon;
              return (
                <NavLink
                  key={link.to}
                  to={link.to}
                  className={({ isActive }) =>
                    cn(
                      'flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all group',
                      isActive
                        ? 'bg-brand-teal text-white shadow-md shadow-brand-teal/20'
                        : 'text-gray-300 hover:text-white hover:bg-white/5',
                      collapsed && 'justify-center px-2'
                    )
                  }
                  title={collapsed ? link.label : undefined}
                >
                  <Icon className="w-4 h-4 flex-shrink-0" />
                  {!collapsed && <span>{link.label}</span>}
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Manager Section */}
        {isManager && (
          <div>
            {!collapsed && (
              <span className="px-3 text-[11px] font-bold uppercase tracking-wider text-brand-orange">
                Manager
              </span>
            )}
            <nav className="mt-2 space-y-1">
              {managerLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <NavLink
                    key={link.to}
                    to={link.to}
                    className={({ isActive }) =>
                      cn(
                        'flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all group',
                        isActive
                          ? 'bg-brand-orange text-navy-950 shadow-md shadow-brand-orange/20'
                          : 'text-gray-300 hover:text-white hover:bg-white/5',
                        collapsed && 'justify-center px-2'
                      )
                    }
                    title={collapsed ? link.label : undefined}
                  >
                    <Icon className="w-4 h-4 flex-shrink-0" />
                    {!collapsed && <span>{link.label}</span>}
                  </NavLink>
                );
              })}
            </nav>
          </div>
        )}

        {/* HR Section */}
        {isHR && (
          <div>
            {!collapsed && (
              <span className="px-3 text-[11px] font-bold uppercase tracking-wider text-brand-cyan">
                Administration
              </span>
            )}
            <nav className="mt-2 space-y-1">
              {hrLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <NavLink
                    key={link.to}
                    to={link.to}
                    className={({ isActive }) =>
                      cn(
                        'flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all group',
                        isActive
                          ? 'bg-brand-cyan text-navy-950 shadow-md shadow-brand-cyan/20'
                          : 'text-gray-300 hover:text-white hover:bg-white/5',
                        collapsed && 'justify-center px-2'
                      )
                    }
                    title={collapsed ? link.label : undefined}
                  >
                    <Icon className="w-4 h-4 flex-shrink-0" />
                    {!collapsed && <span>{link.label}</span>}
                  </NavLink>
                );
              })}
            </nav>
          </div>
        )}
      </div>

      {/* Footer Branding Info */}
      {!collapsed && (
        <div className="p-4 border-t border-white/5 text-[11px] text-gray-400 flex items-center justify-between">
          <span>Leavo SaaS v1.0</span>
          <span className="w-2 h-2 rounded-full bg-emerald-400" title="System Operational" />
        </div>
      )}
    </aside>
  );
};
