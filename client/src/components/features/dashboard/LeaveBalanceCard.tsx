import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check, Calendar } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../../ui/Card';
import { BalanceDto } from '../../../types/balance.types';
import { cn } from '../../../utils/cn';

interface LeaveBalanceCardProps {
  balances?: BalanceDto[];
}

interface LeaveCategoryData {
  id: string;
  name: string;
  accrued: number;
  used: number;
  requested: number;
  remaining: number;
  maxScale: number;
  ticks: number[];
}

export const LeaveBalanceCard: React.FC<LeaveBalanceCardProps> = ({ balances = [] }) => {
  const [selectedKey, setSelectedKey] = useState<string>('');
  const [dropdownOpen, setDropdownOpen] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Build categories list from balances
  const categories = React.useMemo<LeaveCategoryData[]>(() => {
    if (!balances || balances.length === 0) {
      return [];
    }

    return balances.map((b) => {
      const remaining = b.remainingDays;
      const defaultAllowance = 24;
      const accrued = Math.max(remaining, defaultAllowance);
      const used = Math.max(0, accrued - remaining);
      const maxScale = Math.max(16, Math.ceil(accrued / 4) * 4);
      const step = maxScale / 4;
      const ticks = [maxScale, Math.round(step * 3), Math.round(step * 2), Math.round(step * 1), 0];
      return {
        id: b.leaveTypeId || b.leaveType,
        name: b.leaveType,
        accrued,
        used,
        requested: 0,
        remaining,
        maxScale,
        ticks,
      };
    });
  }, [balances]);

  // Set default selection when categories change
  useEffect(() => {
    if (categories.length > 0 && (!selectedKey || !categories.find((c) => c.id === selectedKey))) {
      setSelectedKey(categories[0].id);
    }
  }, [categories, selectedKey]);

  if (categories.length === 0) {
    return (
      <Card className="flex flex-col h-full">
        <CardHeader className="border-b-0 pb-1 flex flex-row items-center justify-between">
          <CardTitle>My Leave Balance</CardTitle>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col items-center justify-center py-12 px-4 text-center text-xs text-gray-500">
          <div className="w-10 h-10 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-400 mb-2 border border-gray-100">
            <Calendar className="w-5 h-5" />
          </div>
          <p className="font-semibold text-gray-700">No leave balances allocated</p>
          <p className="text-[11px] text-gray-400 mt-0.5 max-w-xs">
            Your organization HR administrator has not allocated leave quotas for your account yet.
          </p>
        </CardContent>
      </Card>
    );
  }

  const activeCategory = categories.find((c) => c.id === selectedKey) || categories[0];
  const { accrued, used, requested, remaining, maxScale, ticks } = activeCategory;

  // Donut chart calculations (based on total allowance)
  const totalDays = accrued || 22;
  const usedPercentage = Math.min(100, Math.round((used / totalDays) * 100));
  const remainingPercentage = Math.max(0, 100 - usedPercentage);

  const radius = 38;
  const circumference = 2 * Math.PI * radius;
  const usedStroke = (usedPercentage / 100) * circumference;
  const remainingStroke = (remainingPercentage / 100) * circumference;

  return (
    <Card className="flex flex-col h-full">
      {/* Header with Interactive Modern Leave Type Dropdown */}
      <CardHeader className="border-b-0 pb-1 flex flex-row items-center justify-between">
        <CardTitle>My Leave Balance</CardTitle>

        {/* Modern Custom Dropdown Selector */}
        <div className="relative" ref={dropdownRef}>
          <button
            type="button"
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-2 bg-[#F0F7FA] hover:bg-[#E2F0F7] text-brand-darkTeal text-xs font-bold py-1.5 px-3 rounded-xl border border-brand-teal/25 transition-all shadow-2xs cursor-pointer focus:outline-none focus:ring-2 focus:ring-brand-teal/20 group select-none"
            aria-expanded={dropdownOpen}
            aria-label="Select leave category"
          >
            <span>{activeCategory?.name || 'Leave Type'}</span>
            <ChevronDown
              className={cn(
                'w-3.5 h-3.5 text-brand-teal group-hover:text-brand-darkTeal transition-transform duration-200',
                dropdownOpen && 'rotate-180'
              )}
            />
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-2xl border border-[#E5EAF0] shadow-dropdown p-1.5 z-30 animate-in fade-in zoom-in-95 duration-150">
              <div className="space-y-1">
                {categories.map((cat) => {
                  const isSelected = selectedKey === cat.id;
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => {
                        setSelectedKey(cat.id);
                        setDropdownOpen(false);
                      }}
                      className={cn(
                        'w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer text-left',
                        isSelected
                          ? 'bg-brand-teal/10 text-brand-darkTeal font-bold'
                          : 'text-gray-700 hover:bg-gray-50 hover:text-navy-900'
                      )}
                    >
                      <span>{cat.name}</span>
                      {isSelected && <Check className="w-3.5 h-3.5 text-brand-teal flex-shrink-0" />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col justify-between pt-2">
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-5 items-center">
          {/* Bar Chart Visualization with Scaled Y-Axis (7 cols) */}
          <div className="sm:col-span-7 flex flex-col pt-2">
            <div className="flex h-36 items-stretch">
              {/* Y-Axis scale numbers on left */}
              <div className="flex flex-col justify-between text-right pr-2 text-[11px] text-gray-400 font-medium select-none w-5 leading-none">
                {ticks.map((tick) => (
                  <span key={tick}>{tick}</span>
                ))}
              </div>

              {/* Gridlines and Bars container */}
              <div className="relative flex-1 h-full">
                {/* Horizontal gridlines aligned with ticks */}
                <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
                  {ticks.map((_, idx) => (
                    <div
                      key={idx}
                      className={cn(
                        'w-full border-t',
                        idx === ticks.length - 1 ? 'border-gray-200' : 'border-gray-100'
                      )}
                    />
                  ))}
                </div>

                {/* 4 Colored Bars standing on baseline */}
                <div className="relative z-10 h-full flex items-end justify-between px-3">
                  {/* Bar 1: Accr (Cyan Gradient) */}
                  <div
                    className="flex flex-col items-center justify-end h-full flex-1 max-w-[28px] group"
                    title={`Accrued: ${accrued} days`}
                  >
                    <div
                      className="w-full bg-gradient-to-t from-[#2096B4] to-[#38B7D5] rounded-t-md transition-all duration-500 shadow-2xs group-hover:brightness-105"
                      style={{ height: `${Math.min(100, Math.max(4, (accrued / maxScale) * 100))}%` }}
                    />
                  </div>

                  {/* Bar 2: Ust (Used - Teal/Blue Gradient) */}
                  <div
                    className="flex flex-col items-center justify-end h-full flex-1 max-w-[28px] group"
                    title={`Used: ${used} days`}
                  >
                    <div
                      className="w-full bg-gradient-to-t from-[#166477] to-[#1E7D94] rounded-t-md transition-all duration-500 shadow-2xs group-hover:brightness-105"
                      style={{ height: `${Math.min(100, Math.max(4, (used / maxScale) * 100))}%` }}
                    />
                  </div>

                  {/* Bar 3: Red (Reserved / Total - Dark Navy Gradient) */}
                  <div
                    className="flex flex-col items-center justify-end h-full flex-1 max-w-[28px] group"
                    title={`Total Entitlement: ${requested} days`}
                  >
                    <div
                      className="w-full bg-gradient-to-t from-[#0F1E30] to-[#1B3A5A] rounded-t-md transition-all duration-500 shadow-2xs group-hover:brightness-105"
                      style={{ height: `${Math.min(100, Math.max(4, (requested / maxScale) * 100))}%` }}
                    />
                  </div>

                  {/* Bar 4: Rem (Remaining - Warm Orange Gradient) */}
                  <div
                    className="flex flex-col items-center justify-end h-full flex-1 max-w-[28px] group"
                    title={`Remaining: ${remaining} days`}
                  >
                    <div
                      className="w-full bg-gradient-to-t from-[#E28A25] to-[#F4A340] rounded-t-md transition-all duration-500 shadow-2xs group-hover:brightness-105"
                      style={{ height: `${Math.min(100, Math.max(4, (remaining / maxScale) * 100))}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* X-Axis Bar Labels underneath baseline */}
            <div className="flex items-center pl-7 pr-3 pt-2 text-[11px] text-gray-500 font-medium">
              <span className="flex-1 text-center">Accr</span>
              <span className="flex-1 text-center">Ust</span>
              <span className="flex-1 text-center">Red</span>
              <span className="flex-1 text-center">Rem</span>
            </div>
          </div>

          {/* Donut Chart Visualization (5 cols) */}
          <div className="sm:col-span-5 flex items-center justify-center relative">
            <svg className="w-28 h-28 sm:w-32 sm:h-32 transform -rotate-90" viewBox="0 0 100 100">
              {/* Background ring */}
              <circle
                cx="50"
                cy="50"
                r={radius}
                className="text-gray-100"
                strokeWidth="13"
                stroke="currentColor"
                fill="transparent"
              />

              {/* Used segment (Teal) */}
              <circle
                cx="50"
                cy="50"
                r={radius}
                className="text-[#2FA7C4] transition-all duration-500"
                strokeWidth="13"
                strokeDasharray={`${usedStroke} ${circumference}`}
                strokeDashoffset="0"
                stroke="currentColor"
                fill="transparent"
              />

              {/* Remaining segment (Orange) */}
              <circle
                cx="50"
                cy="50"
                r={radius}
                className="text-brand-orange transition-all duration-500"
                strokeWidth="13"
                strokeDasharray={`${remainingStroke} ${circumference}`}
                strokeDashoffset={`-${usedStroke}`}
                stroke="currentColor"
                fill="transparent"
              />
            </svg>

            {/* Inner Center Label */}
            <div className="absolute inset-0 flex flex-col items-center justify-center select-none pointer-events-none">
              <span className="text-2xl font-black text-navy-900 leading-none">{remaining}</span>
              <span className="text-[10px] uppercase font-bold tracking-wider text-gray-400 mt-0.5">Days Left</span>
            </div>
          </div>
        </div>

        {/* Legend matching mockup */}
        <div className="mt-4 pt-3 border-t border-gray-100 flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-1.5 font-medium text-gray-700">
            <span className="w-2.5 h-2.5 rounded-full bg-brand-cyan flex-shrink-0" />
            <span>Accrued: <strong className="text-navy-900">{accrued} days</strong></span>
          </div>

          <div className="flex items-center gap-1.5 font-medium text-gray-700">
            <span className="w-2.5 h-2.5 rounded-full bg-[#1E7D94] flex-shrink-0" />
            <span>Used: <strong className="text-navy-900">{used} days</strong></span>
          </div>

          <div className="flex items-center gap-1.5 font-medium text-gray-700">
            <span className="w-2.5 h-2.5 rounded-full bg-brand-orange flex-shrink-0" />
            <span>Remaining: <strong className="text-navy-900">{remaining} days</strong></span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

