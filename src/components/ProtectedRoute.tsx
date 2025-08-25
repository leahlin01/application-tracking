'use client';

import React from 'react';
import { useAuth } from './AuthProvider';
import { UserRole } from '../types';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
  redirectTo?: string;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  allowedRoles,
  redirectTo = '/welcome',
}) => {
  const { user, loading } = useAuth();

  // 如果正在加载，显示加载状态
  if (loading) {
    return (
      <div className='min-h-screen bg-gray-50 flex items-center justify-center'>
        <div className='text-center'>
          <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto'></div>
          <p className='mt-4 text-gray-600'>Loading...</p>
        </div>
      </div>
    );
  }

  // 如果用户未登录，重定向到登录页面
  if (!user) {
    if (typeof window !== 'undefined') {
      window.location.href = redirectTo;
    }
    return null;
  }

  // 如果指定了允许的角色，检查用户角色
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return (
      <div className='min-h-screen bg-gray-50 flex items-center justify-center'>
        <div className='text-center'>
          <h1 className='text-2xl font-bold text-gray-900 mb-4'>
            Access Denied
          </h1>
          <p className='text-gray-600 mb-4'>
            You don&apos;t have permission to access this page.
          </p>
          <button
            onClick={() => (window.location.href = '/')}
            className='bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700'
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  // 用户已认证且有权限，显示内容
  return <>{children}</>;
};
