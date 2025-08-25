'use client';

import React from 'react';
import { useAuth } from './AuthProvider';
import { UserRole } from '../types';

export const Navigation: React.FC = () => {
  const { user, logout } = useAuth();

  if (!user) return null;

  const getRoleDisplayName = (role: UserRole) => {
    switch (role) {
      case UserRole.STUDENT:
        return '学生';
      case UserRole.PARENT:
        return '家长';
      // case UserRole.TEACHER:
      //   return '老师';
      // case UserRole.ADMIN:
      //   return '管理员';
      default:
        return role;
    }
  };

  return (
    <nav className='bg-white shadow-sm border-b'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='flex justify-between items-center h-16'>
          <div className='flex items-center'>
            <h1 className='text-xl font-semibold text-gray-900'>
              大学申请管理平台
            </h1>
          </div>
          <div className='flex items-center space-x-4'>
            <span className='text-sm text-gray-600'>
              欢迎, {user.email} ({getRoleDisplayName(user.role)})
            </span>
            <button
              onClick={logout}
              className='px-3 py-2 text-sm bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors'
            >
              退出登录
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};
