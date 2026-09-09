import React, { ButtonHTMLAttributes, forwardRef } from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '../../utils/cn';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'navy' | 'orange';
  size?: 'xs' | 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      isLoading = false,
      leftIcon,
      rightIcon,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      'inline-flex items-center justify-center font-medium rounded-xl transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-55 disabled:cursor-not-allowed disabled:pointer-events-none select-none';

    const variants = {
      primary:
        'bg-brand-teal hover:bg-brand-darkTeal text-white shadow-sm hover:shadow focus:ring-brand-teal/40',
      navy:
        'bg-navy-900 hover:bg-navy-800 text-white shadow-sm hover:shadow focus:ring-navy-900/40',
      orange:
        'bg-brand-orange hover:bg-brand-lightOrange text-navy-950 font-semibold shadow-sm focus:ring-brand-orange/40',
      secondary:
        'bg-gray-100 hover:bg-gray-200 text-gray-800 focus:ring-gray-300',
      outline:
        'border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 hover:text-gray-900 focus:ring-gray-300',
      ghost:
        'bg-transparent hover:bg-gray-100 text-gray-700 hover:text-gray-900 focus:ring-gray-200',
      danger:
        'bg-rose-600 hover:bg-rose-700 text-white shadow-sm focus:ring-rose-500/40',
    };

    const sizes = {
      xs: 'px-2.5 py-1 text-xs gap-1.5',
      sm: 'px-3 py-1.5 text-xs font-semibold gap-1.5',
      md: 'px-4 py-2 text-sm gap-2',
      lg: 'px-5 py-2.5 text-base gap-2.5',
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      >
        {isLoading ? (
          <Loader2 className="w-4 h-4 animate-spin text-current" />
        ) : (
          leftIcon && <span className="flex-shrink-0">{leftIcon}</span>
        )}
        <span>{children}</span>
        {!isLoading && rightIcon && <span className="flex-shrink-0">{rightIcon}</span>}
      </button>
    );
  }
);

Button.displayName = 'Button';
