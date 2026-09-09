import React from 'react';
import { RequestStatus, RequestStatusLabels } from '../../types/leaveRequest.types';
import { Badge, BadgeProps } from '../ui/Badge';

interface StatusBadgeProps {
  status: RequestStatus | number;
  className?: string;
  size?: 'sm' | 'md';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, className, size = 'md' }) => {
  const label = RequestStatusLabels[status as RequestStatus] || 'Unknown';

  const badgeConfig: Record<RequestStatus, { variant: BadgeProps['variant'] }> = {
    [RequestStatus.Pending]: { variant: 'orange' },
    [RequestStatus.Cancelled]: { variant: 'slate' },
    [RequestStatus.RejectedByManager]: { variant: 'rose' },
    [RequestStatus.ManagerApproved]: { variant: 'sky' },
    [RequestStatus.RejectedByHR]: { variant: 'rose' },
    [RequestStatus.HRApproved]: { variant: 'green' },
  };

  const config = badgeConfig[status as RequestStatus] || { variant: 'slate' };

  return (
    <Badge variant={config.variant} size={size} dot className={className}>
      {label}
    </Badge>
  );
};
