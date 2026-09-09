import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  X,
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
} from 'lucide-react';
import { Logo } from '../ui/Logo';
import { useAuth } from '../../hooks/useAuth';
import { cn } from '../../utils/cn';

interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MobileNav: React.FC<MobileNavProps> = ({ isOpen, onClose }) => {
  const { isManager, isHR } = useAuth();

  if (!isOpen) return null;

  const links = [
    { to: '/dashboard', label: 'Overview', icon: LayoutDashboard },
    { to: '/requests', label: 'Requests', icon: FileText },
    { to: '/balance', label: 'Balance', icon: PieChart },
    { to: '/history', label: 'History', icon: History },
    { to: '/calendar', label: 'Calendar', icon: Calendar },
    { to: '/settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="fixed inset-0 z-50 lg:hidden flex">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-navy-950/60 backdrop-blur-sm animate-in fade-in"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="relative w-72 max-w-[80vw] bg-navy-900 text-gray-200 flex flex-col h-full z-10 shadow-2xl animate-in slide-in-from-left duration-200">
        {/* Brand & Close */}
        <div className="p-5 flex items-center justify-between border-b border-white/5">
          <Logo variant="dark" size="sm" />
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/10"
            aria-label="Close navigation"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Links */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          <div>
            <span className="px-3 text-[10px] font-bold uppercase tracking-wider text-gray-400">
              Employee
            </span>
            <nav className="mt-2 space-y-1">
              {links.map((link) => {
                const Icon = link.icon;
                return (
                  <NavLink
                    key={link.to}
                    to={link.to}
                    onClick={onClose}
                    className={({ isActive }) =>
                      cn(
                        'flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-colors',
                        isActive
                          ? 'bg-brand-teal text-white shadow-md'
                          : 'text-gray-300 hover:text-white hover:bg-white/5'
                      )
                    }
                  >
                    <Icon className="w-4 h-4" />
                    <span>{link.label}</span>
                  </NavLink>
                );
              })}
            </nav>
          </div>

          {isManager && (
            <div>
              <span className="px-3 text-[10px] font-bold uppercase tracking-wider text-brand-orange">
                Manager
              </span>
              <nav className="mt-2 space-y-1">
                <NavLink
                  to="/manager/approvals"
                  onClick={onClose}
                  className={({ isActive }) =>
                    cn(
                      'flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-colors',
                      isActive
                        ? 'bg-brand-orange text-navy-950 shadow-md'
                        : 'text-gray-300 hover:text-white hover:bg-white/5'
                    )
                  }
                >
                  <CheckSquare className="w-4 h-4" />
                  <span>Pending Approvals</span>
                </NavLink>
                <NavLink
                  to="/manager/team"
                  onClick={onClose}
                  className={({ isActive }) =>
                    cn(
                      'flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-colors',
                      isActive
                        ? 'bg-brand-orange text-navy-950 shadow-md'
                        : 'text-gray-300 hover:text-white hover:bg-white/5'
                    )
                  }
                >
                  <Users className="w-4 h-4" />
                  <span>Team</span>
                </NavLink>
              </nav>
            </div>
          )}

          {isHR && (
            <div>
              <span className="px-3 text-[10px] font-bold uppercase tracking-wider text-brand-cyan">
                Administration
              </span>
              <nav className="mt-2 space-y-1">
                <NavLink
                  to="/hr/approvals"
                  onClick={onClose}
                  className={({ isActive }) =>
                    cn(
                      'flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-colors',
                      isActive
                        ? 'bg-brand-cyan text-navy-950 shadow-md'
                        : 'text-gray-300 hover:text-white hover:bg-white/5'
                    )
                  }
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>HR Approvals</span>
                </NavLink>
                <NavLink
                  to="/hr/employees"
                  onClick={onClose}
                  className={({ isActive }) =>
                    cn(
                      'flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-colors',
                      isActive
                        ? 'bg-brand-cyan text-navy-950 shadow-md'
                        : 'text-gray-300 hover:text-white hover:bg-white/5'
                    )
                  }
                >
                  <Users className="w-4 h-4" />
                  <span>Employees</span>
                </NavLink>
                <NavLink
                  to="/hr/departments"
                  onClick={onClose}
                  className={({ isActive }) =>
                    cn(
                      'flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-colors',
                      isActive
                        ? 'bg-brand-cyan text-navy-950 shadow-md'
                        : 'text-gray-300 hover:text-white hover:bg-white/5'
                    )
                  }
                >
                  <Building2 className="w-4 h-4" />
                  <span>Departments</span>
                </NavLink>
                <NavLink
                  to="/hr/leave-types"
                  onClick={onClose}
                  className={({ isActive }) =>
                    cn(
                      'flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-colors',
                      isActive
                        ? 'bg-brand-cyan text-navy-950 shadow-md'
                        : 'text-gray-300 hover:text-white hover:bg-white/5'
                    )
                  }
                >
                  <Layers className="w-4 h-4" />
                  <span>Leave Types</span>
                </NavLink>
                <NavLink
                  to="/hr/holidays"
                  onClick={onClose}
                  className={({ isActive }) =>
                    cn(
                      'flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-colors',
                      isActive
                        ? 'bg-brand-cyan text-navy-950 shadow-md'
                        : 'text-gray-300 hover:text-white hover:bg-white/5'
                    )
                  }
                >
                  <CalendarDays className="w-4 h-4" />
                  <span>Holidays</span>
                </NavLink>
              </nav>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
