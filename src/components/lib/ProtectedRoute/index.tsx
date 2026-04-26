import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import type { RootState } from '@/store';
import type { ReactElement } from 'react';

interface ProtectedRouteProps {
  children: ReactElement;
  allowedRoles?: Array<'USER' | 'STAFF' | 'ADMIN' | 'SUPER_ADMIN'>;
}

export const ProtectedRoute = ({ children, allowedRoles }: ProtectedRouteProps) => {
  const { isAuthenticated, role } = useSelector((state: RootState) => state.auth);
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && role && !allowedRoles.includes(role)) {
    // User is logged in but doesn't have the right role
    return <Navigate to="/" replace />;
  }

  return children;
};
