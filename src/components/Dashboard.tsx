'use client';

import { useState, useEffect } from 'react';
import {
  Application,
  ApplicationStatus,
  DecisionType,
  UserRole,
  User,
} from '@/types';
import { format } from 'date-fns';
import {
  AcademicCapIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ChartBarIcon,
  EyeIcon,
} from '@heroicons/react/24/outline';

interface DashboardProps {
  applications: Application[];
  user: User | null;
}

export default function Dashboard({ applications = [], user }: DashboardProps) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const getStatusCount = (status: ApplicationStatus) => {
    return applications.filter((app) => app.status === status).length;
  };

  const getDecisionCount = (decision: DecisionType) => {
    return applications.filter((app) => app.decisionType === decision).length;
  };

  const getUpcomingDeadlines = () => {
    if (!isClient) return [];
    const now = new Date();
    const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

    return applications
      .filter((app) => {
        const deadline = new Date(app.deadline);
        return (
          deadline >= now &&
          deadline <= nextWeek &&
          app.status !== ApplicationStatus.SUBMITTED
        );
      })
      .sort(
        (a, b) =>
          new Date(a.deadline).getTime() - new Date(b.deadline).getTime()
      )
      .slice(0, 3);
  };

  const getOverdueApplications = () => {
    if (!isClient) return [];
    const now = new Date();
    return applications.filter((app) => {
      const deadline = new Date(app.deadline);
      return deadline < now && app.status !== ApplicationStatus.SUBMITTED;
    });
  };

  const totalApplications = applications.length;
  const submittedApplications = getStatusCount(ApplicationStatus.SUBMITTED);
  const inProgressApplications = getStatusCount(ApplicationStatus.IN_PROGRESS);
  const notStartedApplications = getStatusCount(ApplicationStatus.NOT_STARTED);
  const acceptedApplications = getDecisionCount(DecisionType.ACCEPTED);
  const rejectedApplications = getDecisionCount(DecisionType.REJECTED);
  const waitlistedApplications = getDecisionCount(DecisionType.WAITLISTED);

  const upcomingDeadlines = getUpcomingDeadlines();
  const overdueApplications = getOverdueApplications();

  return (
    <div className='space-y-6'>
      {/* 统计卡片 */}
      <div className='grid grid-cols-2 gap-4'>
        <div className='bg-white rounded-lg shadow p-4'>
          <div className='flex items-center'>
            <div className='p-2 bg-blue-100 rounded-lg'>
              <AcademicCapIcon className='h-6 w-6 text-blue-600' />
            </div>
            <div className='ml-3'>
              <p className='text-sm font-medium text-gray-600'>总申请</p>
              <p className='text-2xl font-bold text-gray-900'>
                {totalApplications}
              </p>
            </div>
          </div>
        </div>

        <div className='bg-white rounded-lg shadow p-4'>
          <div className='flex items-center'>
            <div className='p-2 bg-green-100 rounded-lg'>
              <CheckCircleIcon className='h-6 w-6 text-green-600' />
            </div>
            <div className='ml-3'>
              <p className='text-sm font-medium text-gray-600'>已提交</p>
              <p className='text-2xl font-bold text-gray-900'>
                {submittedApplications}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 进度概览 */}
      <div className='bg-white rounded-lg shadow p-6'>
        <h3 className='text-lg font-semibold text-gray-900 mb-4'>申请进度</h3>
        <div className='space-y-3'>
          <div className='flex justify-between items-center'>
            <span className='text-sm text-gray-600'>未开始</span>
            <span className='text-sm font-medium text-gray-900'>
              {notStartedApplications}
            </span>
          </div>
          <div className='w-full bg-gray-200 rounded-full h-2'>
            <div
              className='bg-gray-400 h-2 rounded-full'
              style={{
                width: `${
                  totalApplications > 0
                    ? (notStartedApplications / totalApplications) * 100
                    : 0
                }%`,
              }}
            ></div>
          </div>

          <div className='flex justify-between items-center'>
            <span className='text-sm text-gray-600'>进行中</span>
            <span className='text-sm font-medium text-gray-900'>
              {inProgressApplications}
            </span>
          </div>
          <div className='w-full bg-gray-200 rounded-full h-2'>
            <div
              className='bg-yellow-400 h-2 rounded-full'
              style={{
                width: `${
                  totalApplications > 0
                    ? (inProgressApplications / totalApplications) * 100
                    : 0
                }%`,
              }}
            ></div>
          </div>

          <div className='flex justify-between items-center'>
            <span className='text-sm text-gray-600'>已提交</span>
            <span className='text-sm font-medium text-gray-900'>
              {submittedApplications}
            </span>
          </div>
          <div className='w-full bg-gray-200 rounded-full h-2'>
            <div
              className='bg-blue-500 h-2 rounded-full'
              style={{
                width: `${
                  totalApplications > 0
                    ? (submittedApplications / totalApplications) * 100
                    : 0
                }%`,
              }}
            ></div>
          </div>
        </div>
      </div>

      {/* 决定结果 */}
      {submittedApplications > 0 && (
        <div className='bg-white rounded-lg shadow p-6'>
          <h3 className='text-lg font-semibold text-gray-900 mb-4'>决定结果</h3>
          <div className='space-y-3'>
            <div className='flex justify-between items-center'>
              <span className='text-sm text-gray-600'>录取</span>
              <span className='text-sm font-medium text-green-600'>
                {acceptedApplications}
              </span>
            </div>
            <div className='flex justify-between items-center'>
              <span className='text-sm text-gray-600'>拒绝</span>
              <span className='text-sm font-medium text-red-600'>
                {rejectedApplications}
              </span>
            </div>
            <div className='flex justify-between items-center'>
              <span className='text-sm text-gray-600'>候补</span>
              <span className='text-sm font-medium text-yellow-600'>
                {waitlistedApplications}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* 即将到期的截止日期 */}
      {upcomingDeadlines.length > 0 && (
        <div className='bg-white rounded-lg shadow p-6'>
          <h3 className='text-lg font-semibold text-gray-900 mb-4 flex items-center'>
            <ClockIcon className='h-5 w-5 text-yellow-500 mr-2' />
            即将到期
          </h3>
          <div className='space-y-3'>
            {upcomingDeadlines.map((application) => (
              <div
                key={application.id}
                className='flex justify-between items-center'
              >
                <div>
                  <p className='text-sm font-medium text-gray-900'>
                    {application.university?.name}
                  </p>
                  <p className='text-xs text-gray-500'>
                    {application.applicationType}
                  </p>
                </div>
                <span className='text-sm font-medium text-yellow-600'>
                  {format(new Date(application.deadline), 'MM-dd')}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 逾期申请 */}
      {overdueApplications.length > 0 && (
        <div className='bg-white rounded-lg shadow p-6'>
          <h3 className='text-lg font-semibold text-gray-900 mb-4 flex items-center'>
            <ExclamationTriangleIcon className='h-5 w-5 text-red-500 mr-2' />
            逾期申请
          </h3>
          <div className='space-y-3'>
            {overdueApplications.map((application) => (
              <div
                key={application.id}
                className='flex justify-between items-center'
              >
                <div>
                  <p className='text-sm font-medium text-gray-900'>
                    {application.university?.name}
                  </p>
                  <p className='text-xs text-gray-500'>
                    {application.applicationType}
                  </p>
                </div>
                <span className='text-sm font-medium text-red-600'>
                  {format(new Date(application.deadline), 'MM-dd')}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 通用快速操作 */}
      {/* <div className='bg-white rounded-lg shadow p-6'>
        <h3 className='text-lg font-semibold text-gray-900 mb-4'>快速操作</h3>
        <div className='space-y-3'>
          <button className='w-full text-left p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors'>
            <div className='flex items-center'>
              <ChartBarIcon className='h-5 w-5 text-blue-500 mr-3' />
              <span className='text-sm font-medium text-gray-900'>
                查看详细统计
              </span>
            </div>
          </button>
          <button className='w-full text-left p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors'>
            <div className='flex items-center'>
              <ClockIcon className='h-5 w-5 text-green-500 mr-3' />
              <span className='text-sm font-medium text-gray-900'>
                设置提醒
              </span>
            </div>
          </button>

          {user?.role === UserRole.PARENT && (
            <button className='w-full text-left p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors'>
              <div className='flex items-center'>
                <EyeIcon className='h-5 w-5 text-indigo-500 mr-3' />
                <span className='text-sm font-medium text-gray-900'>
                  查看孩子详情
                </span>
              </div>
            </button>
          )}
        </div>
      </div> */}
    </div>
  );
}
