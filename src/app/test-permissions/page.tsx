'use client';

import React from 'react';
import Link from 'next/link';
import { useAuth } from '../../components/AuthProvider';
import { ProtectedRoute } from '../../components/ProtectedRoute';
import { UserRole } from '../../types';

function PermissionTestContent() {
  const { user } = useAuth();

  const testPermissions = async (resource: string, action: string) => {
    try {
      const response = await fetch(`/api/test-permissions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('authToken')}`,
        },
        body: JSON.stringify({ resource, action }),
      });

      const result = await response.json();
      alert(`${resource} ${action}: ${result.allowed ? '允许' : '拒绝'}`);
    } catch (error) {
      alert('测试失败: ' + error);
    }
  };

  return (
    <div className='min-h-screen bg-gray-50 py-8'>
      <div className='max-w-4xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='bg-white rounded-lg shadow-md p-6'>
          <h1 className='text-2xl font-bold text-gray-900 mb-6'>
            权限测试页面
          </h1>

          <div className='mb-6'>
            <h2 className='text-lg font-semibold text-gray-900 mb-3'>
              当前用户信息
            </h2>
            <div className='bg-gray-50 rounded-md p-4'>
              <p>
                <strong>邮箱:</strong> {user?.email}
              </p>
              <p>
                <strong>角色:</strong> {user?.role}
              </p>
              <p>
                <strong>学生ID:</strong> {user?.studentId || '无'}
              </p>
            </div>
          </div>

          <div className='mb-6'>
            <h2 className='text-lg font-semibold text-gray-900 mb-3'>
              权限测试
            </h2>
            <div className='grid grid-cols-2 md:grid-cols-3 gap-4'>
              <button
                onClick={() => testPermissions('applications', 'read')}
                className='px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700'
              >
                测试: 读取申请
              </button>

              <button
                onClick={() => testPermissions('applications', 'create')}
                className='px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700'
              >
                测试: 创建申请
              </button>

              <button
                onClick={() => testPermissions('applications', 'update')}
                className='px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700'
              >
                测试: 更新申请
              </button>

              <button
                onClick={() => testPermissions('applications', 'delete')}
                className='px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700'
              >
                测试: 删除申请
              </button>

              <button
                onClick={() => testPermissions('parentNotes', 'create')}
                className='px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700'
              >
                测试: 创建备注
              </button>

              <button
                onClick={() => testPermissions('profile', 'read')}
                className='px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700'
              >
                测试: 读取资料
              </button>
            </div>
          </div>

          <div className='mb-6'>
            <h2 className='text-lg font-semibold text-gray-900 mb-3'>
              角色权限说明
            </h2>
            <div className='space-y-3'>
              <div className='border-l-4 border-blue-500 pl-4'>
                <h3 className='font-medium text-gray-900'>学生 (STUDENT)</h3>
                <p className='text-sm text-gray-600'>
                  可以创建、读取、更新、删除自己的申请，管理个人资料
                </p>
              </div>

              <div className='border-l-4 border-green-500 pl-4'>
                <h3 className='font-medium text-gray-900'>家长 (PARENT)</h3>
                <p className='text-sm text-gray-600'>
                  可以读取申请，创建、读取、更新、删除自己的备注
                </p>
              </div>

              {/* 暂时注释掉老师和管理员角色
              <div className='border-l-4 border-purple-500 pl-4'>
                <h3 className='font-medium text-gray-900'>老师 (TEACHER)</h3>
                <p className='text-sm text-gray-600'>
                  可以读取、更新申请，读取、更新学生信息
                </p>
              </div>

              <div className='border-l-4 border-red-500 pl-4'>
                <h3 className='font-medium text-gray-900'>管理员 (ADMIN)</h3>
                <p className='text-sm text-gray-600'>
                  拥有所有权限，可以访问系统的所有功能
                </p>
              </div>
              */}
            </div>
          </div>

          <div className='text-center'>
            <Link
              href='/'
              className='inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50'
            >
              返回主页
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PermissionTestPage() {
  return (
    <ProtectedRoute>
      <PermissionTestContent />
    </ProtectedRoute>
  );
}
