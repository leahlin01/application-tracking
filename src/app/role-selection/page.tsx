'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { UserRole } from '../../types';
import { useAuth } from '../../components/AuthProvider';

export default function RoleSelectionPage() {
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const { user } = useAuth();

  // 如果用户已登录，重定向到主页
  if (user) {
    if (typeof window !== 'undefined') {
      window.location.href = '/';
    }
    return null;
  }

  const roles = [
    {
      role: UserRole.STUDENT,
      title: '学生',
      description: '管理你的大学申请，跟踪进度，设置提醒',
      icon: (
        <svg
          className='w-12 h-12 text-blue-600'
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
      ),
      features: [
        '创建和管理大学申请',
        '跟踪申请状态和进度',
        '设置截止日期提醒',
        '管理申请要求清单',
        '查看申请历史记录',
      ],
    },
    {
      role: UserRole.PARENT,
      title: '家长',
      description: '查看孩子的申请进度，添加备注和建议',
      icon: (
        <svg
          className='w-12 h-12 text-green-600'
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
      ),
      features: [
        '查看孩子的申请进度',
        '添加备注和建议',
        '跟踪重要截止日期',
        '了解申请状态变化',
        '与孩子协作完成申请',
      ],
    },
    // {
    //   role: UserRole.TEACHER,
    //   title: '老师',
    //   description: '指导学生申请，查看进度，提供建议',
    //   icon: (
    //     <svg
    //       className='w-12 h-12 text-purple-600'
    //       fill='none'
    //       stroke='currentColor'
    //       viewBox='0 0 24 24'
    //     >
    //       <path
    //         strokeLinecap='round'
    //         strokeLinejoin='round'
    //         strokeWidth={2}
    //         d='M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16'
    //       />
    //     </svg>
    //   ),
    //   features: [
    //     '查看学生的申请进度',
    //     '提供申请指导建议',
    //       '跟踪学生申请状态',
    //       '协助完成申请要求',
    //       '评估申请材料质量',
    //     ],
    //   },
    //   {
    //     role: UserRole.ADMIN,
    //     title: '管理员',
    //     description: '系统管理，用户管理，数据维护',
    //     icon: (
    //       <svg
    //         className='w-12 h-12 text-red-600'
    //         fill='none'
    //         stroke='currentColor'
    //         viewBox='0 0 24 24'
    //       >
    //         <path
    //           strokeLinecap='round'
    //           strokeLinejoin='round'
    //           strokeWidth={2}
    //           d='M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z'
    //         />
    //       </svg>
    //     ),
    //     features: [
    //       '系统用户管理',
    //       '数据维护和备份',
    //       '系统配置管理',
    //       '权限分配和控制',
    //       '系统监控和日志',
    //     ],
    //   },
  ];

  return (
    <div className='min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12'>
        <div className='text-center mb-12'>
          <h1 className='text-4xl font-bold text-gray-900 mb-4'>
            选择你的角色
          </h1>
          <p className='text-xl text-gray-600 max-w-3xl mx-auto'>
            请选择最适合你的角色。不同的角色拥有不同的权限和功能，这将帮助你更好地使用系统。
          </p>
        </div>

        <div className='grid md:grid-cols-2 gap-8 mb-12'>
          {roles.map((roleInfo) => (
            <div
              key={roleInfo.role}
              className={`bg-white rounded-lg shadow-md p-6 cursor-pointer transition-all duration-200 ${
                selectedRole === roleInfo.role
                  ? 'ring-2 ring-blue-500 shadow-lg transform scale-105'
                  : 'hover:shadow-lg hover:transform hover:scale-105'
              }`}
              onClick={() => setSelectedRole(roleInfo.role)}
            >
              <div className='text-center mb-4'>
                <div className='inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-3'>
                  {roleInfo.icon}
                </div>
                <h3 className='text-xl font-semibold text-gray-900 mb-2'>
                  {roleInfo.title}
                </h3>
                <p className='text-gray-600 mb-4'>{roleInfo.description}</p>
              </div>

              <div className='space-y-2'>
                <h4 className='font-medium text-gray-900'>主要功能：</h4>
                <ul className='space-y-1'>
                  {roleInfo.features.map((feature, index) => (
                    <li
                      key={index}
                      className='text-sm text-gray-600 flex items-center'
                    >
                      <svg
                        className='w-4 h-4 text-green-500 mr-2'
                        fill='none'
                        stroke='currentColor'
                        viewBox='0 0 24 24'
                      >
                        <path
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          strokeWidth={2}
                          d='M5 13l4 4L19 7'
                        />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        {selectedRole && (
          <div className='text-center'>
            <div className='bg-white rounded-lg shadow-md p-6 max-w-md mx-auto'>
              <h3 className='text-lg font-semibold text-gray-900 mb-4'>
                你选择了：{roles.find((r) => r.role === selectedRole)?.title}
              </h3>
              <p className='text-gray-600 mb-6'>点击下面的按钮继续注册流程</p>
              <Link
                href={`/auth?role=${selectedRole}`}
                className='inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors'
              >
                继续注册
              </Link>
            </div>
          </div>
        )}

        <div className='text-center mt-12'>
          <p className='text-gray-600 mb-4'>已经有账户？</p>
          <Link
            href='/auth'
            className='inline-flex items-center justify-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors'
          >
            立即登录
          </Link>
        </div>
      </div>
    </div>
  );
}
