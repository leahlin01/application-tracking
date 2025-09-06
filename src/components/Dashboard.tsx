'use client';

import { useState, useEffect } from 'react';
import { Application, ApplicationStatus, DecisionType } from '@/types';
import { format } from 'date-fns';
import {
  AcademicCapIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
} from '@heroicons/react/24/outline';
import { useTranslations } from 'next-intl';

interface DashboardProps {
  applications: Application[];
}

export default function Dashboard({ applications = [] }: DashboardProps) {
  const t = useTranslations();
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
              <p className='text-sm font-medium text-gray-600'>
                {t('dashboard.totalApplications')}
              </p>
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
              <p className='text-sm font-medium text-gray-600'>
                {t('dashboard.submittedApplications')}
              </p>
              <p className='text-2xl font-bold text-gray-900'>
                {submittedApplications}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 进度概览 */}
      <div className='bg-white rounded-lg shadow p-6'>
        <h3 className='text-lg font-semibold text-gray-900 mb-4'>
          {t('dashboard.applicationProgress')}
        </h3>
        <div className='space-y-3'>
          <div className='flex justify-between items-center'>
            <span className='text-sm text-gray-600'>
              {t('application.statusOptions.notStarted')}
            </span>
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
            <span className='text-sm text-gray-600'>
              {t('application.statusOptions.inProgress')}
            </span>
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
            <span className='text-sm text-gray-600'>
              {t('application.statusOptions.submitted')}
            </span>
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
          <h3 className='text-lg font-semibold text-gray-900 mb-4'>
            {t('dashboard.decisionResults')}
          </h3>
          <div className='space-y-3'>
            <div className='flex justify-between items-center'>
              <span className='text-sm text-gray-600'>
                {t('application.decisionOptions.accepted')}
              </span>
              <span className='text-sm font-medium text-green-600'>
                {acceptedApplications}
              </span>
            </div>
            <div className='flex justify-between items-center'>
              <span className='text-sm text-gray-600'>
                {t('application.decisionOptions.rejected')}
              </span>
              <span className='text-sm font-medium text-red-600'>
                {rejectedApplications}
              </span>
            </div>
            <div className='flex justify-between items-center'>
              <span className='text-sm text-gray-600'>
                {t('application.decisionOptions.waitlisted')}
              </span>
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
            {t('dashboard.upcomingDeadlines')}
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
            {t('dashboard.overdueApplications')}
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
    </div>
  );
}
