import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '../ui/Button';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalCount: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  className?: string;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  totalCount,
  pageSize,
  onPageChange,
  className,
}) => {
  if (totalCount === 0) return null;

  const start = (currentPage - 1) * pageSize + 1;
  const end = Math.min(currentPage * pageSize, totalCount);

  return (
    <div
      className={`flex flex-col sm:flex-row items-center justify-between gap-3 px-4 py-3 bg-white border-t border-[#E5EAF0] text-xs text-gray-500 rounded-b-2xl ${
        className || ''
      }`}
    >
      <div>
        Showing <span className="font-semibold text-gray-800">{start}</span> to{' '}
        <span className="font-semibold text-gray-800">{end}</span> of{' '}
        <span className="font-semibold text-gray-800">{totalCount}</span> entries
      </div>

      <div className="flex items-center gap-1.5">
        <Button
          size="xs"
          variant="outline"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1}
          leftIcon={<ChevronLeft className="w-3.5 h-3.5" />}
        >
          Previous
        </Button>

        <span className="px-2 py-1 text-xs font-semibold text-gray-700 bg-gray-50 rounded-lg border border-gray-200">
          {currentPage} / {totalPages || 1}
        </span>

        <Button
          size="xs"
          variant="outline"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
          rightIcon={<ChevronRight className="w-3.5 h-3.5" />}
        >
          Next
        </Button>
      </div>
    </div>
  );
};
