import React, { ReactNode } from 'react';
import { Card } from '../../ui/Card';
import { cn } from '../../../utils/cn';

interface StatMetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: ReactNode;
  iconBg?: string;
  className?: string;
}

export const StatMetricCard: React.FC<StatMetricCardProps> = ({
  title,
  value,
  subtitle,
  icon,
  iconBg = 'bg-brand-lightTeal text-brand-darkTeal',
  className,
}) => {
  return (
    <Card className={cn('p-5 flex items-center justify-between', className)}>
      <div>
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{title}</p>
        <h3 className="text-2xl font-black text-navy-900 mt-1 font-sans">{value}</h3>
        {subtitle && <p className="text-[11px] text-gray-400 mt-0.5">{subtitle}</p>}
      </div>

      <div className={cn('w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-xs', iconBg)}>
        {icon}
      </div>
    </Card>
  );
};
