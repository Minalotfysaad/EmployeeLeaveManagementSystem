import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../../ui/Card';
import { BalanceDto } from '../../../types/balance.types';

interface LeaveBalanceCardProps {
  balances?: BalanceDto[];
}

export const LeaveBalanceCard: React.FC<LeaveBalanceCardProps> = ({ balances = [] }) => {
  // Find annual leave or calculate aggregate
  const annualBalance = balances.find((b) => b.leaveType.toLowerCase().includes('annual')) || balances[0];

  // Default values matching the mockup: 22 accrued, 12 used, 10 remaining
  const accrued = 22;
  const remaining = annualBalance ? annualBalance.remainingDays : 10;
  const used = Math.max(0, accrued - remaining);

  const usedPercentage = Math.round((used / accrued) * 100);
  const remainingPercentage = 100 - usedPercentage;

  // Donut chart calculations
  const radius = 38;
  const circumference = 2 * Math.PI * radius;
  const usedStroke = (usedPercentage / 100) * circumference;
  const remainingStroke = (remainingPercentage / 100) * circumference;

  return (
    <Card className="flex flex-col h-full">
      <CardHeader className="border-b-0 pb-0">
        <CardTitle>My Leave Balance</CardTitle>
        <span className="text-xs font-semibold text-brand-darkTeal bg-brand-lightTeal px-2.5 py-0.5 rounded-full">
          Annual Leave
        </span>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col justify-between pt-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-center">
          {/* Bar Chart Visualization */}
          <div className="flex flex-col justify-end h-36 pt-4">
            <div className="flex items-end justify-between gap-3 h-28 border-b border-gray-100 pb-1 px-2">
              {/* Accrued Bar */}
              <div className="flex flex-col items-center flex-1 gap-1.5 h-full justify-end">
                <span className="text-[11px] font-bold text-gray-700">{accrued}</span>
                <div
                  className="w-full max-w-[28px] bg-brand-cyan rounded-t-md transition-all duration-500"
                  style={{ height: '90%' }}
                />
                <span className="text-[10px] text-gray-400 font-medium">Accr</span>
              </div>

              {/* Used Bar */}
              <div className="flex flex-col items-center flex-1 gap-1.5 h-full justify-end">
                <span className="text-[11px] font-bold text-gray-700">{used}</span>
                <div
                  className="w-full max-w-[28px] bg-[#1E7D94] rounded-t-md transition-all duration-500"
                  style={{ height: `${(used / accrued) * 90}%` }}
                />
                <span className="text-[10px] text-gray-400 font-medium">Used</span>
              </div>

              {/* Remaining Bar */}
              <div className="flex flex-col items-center flex-1 gap-1.5 h-full justify-end">
                <span className="text-[11px] font-bold text-gray-700">{remaining}</span>
                <div
                  className="w-full max-w-[28px] bg-brand-orange rounded-t-md transition-all duration-500"
                  style={{ height: `${(remaining / accrued) * 90}%` }}
                />
                <span className="text-[10px] text-gray-400 font-medium">Rem</span>
              </div>
            </div>
          </div>

          {/* Donut Chart Visualization */}
          <div className="flex items-center justify-center relative">
            <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 100 100">
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
            <div className="absolute inset-0 flex flex-col items-center justify-center select-none">
              <span className="text-2xl font-black text-navy-900 leading-none">{remaining}</span>
              <span className="text-[10px] uppercase font-bold tracking-wider text-gray-400 mt-0.5">Days Left</span>
            </div>
          </div>
        </div>

        {/* Legend matching mockup */}
        <div className="mt-5 pt-3 border-t border-gray-100 flex flex-wrap items-center justify-between gap-3 text-xs">
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
