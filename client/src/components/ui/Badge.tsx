import React from 'react';
import { cn } from '../../utils/cn';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'teal' | 'orange' | 'green' | 'rose' | 'slate' | 'sky' | 'purple';
  size?: 'sm' | 'md';
  dot?: boolean;
}

export const Badge: React.FC<BadgeProps> = ({
  className,
  variant = 'slate',
  size = 'md',
  dot = false,
  children,
  ...props
}) => {
  const variants = {
    teal: 'bg-[#EBF7FA] text-[#19758C] border-[#BBE7F0]',
    orange: 'bg-[#FFF7ED] text-[#C26700] border-[#FED7AA]',
    green: 'bg-[#ECFDF5] text-[#047857] border-[#A7F3D0]',
    rose: 'bg-[#FFF1F2] text-[#BE123C] border-[#FECDD3]',
    slate: 'bg-[#F1F5F9] text-[#475569] border-[#E2E8F0]',
    sky: 'bg-[#F0F9FF] text-[#0369A1] border-[#BAE6FD]',
    purple: 'bg-[#FAF5FF] text-[#7E22CE] border-[#E9D5FF]',
  };

  const dotColors = {
    teal: 'bg-[#2FA7C4]',
    orange: 'bg-[#F4A340]',
    green: 'bg-[#10B981]',
    rose: 'bg-[#F43F5E]',
    slate: 'bg-[#64748B]',
    sky: 'bg-[#0284C7]',
    purple: 'bg-[#A855F7]',
  };

  const sizes = {
    sm: 'px-2 py-0.5 text-[11px]',
    md: 'px-2.5 py-1 text-xs',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 font-medium rounded-full border leading-none select-none tracking-tight',
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {dot && <span className={cn('w-1.5 h-1.5 rounded-full flex-shrink-0', dotColors[variant])} />}
      {children}
    </span>
  );
};
