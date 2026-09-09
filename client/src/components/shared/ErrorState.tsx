import React from 'react';
import { AlertTriangle, RotateCcw } from 'lucide-react';
import { Button } from '../ui/Button';

interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
  className?: string;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  message = 'Failed to load data from server.',
  onRetry,
  className,
}) => {
  return (
    <div className={`p-8 text-center bg-rose-50/50 rounded-2xl border border-rose-100 ${className || ''}`}>
      <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center mx-auto mb-3">
        <AlertTriangle className="w-5 h-5" />
      </div>
      <h3 className="text-sm font-bold text-rose-950 mb-1">Something went wrong</h3>
      <p className="text-xs text-rose-700 max-w-sm mx-auto mb-4">{message}</p>
      {onRetry && (
        <Button
          size="sm"
          variant="outline"
          leftIcon={<RotateCcw className="w-3.5 h-3.5" />}
          onClick={onRetry}
        >
          Try Again
        </Button>
      )}
    </div>
  );
};
