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
import { getApplicationTypeText } from '@/lib/utils';

interface ParentDashboardProps {
  applications: Application[];
}

export default function ParentDashboard({
  applications,
}: ParentDashboardProps) {
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
            财务规划
          </h3>
          <button
            onClick={() => setShowFinancialPlanning(!showFinancialPlanning)}
            className='text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center'
          >
            {showFinancialPlanning ? (
              <>
                <MinusIcon className='h-4 w-4 mr-1' />
                收起详情
              </>
            ) : (
              <>
                <PlusIcon className='h-4 w-4 mr-1' />
                展开详情
              </>
            )}
          </button>
        </div>

        {/* 学校选择 */}
        <div className='mb-6'>
          <h4 className='text-lg font-medium text-gray-900 mb-4'>
            选择要查看财务信息的学校
          </h4>
          <div className='space-y-4'>
            <div className='overflow-x-auto'>
              <div
                className='flex gap-4 pb-2'
                style={{ minWidth: 'max-content' }}
              >
                {uniqueUniversities.map((uni) => (
                  <div
                    key={uni?.id}
                    onClick={() => {
                      if (uni?.id) {
                        setSelectedSchool(uni.id);
                      }
                    }}
                    className={`cursor-pointer rounded-lg border-2 transition-all duration-200 hover:shadow-md flex-shrink-0 ${
                      uni?.id && uni.id === selectedSchool
                        ? 'border-blue-500 bg-blue-50 shadow-md'
                        : 'border-gray-200 bg-white hover:border-gray-300'
                    }`}
                    style={{ width: '280px' }}
                  >
                    <div className='p-4 h-full flex flex-col'>
                      {/* 学校名称和选择状态 */}
                      <div className='flex items-center justify-between mb-3 flex-shrink-0'>
                        <h5 className='font-semibold text-gray-900 text-lg truncate flex-1 mr-2'>
                          {uni?.name}
                        </h5>
                        {uni?.id && uni.id === selectedSchool && (
                          <div className='w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0'>
                            <svg
                              className='w-4 h-4 text-white'
                              fill='currentColor'
                              viewBox='0 0 20 20'
                            >
                              <path
                                fillRule='evenodd'
                                d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z'
                                clipRule='evenodd'
                              />
                            </svg>
                          </div>
                        )}
                      </div>

                      {/* 费用信息 */}
                      <div className='space-y-2 flex-1'>
                        <div className='flex justify-between items-center'>
                          <span className='text-sm text-gray-600 flex-shrink-0'>
                            年学费:
                          </span>
                          <span className='font-semibold text-green-600 text-right flex-1'>
                            ${(uni?.tuitionOutState || 0).toLocaleString()}
                          </span>
                        </div>
                        <div className='flex justify-between items-center'>
                          <span className='text-sm text-gray-600 flex-shrink-0'>
                            申请费:
                          </span>
                          <span className='font-semibold text-purple-600 text-right flex-1'>
                            ${(uni?.applicationFee || 0).toLocaleString()}
                          </span>
                        </div>
                        <div className='border-t border-gray-200 pt-2'>
                          <div className='flex justify-between items-center'>
                            <span className='text-sm font-medium text-gray-700 flex-shrink-0'>
                              总计:
                            </span>
                            <span className='font-bold text-blue-600 text-lg text-right flex-1'>
                              $
                              {(
                                Number(uni?.tuitionOutState || 0) +
                                Number(uni?.applicationFee || 0)
                              ).toLocaleString()}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* 选择提示 */}
                      <div className='mt-3 text-center flex-shrink-0'>
                        <span
                          className={`text-xs px-2 py-1 rounded-full ${
                            uni?.id && uni.id === selectedSchool
                              ? 'bg-blue-100 text-blue-700'
                              : 'bg-gray-100 text-gray-600'
                          }`}
                        >
                          {uni?.id && uni.id === selectedSchool
                            ? '已选择'
                            : '点击选择'}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 选择状态和操作按钮 */}
            <div className='flex items-center justify-between bg-gray-50 rounded-lg p-4'>
              <div className='flex items-center space-x-3'>
                <span className='text-sm text-gray-600'>
                  当前选择:{' '}
                  {selectedSchool
                    ? uniqueUniversities.find(
                        (uni) => uni?.id === selectedSchool
                      )?.name
                    : '未选择'}
                </span>
                {selectedSchool && (
                  <span className='text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full'>
                    已选择 1 所学校
                  </span>
                )}
              </div>
              <button
                onClick={() => setSelectedSchool('')}
                className='text-sm text-gray-600 hover:text-gray-800 font-medium px-3 py-1 rounded-md hover:bg-gray-200 transition-colors'
              >
                清除选择
              </button>
            </div>
          </div>
        </div>

        {/* 财务概览卡片 */}
        <div className='mb-4'>
          <h4 className='text-lg font-medium text-gray-900 mb-3'>
            财务概览{' '}
            {selectedSchool
              ? `(${
                  uniqueUniversities.find((uni) => uni?.id === selectedSchool)
                    ?.name
                })`
              : '(请选择学校)'}
          </h4>
        </div>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-4 mb-6'>
          <div className='bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200'>
            <div className='flex items-center'>
              <CurrencyDollarIcon className='h-8 w-8 text-blue-600' />
              <div className='ml-3'>
                <p className='text-sm font-medium text-blue-700'>预估总费用</p>
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
                <p className='text-sm font-medium text-green-700'>总学费</p>
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
                <p className='text-sm font-medium text-purple-700'>申请费用</p>
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
            💡 <strong>提示</strong>:
            您可以通过上方的学校选择按钮来选择要查看财务信息的学校。
            每次只能选择一所学校，点击其他学校按钮可以切换选择。
          </p>
        </div>

        {/* 详细财务信息 */}
        {showFinancialPlanning && (
          <div className='space-y-6'>
            <div className='border-t border-gray-200 pt-6'>
              <h4 className='text-lg font-medium text-gray-900 mb-4'>
                各大学费用明细
              </h4>

              {/* 大学费用统计 */}
              <div className='space-y-4'>
                {Object.entries(universityStats).map(([uniName, stats]) => (
                  <div key={uniName} className='bg-gray-50 rounded-lg p-4'>
                    <div className='flex justify-between items-center mb-3'>
                      <h5 className='font-semibold text-gray-900'>{uniName}</h5>
                      <span className='text-sm text-gray-500'>
                        {stats.count} 个申请
                      </span>
                    </div>

                    <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                      <div className='text-center'>
                        <p className='text-xs text-gray-500'>年学费</p>
                        <p className='text-lg font-semibold text-gray-900'>
                          ${stats.totalTuition.toLocaleString()}
                        </p>
                      </div>
                      <div className='text-center'>
                        <p className='text-xs text-gray-500'>申请费</p>
                        <p className='text-lg font-semibold text-gray-900'>
                          ${stats.totalFees.toLocaleString()}
                        </p>
                      </div>
                      <div className='text-center'>
                        <p className='text-xs text-gray-500'>小计</p>
                        <p className='text-lg font-semibold text-blue-600'>
                          $
                          {(
                            stats.totalTuition + stats.totalFees
                          ).toLocaleString()}
                        </p>
                      </div>
                    </div>

                    {/* 申请详情 */}
                    <div className='mt-3 pt-3 border-t border-gray-200'>
                      <div className='space-y-2'>
                        {stats.applications.map((app: Application) => (
                          <div
                            key={app.id}
                            className='flex justify-between items-center text-sm'
                          >
                            <span className='text-gray-600'>
                              {getApplicationTypeText(app.applicationType)}
                            </span>
                            <span className='text-gray-500'>
                              {app.deadline &&
                                format(new Date(app.deadline), 'yyyy-MM-dd')}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* 费用建议 */}
              <div className='mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4'>
                <h5 className='font-medium text-yellow-800 mb-2'>
                  💡 财务建议
                </h5>
                <ul className='text-sm text-yellow-700 space-y-1'>
                  <li>• 考虑申请奖学金和助学金机会</li>
                  <li>• 评估州内学费优惠政策</li>
                  <li>• 制定分期付款计划</li>
                  <li>• 探索教育贷款选项</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 沟通记录 */}
      <div className='bg-white rounded-lg shadow p-6'>
        <div className='flex justify-between items-center mb-6'>
          <h3 className='text-xl font-semibold text-gray-900 flex items-center'>
            <ChatBubbleLeftIcon className='h-6 w-6 text-purple-500 mr-3' />
            沟通记录与备注
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
                收起详情
              </>
            ) : (
              <>
                <PlusIcon className='h-4 w-4 mr-1' />
                展开详情
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
                <p className='text-sm text-blue-700'>有备注的申请</p>
              </div>
              <div className='bg-green-50 rounded-lg p-4 text-center'>
                <p className='text-2xl font-bold text-green-600'>
                  {applicationsWithNotes.reduce(
                    (total, app) => total + (app.parentNotes?.length || 0),
                    0
                  )}
                </p>
                <p className='text-sm text-green-700'>总备注数量</p>
              </div>
              <div className='bg-purple-50 rounded-lg p-4 text-center'>
                <p className='text-2xl font-bold text-purple-600'>
                  {applications.length}
                </p>
                <p className='text-sm text-purple-700'>总申请数量</p>
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
                          {getApplicationTypeText(app.applicationType)} •
                          {app.deadline &&
                            ` 截止日期: ${format(
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
                                备注
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
                    暂无沟通记录
                  </h4>
                  <p className='text-sm text-gray-400 mb-4'>
                    您还没有为任何申请添加备注或观察记录
                  </p>
                  <div className='bg-blue-50 border border-blue-200 rounded-lg p-4 max-w-md mx-auto'>
                    <h5 className='font-medium text-blue-800 mb-2'>
                      💡 建议添加备注的内容：
                    </h5>
                    <ul className='text-sm text-blue-700 space-y-1 text-left'>
                      <li>• 与招生官的沟通记录</li>
                      <li>• 校园访问的观察和感受</li>
                      <li>• 奖学金申请进度</li>
                      <li>• 重要截止日期提醒</li>
                      <li>• 申请策略和注意事项</li>
                    </ul>
                  </div>
                </div>
              )}
            </div>

            {/* 快速添加备注提示 */}
            {applicationsWithNotes.length > 0 && (
              <div className='bg-green-50 border border-green-200 rounded-lg p-4'>
                <h5 className='font-medium text-green-800 mb-2'>📝 管理备注</h5>
                <p className='text-sm text-green-700'>
                  您可以在申请详情页面添加、编辑或删除备注。建议定期更新沟通记录，
                  跟踪申请进度和重要信息。
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
