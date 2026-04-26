import React from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '@/store';

interface RoleBasedRenderProps {
  children: React.ReactNode;
  allowedRoles: Array<'USER' | 'STAFF' | 'ADMIN' | 'SUPER_ADMIN'>;
  fallback?: React.ReactNode;
}

export const RoleBasedRender = ({ children, allowedRoles, fallback = null }: RoleBasedRenderProps) => {
  const { role } = useSelector((state: RootState) => state.auth);

  if (role && allowedRoles.includes(role)) {
    return <>{children}</>;
  }

  return <>{fallback}</>;
};
