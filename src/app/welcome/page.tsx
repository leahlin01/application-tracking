'use client';

import React from 'react';
import Link from 'next/link';
import { useAuth } from '../../components/AuthProvider';

export default function WelcomePage() {
  const { user } = useAuth();

  // 如果用户已登录，重定向到主页
  if (user) {
    if (typeof window !== 'undefined') {
      window.location.href = '/';
    }
    return null;
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12'>
        <div className='text-center'>
          <h1 className='text-4xl font-bold text-gray-900 mb-6'>
            欢迎使用大学申请管理平台
          </h1>
          <p className='text-xl text-gray-600 mb-8 max-w-3xl mx-auto'>
            这是一个专业的大学申请跟踪系统，帮助学生、家长和老师更好地管理大学申请流程。
            通过基于角色的访问控制，确保每个用户都能安全地访问相应的功能。
          </p>

          <div className='grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12 max-w-4xl mx-auto'>
            <div className='bg-white rounded-lg shadow-md p-6'>
              <div className='w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4'>
                <svg
                  className='w-6 h-6 text-blue-600'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 5.477 5.754 5 7.5 5s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 19 16.5 19c-1.746 0-3.332-.523-4.5-1.253'
                  />
                </svg>
              </div>
              <h3 className='text-lg font-semibold text-gray-900 mb-2'>学生</h3>
              <p className='text-gray-600 text-sm'>
                管理你的大学申请，跟踪进度，设置提醒
              </p>
            </div>

            <div className='bg-white rounded-lg shadow-md p-6'>
              <div className='w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4'>
                <svg
                  className='w-6 h-6 text-green-600'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z'
                  />
                </svg>
              </div>
              <h3 className='text-lg font-semibold text-gray-900 mb-2'>家长</h3>
              <p className='text-gray-600 text-sm'>
                查看孩子的申请进度，添加备注和建议
              </p>
            </div>

            {/* 暂时注释掉老师和管理员角色
            <div className='bg-white rounded-lg shadow-md p-6'>
              <div className='w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4'>
                <svg
                  className='w-6 h-6 text-purple-600'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16'
                  />
                </svg>
              </div>
              <h3 className='text-lg font-semibold text-gray-900 mb-2'>老师</h3>
              <p className='text-gray-600 text-sm'>
                指导学生申请，查看进度，提供建议
              </p>
            </div>

            <div className='bg-white rounded-lg shadow-md p-6'>
              <div className='w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mx-auto mb-4'>
                <svg
                  className='w-6 h-6 text-red-600'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z'
                  />
                </svg>
              </div>
              <h3 className='text-lg font-semibold text-gray-900 mb-2'>
                管理员
              </h3>
              <p className='text-gray-600 text-sm'>
                系统管理，用户管理，数据维护
              </p>
            </div>
            */}
          </div>

          <div className='space-y-4'>
            <div className='flex flex-col sm:flex-row gap-4 justify-center'>
              <Link
                href='/role-selection'
                className='inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors'
              >
                开始注册
              </Link>
              <Link
                href='/auth'
                className='inline-flex items-center justify-center px-8 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors'
              >
                立即登录
              </Link>
              <button
                onClick={() => {
                  // 滚动到功能介绍
                  document
                    .getElementById('features')
                    ?.scrollIntoView({ behavior: 'smooth' });
                }}
                className='inline-flex items-center justify-center px-8 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors'
              >
                了解更多
              </button>
            </div>
          </div>
        </div>

        <div id='features' className='mt-20'>
          <h2 className='text-3xl font-bold text-gray-900 text-center mb-12'>
            系统特性
          </h2>

          <div className='grid md:grid-cols-2 lg:grid-cols-3 gap-8'>
            <div className='bg-white rounded-lg shadow-md p-6'>
              <h3 className='text-lg font-semibold text-gray-900 mb-3'>
                基于角色的访问控制
              </h3>
              <p className='text-gray-600'>
                不同角色拥有不同的权限，确保数据安全和隐私保护。学生只能访问自己的申请，家长可以查看但不能修改，老师可以指导但不能删除。
              </p>
            </div>

            <div className='bg-white rounded-lg shadow-md p-6'>
              <h3 className='text-lg font-semibold text-gray-900 mb-3'>
                实时进度跟踪
              </h3>
              <p className='text-gray-600'>
                实时跟踪申请状态，设置截止日期提醒，确保不会错过重要的申请时间节点。
              </p>
            </div>

            <div className='bg-white rounded-lg shadow-md p-6'>
              <h3 className='text-lg font-semibold text-gray-900 mb-3'>
                协作功能
              </h3>
              <p className='text-gray-600'>
                家长可以为申请添加备注，老师可以提供指导建议，学生可以分享申请进度，实现多方协作。
              </p>
            </div>

            <div className='bg-white rounded-lg shadow-md p-6'>
              <h3 className='text-lg font-semibold text-gray-900 mb-3'>
                数据安全
              </h3>
              <p className='text-gray-600'>
                使用JWT认证，密码加密存储，输入验证，防止SQL注入和XSS攻击，确保系统安全可靠。
              </p>
            </div>

            <div className='bg-white rounded-lg shadow-md p-6'>
              <h3 className='text-lg font-semibold text-gray-900 mb-3'>
                响应式设计
              </h3>
              <p className='text-gray-600'>
                支持各种设备访问，从手机到桌面电脑，都能提供良好的用户体验。
              </p>
            </div>

            <div className='bg-white rounded-lg shadow-md p-6'>
              <h3 className='text-lg font-semibold text-gray-900 mb-3'>
                可扩展架构
              </h3>
              <p className='text-gray-600'>
                模块化设计，支持未来功能扩展，可以轻松添加新的角色和权限。
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
