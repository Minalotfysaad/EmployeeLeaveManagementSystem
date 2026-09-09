import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { PlusCircle, Info, Calendar, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { PageHeader } from '../../components/shared/PageHeader';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Skeleton } from '../../components/ui/Skeleton';
import { Alert } from '../../components/ui/Alert';
import { CreateLeaveRequestModal } from '../../components/features/requests/CreateLeaveRequestModal';
import { balancesApi } from '../../api/balances.api';
import { leaveTypesApi } from '../../api/leaveTypes.api';
import { useAuth } from '../../hooks/useAuth';

export const LeaveBalancePage: React.FC = () => {
  const { user } = useAuth();
  const [requestModalOpen, setRequestModalOpen] = useState(false);

  // Fetch balances
  const { data: balances = [], isLoading: loadingBalances } = useQuery({
    queryKey: ['myBalances', user?.id],
    queryFn: () => balancesApi.getMyBalances(user?.id),
  });

  // Fetch leave types for total default days
  const { data: leaveTypesData } = useQuery({
    queryKey: ['leaveTypes'],
    queryFn: () => leaveTypesApi.getLeaveTypes(),
  });

  const leaveTypes = leaveTypesData?.items || [];

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      <PageHeader
        title="Leave Balances"
        subtitle="Review your accrued, used, and remaining time off allocations across all leave categories."
        actions={
          <Button
            variant="primary"
            leftIcon={<PlusCircle className="w-4 h-4" />}
            onClick={() => setRequestModalOpen(true)}
          >
            Request Leave
          </Button>
        }
      />

      {/* Balance Cards Grid */}
      {loadingBalances ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-56 w-full rounded-2xl" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {balances.map((balance) => {
            const leaveTypeInfo = leaveTypes.find((lt) => lt.name === balance.leaveType);
            const totalAccrued = leaveTypeInfo ? leaveTypeInfo.defaultDays : 20;
            const remaining = balance.remainingDays;
            const used = Math.max(0, totalAccrued - remaining);
            const percentageUsed = Math.min(100, Math.round((used / totalAccrued) * 100));

            return (
              <Card key={balance.leaveTypeId} className="flex flex-col justify-between overflow-hidden">
                <CardHeader className="bg-[#F8FAFC]">
                  <div>
                    <CardTitle className="text-base">{balance.leaveType}</CardTitle>
                    <span className="text-xs text-gray-500">Yearly Allowance</span>
                  </div>
                  <div className="text-right">
                    <span className="text-2xl font-black text-navy-900 leading-none">{remaining}</span>
                    <span className="text-[10px] text-gray-400 block uppercase font-bold tracking-wider">
                      Days Left
                    </span>
                  </div>
                </CardHeader>

                <CardContent className="space-y-5 pt-5">
                  {/* Progress Bar */}
                  <div>
                    <div className="flex items-center justify-between text-xs mb-2">
                      <span className="text-gray-500 font-medium">Usage Progress</span>
                      <span className="font-bold text-navy-900">{percentageUsed}% used</span>
                    </div>

                    <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden p-0.5">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-brand-teal to-brand-cyan transition-all duration-700"
                        style={{ width: `${percentageUsed}%` }}
                      />
                    </div>
                  </div>

                  {/* Accrued vs Used Breakdown */}
                  <div className="grid grid-cols-3 gap-2 pt-2 border-t border-gray-100 text-center">
                    <div className="p-2 bg-gray-50 rounded-xl">
                      <span className="text-[10px] uppercase tracking-wider text-gray-400 font-bold block">
                        Accrued
                      </span>
                      <span className="text-sm font-bold text-gray-800">{totalAccrued}d</span>
                    </div>

                    <div className="p-2 bg-gray-50 rounded-xl">
                      <span className="text-[10px] uppercase tracking-wider text-gray-400 font-bold block">
                        Used
                      </span>
                      <span className="text-sm font-bold text-gray-800">{used}d</span>
                    </div>

                    <div className="p-2 bg-brand-lightTeal rounded-xl">
                      <span className="text-[10px] uppercase tracking-wider text-brand-darkTeal font-bold block">
                        Remaining
                      </span>
                      <span className="text-sm font-bold text-brand-darkTeal">{remaining}d</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Organization Policy Notice */}
      <Card className="p-6">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-2xl bg-brand-lightTeal text-brand-teal flex items-center justify-center flex-shrink-0">
            <Info className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-navy-900 tracking-tight">
              Company Leave Policy & Accruals
            </h3>
            <p className="text-xs sm:text-sm text-gray-500 mt-1 leading-relaxed">
              Standard annual leave allowances reset at the start of every calendar year. A maximum of 5 unused
              annual leave days can be carried forward into Q1 with HR approval. Sick leave requires medical
              documentation for periods exceeding 3 consecutive days.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-5 pt-5 border-t border-gray-100 text-xs">
              <div className="flex items-center gap-2 text-gray-700">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>Annual Leave: 22 working days</span>
              </div>
              <div className="flex items-center gap-2 text-gray-700">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>Paid Sick Leave: 10 working days</span>
              </div>
              <div className="flex items-center gap-2 text-gray-700">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>Emergency Time-off: 5 working days</span>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Request Modal */}
      <CreateLeaveRequestModal
        isOpen={requestModalOpen}
        onClose={() => setRequestModalOpen(false)}
      />
    </div>
  );
};
