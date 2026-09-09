import React, { HTMLAttributes } from 'react';
import { Info, AlertTriangle, CheckCircle, AlertCircle } from 'lucide-react';
import { cn } from '../../utils/cn';

export interface AlertProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'info' | 'warning' | 'success' | 'danger';
  title?: string;
}

export const Alert: React.FC<AlertProps> = ({
  className,
  variant = 'info',
  title,
  children,
  ...props
}) => {
  const configs = {
    info: {
      bg: 'bg-sky-50/80 border-sky-200 text-sky-900',
      icon: <Info className="w-5 h-5 text-sky-600 flex-shrink-0" />,
    },
    warning: {
      bg: 'bg-amber-50/80 border-amber-200 text-amber-900',
      icon: <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0" />,
    },
    success: {
      bg: 'bg-emerald-50/80 border-emerald-200 text-emerald-900',
      icon: <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0" />,
    },
    danger: {
      bg: 'bg-rose-50/80 border-rose-200 text-rose-900',
      icon: <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0" />,
    },
  };

  const { bg, icon } = configs[variant];

  return (
    <div
      className={cn('flex items-start gap-3 p-4 rounded-xl border text-sm', bg, className)}
      role="alert"
      {...props}
    >
      {icon}
      <div className="flex-1">
        {title && <h4 className="font-semibold mb-0.5 text-inherit">{title}</h4>}
        <div className="text-xs leading-relaxed opacity-90">{children}</div>
      </div>
    </div>
  );
};
