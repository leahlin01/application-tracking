'use client';

import { useState, useEffect } from 'react';
import { Application, ApplicationType } from '@/types';
import {
  CurrencyDollarIcon,
  CheckCircleIcon,
  ChatBubbleLeftIcon,
  PlusIcon,
  MinusIcon,
} from '@heroicons/react/24/outline';
import { format } from 'date-fns';
import { getApplicationTypeKey } from '@/lib/utils';
import { useTranslations } from 'next-intl';

interface ParentDashboardProps {
  applications: Application[];
}

export default function ParentDashboard({
  applications,
}: ParentDashboardProps) {
  const t = useTranslations();
  const [showFinancialPlanning, setShowFinancialPlanning] = useState(false);
  const [showCommunicationRecords, setShowCommunicationRecords] =
    useState(false);
  const [expandedApplications, setExpandedApplications] = useState<string[]>(
    []
  );
  const [selectedSchool, setSelectedSchool] = useState<string>('');

  // 获取所有不重复的大学
  const uniqueUniversities = applications.reduce((acc, app) => {
    if (app.university && !acc.find((uni) => uni?.id === app.university?.id)) {
      acc.push(app.university);
    }
    return acc;
  }, [] as (typeof applications)[0]['university'][]);

  // 初始化选择第一所大学
  useEffect(() => {
    if (uniqueUniversities.length > 0 && !selectedSchool) {
      setSelectedSchool(uniqueUniversities[0]?.id || '');
    }
  }, [uniqueUniversities, selectedSchool]);

  // 根据选择的学校计算财务统计
  const selectedApplications = applications.filter(
    (app) => app.university && app.university.id === selectedSchool
  );

  const totalTuition = selectedApplications.reduce(
    (total, app) => total + (app.university?.tuitionOutState || 0),
    0
  );

  const totalApplicationFees = selectedApplications.reduce(
    (total, app) => total + (app.university?.applicationFee || 0),
    0
  );

  const totalEstimatedCost =
    Number(totalTuition) + Number(totalApplicationFees);

  // 按大学分组统计（仅基于选择的学校）
  const universityStats = selectedApplications.reduce(
    (acc, app) => {
      const uniName = app.university?.name || '未知大学';
      if (!acc[uniName]) {
        acc[uniName] = {
          applications: [],
          totalTuition: 0,
          totalFees: 0,
          count: 0,
        };
      }
      acc[uniName].applications.push(app);
      acc[uniName].totalTuition += app.university?.tuitionOutState || 0;
      acc[uniName].totalFees += app.university?.applicationFee || 0;
      acc[uniName].count += 1;
      return acc;
    },
    {} as Record<
      string,
      {
        applications: Application[];
        totalTuition: number;
        totalFees: number;
        count: number;
      }
    >
  );

  // 切换申请展开状态
  const toggleApplicationExpansion = (applicationId: string) => {
    setExpandedApplications((prev) =>
      prev.includes(applicationId)
        ? prev.filter((id) => id !== applicationId)
        : [...prev, applicationId]
    );
  };

  // 获取有备注的申请
  const applicationsWithNotes = applications.filter(
    (app) => app.parentNotes && app.parentNotes.length > 0
  );

  return (
    <div className='space-y-6'>
      {/* 财务规划 */}
      <div className='bg-white rounded-lg shadow p-6'>
        <div className='flex justify-between items-center mb-6'>
          <h3 className='text-xl font-semibold text-gray-900 flex items-center'>
            <CurrencyDollarIcon className='h-6 w-6 text-green-500 mr-3' />
            {t('parent.financialPlanning')}
          </h3>
          <button
            onClick={() => setShowFinancialPlanning(!showFinancialPlanning)}
            className='text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center'
          >
            {showFinancialPlanning ? (
              <>
                <MinusIcon className='h-4 w-4 mr-1' />
                {t('parent.collapseDetails')}
              </>
            ) : (
              <>
                <PlusIcon className='h-4 w-4 mr-1' />
                {t('parent.expandDetails')}
              </>
            )}
          </button>
        </div>

        {/* 学校选择 */}
        <div className='mb-6'>
          <h4 className='text-lg font-medium text-gray-900 mb-4'>
            {t('parent.selectSchoolForFinancialInfo')}
          </h4>
          {/* ... 学校选择逻辑 ... */}
        </div>

        {/* 财务概览卡片 */}
        <div className='mb-4'>
          <h4 className='text-lg font-medium text-gray-900 mb-3'>
            {t('parent.financialOverview')}{' '}
            {selectedSchool
              ? `(${
                  uniqueUniversities.find((uni) => uni?.id === selectedSchool)
                    ?.name
                })`
              : `(${t('parent.pleaseSelectSchool')})`}
          </h4>
        </div>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-4 mb-6'>
          <div className='bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200'>
            <div className='flex items-center'>
              <CurrencyDollarIcon className='h-8 w-8 text-blue-600' />
              <div className='ml-3'>
                <p className='text-sm font-medium text-blue-700'>
                  {t('parent.estimatedTotalCost')}
                </p>
                <p className='text-2xl font-bold text-blue-900'>
                  ${totalEstimatedCost.toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          <div className='bg-gradient-to-r from-green-50 to-green-100 rounded-lg p-4 border border-green-200'>
            <div className='flex items-center'>
              <CurrencyDollarIcon className='h-8 w-8 text-green-600' />
              <div className='ml-3'>
                <p className='text-sm font-medium text-green-700'>
                  {t('parent.totalTuition')}
                </p>
                <p className='text-2xl font-bold text-green-900'>
                  ${totalTuition.toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          <div className='bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg p-4 border border-purple-200'>
            <div className='flex items-center'>
              <CheckCircleIcon className='h-8 w-8 text-purple-600' />
              <div className='ml-3'>
                <p className='text-sm font-medium text-purple-700'>
                  {t('parent.applicationFees')}
                </p>
                <p className='text-2xl font-bold text-purple-900'>
                  ${totalApplicationFees.toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 选择提示 */}
        <div className='bg-blue-50 border border-blue-200 rounded-lg p-3 mb-6'>
          <p className='text-sm text-blue-700'>
            <strong>{t('common.tip')}</strong>:{t('parent.selectSchoolHint')}
          </p>
        </div>

        {/* 详细财务信息 */}
        {showFinancialPlanning && (
          <div className='space-y-6'>
            <div className='border-t border-gray-200 pt-6'>
              <h4 className='text-lg font-medium text-gray-900 mb-4'>
                {t('parent.universityCostDetails')}
              </h4>
              {/* ... 详细财务信息 ... */}
            </div>
          </div>
        )}
      </div>

      {/* 沟通记录 */}
      <div className='bg-white rounded-lg shadow p-6'>
        <div className='flex justify-between items-center mb-6'>
          <h3 className='text-xl font-semibold text-gray-900 flex items-center'>
            <ChatBubbleLeftIcon className='h-6 w-6 text-purple-500 mr-3' />
            {t('parent.communicationRecords')}
          </h3>
          <button
            onClick={() =>
              setShowCommunicationRecords(!showCommunicationRecords)
            }
            className='text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center'
          >
            {showCommunicationRecords ? (
              <>
                <MinusIcon className='h-4 w-4 mr-1' />
                {t('parent.collapseDetails')}
              </>
            ) : (
              <>
                <PlusIcon className='h-4 w-4 mr-1' />
                {t('parent.expandDetails')}
              </>
            )}
          </button>
        </div>

        {showCommunicationRecords && (
          <div className='space-y-6'>
            {/* 沟通统计 */}
            <div className='grid grid-cols-1 md:grid-cols-3 gap-4 mb-6'>
              <div className='bg-blue-50 rounded-lg p-4 text-center'>
                <p className='text-2xl font-bold text-blue-600'>
                  {applicationsWithNotes.length}
                </p>
                <p className='text-sm text-blue-700'>
                  {t('parent.communicationStats.applicationsWithNotes')}
                </p>
              </div>
              <div className='bg-green-50 rounded-lg p-4 text-center'>
                <p className='text-2xl font-bold text-green-600'>
                  {applicationsWithNotes.reduce(
                    (total, app) => total + (app.parentNotes?.length || 0),
                    0
                  )}
                </p>
                <p className='text-sm text-green-700'>
                  {t('parent.communicationStats.totalNotes')}
                </p>
              </div>
              <div className='bg-purple-50 rounded-lg p-4 text-center'>
                <p className='text-2xl font-bold text-purple-600'>
                  {applications.length}
                </p>
                <p className='text-sm text-purple-700'>
                  {t('parent.communicationStats.totalApplications')}
                </p>
              </div>
            </div>

            {/* 沟通记录列表 */}
            <div className='space-y-4'>
              {applicationsWithNotes.length > 0 ? (
                applicationsWithNotes.map((app) => (
                  <div
                    key={app.id}
                    className='border border-gray-200 rounded-lg p-4'
                  >
                    <div className='flex justify-between items-start mb-3'>
                      <div>
                        <h4 className='font-semibold text-gray-900 text-lg'>
                          {app.university?.name}
                        </h4>
                        <p className='text-sm text-gray-500'>
                          {t(getApplicationTypeKey(app.applicationType))} •
                          {app.deadline &&
                            ` ${t('application.deadline')}: ${format(
                              new Date(app.deadline),
                              'yyyy-MM-dd'
                            )}`}
                        </p>
                      </div>
                      <button
                        onClick={() => toggleApplicationExpansion(app.id)}
                        className='text-blue-600 hover:text-blue-800 p-1 rounded-full hover:bg-blue-50'
                      >
                        {expandedApplications.includes(app.id) ? (
                          <MinusIcon className='h-4 w-4' />
                        ) : (
                          <PlusIcon className='h-4 w-4' />
                        )}
                      </button>
                    </div>

                    {/* 备注内容 */}
                    {expandedApplications.includes(app.id) && (
                      <div className='space-y-3 pt-3 border-t border-gray-100'>
                        {app.parentNotes?.map((note) => (
                          <div
                            key={note.id}
                            className='bg-gray-50 rounded-lg p-3'
                          >
                            <div className='flex justify-between items-start mb-2'>
                              <span className='text-xs text-gray-500 bg-blue-100 text-blue-800 px-2 py-1 rounded-full'>
                                {t('application.notes')}
                              </span>
                              <span className='text-xs text-gray-500'>
                                {format(
                                  new Date(note.createdAt),
                                  'yyyy-MM-dd HH:mm'
                                )}
                              </span>
                            </div>
                            <p className='text-sm text-gray-700 leading-relaxed'>
                              {note.content}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className='text-center py-12 text-gray-500'>
                  <ChatBubbleLeftIcon className='h-16 w-16 mx-auto mb-4 text-gray-300' />
                  <h4 className='text-lg font-medium text-gray-400 mb-2'>
                    {t('parent.noCommunicationRecords')}
                  </h4>
                  <p className='text-sm text-gray-400 mb-4'>
                    {t('parent.noCommunicationRecordsDescription')}
                  </p>
                  <div className='bg-blue-50 border border-blue-200 rounded-lg p-4 max-w-md mx-auto'>
                    <h5 className='font-medium text-blue-800 mb-2'>
                      {t('parent.suggestedNoteContent')}
                    </h5>
                    <ul className='text-sm text-blue-700 space-y-1 text-left'>
                      {t
                        .raw('parent.suggestedNoteItems')
                        .map((item: string, index: number) => (
                          <li key={index}>• {item}</li>
                        ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>

            {/* 快速添加备注提示 */}
            {applicationsWithNotes.length > 0 && (
              <div className='bg-green-50 border border-green-200 rounded-lg p-4'>
                <h5 className='font-medium text-green-800 mb-2'>
                  {t('parent.manageNotes')}
                </h5>
                <p className='text-sm text-green-700'>
                  {t('parent.manageNotesDescription')}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
