'use client';

import { useState, useEffect } from 'react';
import { University, Application } from '@/types';
import {
  MagnifyingGlassIcon,
  CheckCircleIcon,
} from '@heroicons/react/24/outline';

interface UniversitySearchProps {
  onUniversitySelect: (university: University) => void;
  applications?: Application[];
}

export default function UniversitySearch({
  onUniversitySelect,
  applications = [],
}: UniversitySearchProps) {
  const [universities, setUniversities] = useState<University[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [country, setCountry] = useState('');
  const [state, setState] = useState('');
  const [system, setSystem] = useState('');
  const [sortByRanking, setSortByRanking] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchUniversities = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (searchTerm) params.append('search', searchTerm);
      if (country) params.append('country', country);
      if (state) params.append('state', state);
      if (system) params.append('applicationSystem', system);
      if (sortByRanking) params.append('ranking', 'true');

      const response = await fetch(`/api/universities?${params.toString()}`);
      const data = await response.json();
      if (!response.ok) {
        return;
      }

      setUniversities(data);
    } catch (error) {
      console.error('获取大学列表失败:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUniversities();
  }, [searchTerm, country, state, system, sortByRanking]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchUniversities();
  };

  // 检查学校是否已经被申请
  const isUniversityApplied = (universityId: string) => {
    return applications.some((app) => app.university?.id === universityId);
  };

  return (
    <div className='space-y-4'>
      {/* 搜索表单 */}
      <form onSubmit={handleSearch} className='space-y-4'>
        <div className='flex gap-2'>
          <div className='flex-1 relative'>
            <MagnifyingGlassIcon className='absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400' />
            <input
              type='text'
              placeholder='搜索大学名称、城市或州...'
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className='w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent'
            />
          </div>
          <button
            type='submit'
            className='px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:ring-2 focus:ring-blue-500'
          >
            搜索
          </button>
        </div>

        {/* 筛选选项 */}
        <div className='grid grid-cols-2 md:grid-cols-4 gap-2'>
          <select
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            className='px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500'
          >
            <option value=''>所有国家</option>
            <option value='United States'>美国</option>
            <option value='Canada'>加拿大</option>
            <option value='United Kingdom'>英国</option>
          </select>

          <select
            value={state}
            onChange={(e) => setState(e.target.value)}
            className='px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500'
          >
            <option value=''>所有州</option>
            <option value='California'>加利福尼亚</option>
            <option value='New York'>纽约</option>
            <option value='Texas'>德克萨斯</option>
            <option value='Massachusetts'>马萨诸塞</option>
          </select>

          <select
            value={system}
            onChange={(e) => setSystem(e.target.value)}
            className='px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500'
          >
            <option value=''>所有系统</option>
            <option value='Common App'>Common App</option>
            <option value='Coalition'>Coalition</option>
            <option value='Direct'>直接申请</option>
          </select>

          <label className='flex items-center space-x-2'>
            <input
              type='checkbox'
              checked={sortByRanking}
              onChange={(e) => setSortByRanking(e.target.checked)}
              className='rounded border-gray-300 text-blue-600 focus:ring-blue-500'
            />
            <span className='text-sm text-gray-700'>按排名排序</span>
          </label>
        </div>
      </form>

      {/* 说明信息 */}
      {applications.length > 0 && (
        <div className='bg-blue-50 border border-blue-200 rounded-lg p-3 mb-3'>
          <p className='text-sm text-blue-700'>
            💡 <strong>提示</strong>:
            已申请的学校会以置灰状态显示，并标记为&ldquo;已申请&rdquo;。
          </p>
        </div>
      )}

      {/* 大学列表 */}
      <div className='space-y-2 max-h-96 overflow-y-auto'>
        {loading ? (
          <div className='text-center py-4'>
            <div className='animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto'></div>
            <p className='mt-2 text-sm text-gray-600'>搜索中...</p>
          </div>
        ) : universities.length === 0 ? (
          <div className='text-center py-8 text-gray-500'>
            没有找到匹配的大学
          </div>
        ) : (
          universities.map((university) => {
            const isApplied = isUniversityApplied(university.id);
            return (
              <div
                key={university.id}
                className={`border rounded-lg p-4 transition-colors ${
                  isApplied
                    ? 'border-gray-300 bg-gray-100 cursor-not-allowed opacity-60'
                    : 'border-gray-200 bg-white hover:bg-gray-50 cursor-pointer'
                }`}
                onClick={() => !isApplied && onUniversitySelect(university)}
              >
                <div className='flex justify-between items-start'>
                  <div className='flex-1'>
                    <div className='flex items-center space-x-2'>
                      <h3
                        className={`font-semibold ${
                          isApplied ? 'text-gray-500' : 'text-gray-900'
                        }`}
                      >
                        {university.name}
                      </h3>
                      {isApplied && (
                        <CheckCircleIcon className='h-5 w-5 text-green-500' />
                      )}
                    </div>
                    <p
                      className={`text-sm ${
                        isApplied ? 'text-gray-400' : 'text-gray-600'
                      }`}
                    >
                      {university.city}, {university.state} •{' '}
                      {university.country}
                    </p>
                    <div
                      className={`flex items-center space-x-4 mt-2 text-sm ${
                        isApplied ? 'text-gray-400' : 'text-gray-500'
                      }`}
                    >
                      {university.usNewsRanking && (
                        <span>排名: #{university.usNewsRanking}</span>
                      )}
                      {university.acceptanceRate && (
                        <span>
                          录取率: {(university.acceptanceRate * 100).toFixed(1)}
                          %
                        </span>
                      )}
                      <span>系统: {university.applicationSystem}</span>
                    </div>
                  </div>
                  <div className='text-right'>
                    {university.applicationFee && (
                      <p
                        className={`text-sm ${
                          isApplied ? 'text-gray-400' : 'text-gray-600'
                        }`}
                      >
                        申请费: ${university.applicationFee}
                      </p>
                    )}
                  </div>
                </div>

                {/* 已申请提示 */}
                {isApplied && (
                  <div className='mt-3 pt-3 border-t border-gray-200'>
                    <div className='flex items-center justify-center'>
                      <span className='text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full'>
                        已申请 ✓
                      </span>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
