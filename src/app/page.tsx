'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/components/AuthProvider';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { Navigation } from '@/components/Navigation';
import { University, Application, ApplicationType, UserRole } from '@/types';
import UniversitySearch from '@/components/UniversitySearch';
import ApplicationList from '@/components/ApplicationList';
import ApplicationForm from '@/components/ApplicationForm';
import Dashboard from '@/components/Dashboard';
import { StudentBinding } from '@/components/StudentBinding';
import UniversityComparison from '@/components/UniversityComparison';
import ParentDashboard from '@/components/ParentDashboard';
import { useToast, ToastContainer } from '@/components/Toast';

// 主应用内容组件
function MainApplication() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [universities, setUniversities] = useState<University[]>([]);
  const [selectedUniversity, setSelectedUniversity] =
    useState<University | null>(null);
  const [showApplicationForm, setShowApplicationForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const [selectedUniversities, setSelectedUniversities] = useState<
    University[]
  >([]);
  const toast = useToast();

  useEffect(() => {
    fetchApplications();
    fetchUniversities();
  }, []);

  const fetchApplications = async () => {
    try {
      let url = '/api/applications';
      if (user?.role === UserRole.STUDENT) {
        url = `/api/student/applications`;
      } else if (user?.role === UserRole.PARENT) {
        url = `/api/parent/applications`;
      }

      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('authToken')}`,
        },
      });

      if (!response.ok) {
        return;
      }

      const data = await response.json();
      setApplications(data);
    } catch (error) {
      console.error('获取申请列表失败:', error);
      setApplications([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchUniversities = async () => {
    try {
      const response = await fetch('/api/universities', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('authToken')}`,
        },
      });

      if (!response.ok) {
        return;
      }

      const data = await response.json();
      setUniversities(data);
    } catch (error) {
      console.error('获取大学列表失败:', error);
      setUniversities([]);
    }
  };

  const handleUniversitySelect = (university: University) => {
    if (user?.role === UserRole.STUDENT) {
      setSelectedUniversity(university);
      setShowApplicationForm(true);
    } else {
      toast.error('家长不能添加申请');
    }
  };

  const handleApplicationSubmit = async (formData: {
    universityId: string;
    applicationType: ApplicationType;
    deadline: string;
    notes?: string;
  }) => {
    try {
      const url =
        user?.role === UserRole.STUDENT
          ? '/api/student/applications'
          : '/api/applications';
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('authToken')}`,
        },
        body: JSON.stringify({
          ...formData,
          studentId:
            user?.role === UserRole.STUDENT ? user.studentId : undefined,
        }),
      });

      if (!response.ok) {
        toast.error('创建申请失败');
        return;
      }

      const newApplication = await response.json();
      setApplications((prev) => [...prev, newApplication]);
      setShowApplicationForm(false);
      setSelectedUniversity(null);
      toast.success('申请创建成功');
    } catch (error) {
      console.error('创建申请失败:', error);
      toast.error('创建申请失败，请重试');
    }
  };

  const handleApplicationUpdate = async (
    applicationId: string,
    updates: Partial<Application>
  ) => {
    try {
      const response = await fetch(`/api/applications/${applicationId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('authToken')}`,
        },
        body: JSON.stringify(updates),
      });

      if (!response.ok) {
        toast.error('更新申请失败');
        return;
      }

      const updatedApplication = await response.json();
      if (updatedApplication) {
        setApplications((prev) =>
          prev.map((app) =>
            app.id === applicationId ? updatedApplication : app
          )
        );
        toast.success('申请更新成功');
      }
    } catch (error) {
      console.error('更新申请失败:', error);
      toast.error('更新申请失败，请重试');
    }
  };

  const handleApplicationDelete = async (applicationId: string) => {
    try {
      const response = await fetch(`/api/applications/${applicationId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('authToken')}`,
        },
      });

      if (!response.ok) {
        toast.error('删除申请失败');
        return;
      }

      const result = await response.json();
      if (result.success) {
        setApplications((prev) =>
          prev.filter((app) => app.id !== applicationId)
        );
        toast.success('申请删除成功');
      }
    } catch (error) {
      console.error('删除申请失败:', error);
      toast.error('删除申请失败，请重试');
    }
  };

  if (loading) {
    return (
      <div className='min-h-screen bg-gray-50 flex items-center justify-center'>
        <div className='text-center'>
          <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto'></div>
          <p className='mt-4 text-gray-600'>加载中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-gray-50'>
      <Navigation />

      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
        <div className='mb-8'>
          <div className='flex justify-between items-start'>
            <div>
              <h1 className='text-3xl font-bold text-gray-900 mb-2'>
                大学申请管理平台
              </h1>
              <p className='text-gray-600'>
                追踪你的大学申请进度，管理申请要求和截止日期
              </p>
            </div>
            {/* 暂时注释掉管理员功能
            {user?.role === UserRole.ADMIN && (
              <button
                onClick={() => {
                  if (
                    confirm(
                      '这将清空所有现有数据并重新初始化示例数据。确定要继续吗？'
                    )
                  ) {
                    initializeData();
                  }
                }}
                disabled={loading}
                className='px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:ring-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2'
              >
                {loading ? (
                  <>
                    <div className='animate-spin rounded-full h-4 w-4 border-b-2 border-white'></div>
                    初始化中...
                  </>
                ) : (
                  <>
                    <svg
                      className='w-4 h-4'
                      fill='none'
                      stroke='currentColor'
                      viewBox='0 0 24 24'
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth={2}
                        d='M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15'
                      />
                    </svg>
                    初始化示例数据
                  </>
                )}
              </button>
            )}
            */}
          </div>
        </div>

        <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
          {/* 左侧：仪表板和学生绑定 */}
          <div className='lg:col-span-1 space-y-6'>
            <Dashboard applications={applications} user={user} />
            {user?.role === UserRole.PARENT && <StudentBinding />}
          </div>

          {/* 右侧：主要内容 */}
          <div className='lg:col-span-2 space-y-8'>
            {/* 大学搜索 */}
            <div className='bg-white rounded-lg shadow p-6'>
              <h2 className='text-xl font-semibold text-gray-900 mb-4'>
                搜索大学
              </h2>
              <UniversitySearch
                onUniversitySelect={handleUniversitySelect}
                applications={applications}
              />
            </div>

            {/* 申请列表 */}
            <div className='bg-white rounded-lg shadow p-6'>
              <h2 className='text-xl font-semibold text-gray-900 mb-4'>
                {user?.role === UserRole.STUDENT ? '我的申请' : '申请列表'}
              </h2>
              <ApplicationList
                applications={applications}
                onUpdate={handleApplicationUpdate}
                onDelete={handleApplicationDelete}
                onRefresh={fetchApplications}
              />
            </div>

            {/* 学生专属功能 */}
            {user?.role === UserRole.STUDENT && (
              <>
                {/* 大学比较工具 */}
                <div className='bg-white rounded-lg shadow p-6'>
                  <div className='flex justify-between items-center mb-4'>
                    <h3 className='text-lg font-semibold text-gray-900'>
                      大学比较
                    </h3>
                  </div>
                  <UniversityComparison
                    universities={universities}
                    selectedUniversities={selectedUniversities}
                    onSelectionChange={setSelectedUniversities}
                    isVisible={true}
                  />
                </div>
              </>
            )}

            {/* 家长专属功能 */}
            {user?.role === UserRole.PARENT && (
              <ParentDashboard applications={applications} />
            )}
          </div>
        </div>

        {/* 申请表单模态框 */}
        {showApplicationForm && selectedUniversity && (
          <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50'>
            <div className='bg-white rounded-lg max-w-md w-full p-6'>
              <h3 className='text-lg font-semibold text-gray-900 mb-4'>
                添加申请 - {selectedUniversity.name}
              </h3>
              <ApplicationForm
                university={selectedUniversity}
                onSubmit={handleApplicationSubmit}
                onCancel={() => {
                  setShowApplicationForm(false);
                  setSelectedUniversity(null);
                }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Toast 通知容器 */}
      <ToastContainer toasts={toast.toasts} onRemove={toast.removeToast} />
    </div>
  );
}

// 主页面组件，包含权限保护
export default function Home() {
  return (
    <ProtectedRoute>
      <MainApplication />
    </ProtectedRoute>
  );
}
