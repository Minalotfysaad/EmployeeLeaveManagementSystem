import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../hooks/useToast';

interface RoleRouteProps {
  allowedRoles: ('Employee' | 'Manager' | 'HR')[];
}

export const RoleRoute: React.FC<RoleRouteProps> = ({ allowedRoles }) => {
  const { user } = useAuth();
  const { warning } = useToast();

  const userRoles = user?.roles || [];
  const hasAccess = allowedRoles.some((role) => userRoles.includes(role));

  if (!hasAccess) {
    warning('You do not have administrative permissions to view this section.');
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
};
