'use client';

import { useState } from 'react';
import { University } from '@/types';
import { PlusIcon, XMarkIcon } from '@heroicons/react/24/outline';

interface UniversityComparisonProps {
  universities: University[];
  selectedUniversities: University[];
  onSelectionChange: (universities: University[]) => void;
  isVisible: boolean;
}

export default function UniversityComparison({
  universities,
  selectedUniversities,
  onSelectionChange,
  isVisible,
}: UniversityComparisonProps) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredUniversities = universities.filter(
    (uni) =>
      uni.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      uni.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (uni.state && uni.state.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const addUniversity = (university: University) => {
    if (!selectedUniversities.find((u) => u.id === university.id)) {
      onSelectionChange([...selectedUniversities, university]);
    }
  };

  const removeUniversity = (universityId: string) => {
    onSelectionChange(
      selectedUniversities.filter((u) => u.id !== universityId)
    );
  };

  const clearAll = () => {
    onSelectionChange([]);
  };

  if (!isVisible) return null;

  return (
    <div className='space-y-6'>
      {/* 大学选择区域 */}
      <div className='space-y-4'>
        <div className='flex justify-between items-center'>
          <h4 className='text-lg font-medium text-gray-900'>
            选择要比较的大学
          </h4>
          {selectedUniversities.length > 0 && (
            <button
              onClick={clearAll}
              className='text-sm text-red-600 hover:text-red-800 font-medium'
            >
              清空选择
            </button>
          )}
        </div>

        {/* 搜索框 */}
        <div className='relative'>
          <input
            type='text'
            placeholder='搜索大学名称、城市或州...'
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
          />
        </div>

        {/* 大学选择按钮 */}
        <div className='space-y-3'>
          <h5 className='text-sm font-medium text-gray-700'>
            可选择的大学 ({filteredUniversities.length})
          </h5>
          <div className='flex flex-wrap gap-2 max-h-32 overflow-y-auto'>
            {filteredUniversities.slice(0, 20).map((uni) => (
              <button
                key={uni.id}
                onClick={() => addUniversity(uni)}
                disabled={!!selectedUniversities.find((u) => u.id === uni.id)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedUniversities.find((u) => u.id === uni.id)
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-blue-100 text-blue-800 hover:bg-blue-200 border border-blue-200'
                }`}
              >
                <PlusIcon className='h-4 w-4 inline mr-1' />
                {uni.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 大学比较表格 */}
      {selectedUniversities.length > 0 && (
        <div className='space-y-4'>
          <div className='flex justify-between items-center'>
            <h4 className='text-lg font-medium text-gray-900'>
              比较结果 ({selectedUniversities.length} 所大学)
            </h4>
            <div className='text-sm text-gray-500'>
              支持横向滚动查看更多内容
            </div>
          </div>

          {/* 横向滚动容器 */}
          <div className='border border-gray-200 rounded-lg overflow-hidden'>
            <div className='overflow-x-auto'>
              <div className='min-w-max'>
                <table className='w-full border-collapse'>
                  <thead>
                    <tr className='bg-gray-50'>
                      <th className='text-left p-4 text-sm font-semibold text-gray-900 bg-gray-50 sticky left-0 z-10 border-r border-gray-200 min-w-[180px]'>
                        比较项目
                      </th>
                      {selectedUniversities.map((uni) => (
                        <th
                          key={uni.id}
                          className='text-center p-4 text-sm font-semibold text-gray-900 bg-gray-50 min-w-[220px] border-r border-gray-200 last:border-r-0'
                        >
                          <div className='flex flex-col items-center space-y-2'>
                            <span className='font-bold text-base'>
                              {uni.name}
                            </span>
                            <button
                              onClick={() => removeUniversity(uni.id)}
                              className='text-gray-400 hover:text-red-600 p-1 rounded-full hover:bg-gray-100 transition-colors'
                              title='移除大学'
                            >
                              <XMarkIcon className='h-4 w-4' />
                            </button>
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {/* 基本信息 */}
                    <tr className='border-b border-gray-100'>
                      <td className='p-4 text-sm font-medium text-gray-700 bg-gray-50 sticky left-0 z-10 border-r border-gray-200'>
                        基本信息
                      </td>
                      {selectedUniversities.map((uni) => (
                        <td
                          key={uni.id}
                          className='p-4 text-sm text-gray-600 text-center border-r border-gray-200 last:border-r-0'
                        >
                          <div className='space-y-1'>
                            <div className='font-semibold text-gray-900'>
                              {uni.name}
                            </div>
                            <div className='text-xs text-gray-500'>
                              {uni.city}, {uni.state || uni.country}
                            </div>
                          </div>
                        </td>
                      ))}
                    </tr>

                    {/* 排名 */}
                    <tr className='border-b border-gray-100'>
                      <td className='p-4 text-sm font-medium text-gray-700 bg-gray-50 sticky left-0 z-10 border-r border-gray-200'>
                        US News排名
                      </td>
                      {selectedUniversities.map((uni) => (
                        <td
                          key={uni.id}
                          className='p-4 text-sm text-gray-600 text-center border-r border-gray-200 last:border-r-0'
                        >
                          {uni.usNewsRanking ? (
                            <span className='inline-flex items-center px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium'>
                              #{uni.usNewsRanking}
                            </span>
                          ) : (
                            <span className='text-gray-400'>N/A</span>
                          )}
                        </td>
                      ))}
                    </tr>

                    {/* 录取率 */}
                    <tr className='border-b border-gray-100'>
                      <td className='p-4 text-sm font-medium text-gray-700 bg-gray-50 sticky left-0 z-10 border-r border-gray-200'>
                        录取率
                      </td>
                      {selectedUniversities.map((uni) => (
                        <td
                          key={uni.id}
                          className='p-4 text-sm text-gray-600 text-center border-r border-gray-200 last:border-r-0'
                        >
                          {uni.acceptanceRate ? (
                            <span className='inline-flex items-center px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium'>
                              {(uni.acceptanceRate * 100).toFixed(1)}%
                            </span>
                          ) : (
                            <span className='text-gray-400'>N/A</span>
                          )}
                        </td>
                      ))}
                    </tr>

                    {/* 学费 */}
                    <tr className='border-b border-gray-100'>
                      <td className='p-4 text-sm font-medium text-gray-700 bg-gray-50 sticky left-0 z-10 border-r border-gray-200'>
                        年学费 (州外)
                      </td>
                      {selectedUniversities.map((uni) => (
                        <td
                          key={uni.id}
                          className='p-4 text-sm text-gray-600 text-center border-r border-gray-200 last:border-r-0'
                        >
                          {uni.tuitionOutState ? (
                            <span className='font-semibold text-gray-900'>
                              ${uni.tuitionOutState.toLocaleString()}
                            </span>
                          ) : (
                            <span className='text-gray-400'>N/A</span>
                          )}
                        </td>
                      ))}
                    </tr>

                    {/* 申请费 */}
                    <tr className='border-b border-gray-100'>
                      <td className='p-4 text-sm font-medium text-gray-700 bg-gray-50 sticky left-0 z-10 border-r border-gray-200'>
                        申请费
                      </td>
                      {selectedUniversities.map((uni) => (
                        <td
                          key={uni.id}
                          className='p-4 text-sm text-gray-600 text-center border-r border-gray-200 last:border-r-0'
                        >
                          {uni.applicationFee ? (
                            <span className='font-semibold text-gray-900'>
                              ${uni.applicationFee}
                            </span>
                          ) : (
                            <span className='text-gray-400'>N/A</span>
                          )}
                        </td>
                      ))}
                    </tr>

                    {/* 申请系统 */}
                    <tr className='border-b border-gray-100'>
                      <td className='p-4 text-sm font-medium text-gray-700 bg-gray-50 sticky left-0 z-10 border-r border-gray-200'>
                        申请系统
                      </td>
                      {selectedUniversities.map((uni) => (
                        <td
                          key={uni.id}
                          className='p-4 text-sm text-gray-600 text-center border-r border-gray-200 last:border-r-0'
                        >
                          <span className='inline-flex items-center px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-medium'>
                            {uni.applicationSystem}
                          </span>
                        </td>
                      ))}
                    </tr>

                    {/* 截止日期 */}
                    <tr className='border-b border-gray-100'>
                      <td className='p-4 text-sm font-medium text-gray-700 bg-gray-50 sticky left-0 z-10 border-r border-gray-200'>
                        主要截止日期
                      </td>
                      {selectedUniversities.map((uni) => (
                        <td
                          key={uni.id}
                          className='p-4 text-sm text-gray-600 text-center border-r border-gray-200 last:border-r-0'
                        >
                          {uni.deadlines?.regular ? (
                            <div className='space-y-1'>
                              <div className='font-medium text-gray-900'>
                                常规申请
                              </div>
                              <div className='text-xs text-gray-500'>
                                {uni.deadlines.regular}
                              </div>
                            </div>
                          ) : (
                            <span className='text-gray-400'>N/A</span>
                          )}
                        </td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* 滚动提示 */}
          <div className='text-center text-sm text-gray-500 bg-gray-50 p-3 rounded-lg'>
            💡 提示：在移动设备上可以左右滑动查看更多比较内容
          </div>
        </div>
      )}
    </div>
  );
}
