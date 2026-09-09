import React, { SelectHTMLAttributes, forwardRef } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '../../utils/cn';

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  helperText?: string;
  error?: string;
  options?: SelectOption[];
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, helperText, error, options, children, id, ...props }, ref) => {
    const selectId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className="w-full flex flex-col gap-1.5">
        {label && (
          <label htmlFor={selectId} className="text-xs font-semibold text-gray-700 select-none">
            {label}
            {props.required && <span className="text-rose-500 ml-0.5">*</span>}
          </label>
        )}

        <div className="relative flex items-center group">
          <select
            id={selectId}
            ref={ref}
            className={cn(
              'w-full bg-[#FBFBFC] hover:bg-white text-gray-800 text-sm rounded-xl border border-gray-200/90 hover:border-gray-300 py-2.5 pl-3.5 pr-10 transition-all duration-150 appearance-none cursor-pointer shadow-2xs font-medium',
              'focus:outline-none focus:bg-white focus:border-brand-teal focus:ring-4 focus:ring-brand-teal/10',
              'disabled:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed',
              error && 'border-rose-400 focus:border-rose-500 focus:ring-rose-500/15',
              className
            )}
            {...props}
          >
            {options
              ? options.map((opt) => (
                  <option key={opt.value} value={opt.value} disabled={opt.disabled} className="py-2 text-gray-800 bg-white">
                    {opt.label}
                  </option>
                ))
              : children}
          </select>

          <div className="absolute right-3.5 flex items-center pointer-events-none text-gray-400 group-hover:text-gray-600 transition-colors">
            <ChevronDown className="w-4 h-4 transition-transform duration-150" />
          </div>
        </div>

        {error ? (
          <p className="text-xs text-rose-600 font-medium">{error}</p>
        ) : helperText ? (
          <p className="text-xs text-gray-500">{helperText}</p>
        ) : null}
      </div>
    );
  }
);

Select.displayName = 'Select';
