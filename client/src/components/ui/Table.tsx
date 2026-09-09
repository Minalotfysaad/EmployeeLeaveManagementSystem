import React, { HTMLAttributes, ThHTMLAttributes, TdHTMLAttributes } from 'react';
import { cn } from '../../utils/cn';

export const Table: React.FC<HTMLAttributes<HTMLTableElement>> = ({ className, ...props }) => (
  <div className="w-full overflow-x-auto">
    <table className={cn('w-full text-left text-sm text-gray-700', className)} {...props} />
  </div>
);

export const TableHead: React.FC<HTMLAttributes<HTMLTableSectionElement>> = ({ className, ...props }) => (
  <thead className={cn('bg-[#F8FAFC] text-gray-600 font-semibold border-b border-[#E5EAF0] text-xs', className)} {...props} />
);

export const TableBody: React.FC<HTMLAttributes<HTMLTableSectionElement>> = ({ className, ...props }) => (
  <tbody className={cn('divide-y divide-[#F1F5F9] bg-white', className)} {...props} />
);

export const TableRow: React.FC<HTMLAttributes<HTMLTableRowElement>> = ({ className, ...props }) => (
  <tr className={cn('hover:bg-[#F9FBFC] transition-colors', className)} {...props} />
);

export const TableHeaderCell: React.FC<ThHTMLAttributes<HTMLTableCellElement>> = ({ className, ...props }) => (
  <th className={cn('py-3.5 px-4 font-semibold text-xs text-gray-500 uppercase tracking-wider', className)} {...props} />
);

export const TableCell: React.FC<TdHTMLAttributes<HTMLTableCellElement>> = ({ className, ...props }) => (
  <td className={cn('py-3.5 px-4 text-sm text-gray-800 align-middle', className)} {...props} />
);
