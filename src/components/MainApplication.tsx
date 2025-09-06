import { Application, University, UserRole, ApplicationType } from '@/types';
import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import ApplicationForm from './ApplicationForm';
import ApplicationList from './ApplicationList';
import { useAuth } from './AuthProvider';
import Dashboard from './Dashboard';
import ParentDashboard from './ParentDashboard';
import { StudentBinding } from './StudentBinding';
import { useToast, ToastContainer } from './Toast';
import UniversityComparison from './UniversityComparison';
import UniversitySearch from './UniversitySearch';
import { Navigation } from './Navigation';

export default function MainApplication() {
  const t = useTranslations();
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
      toast.error(t('application.parentCannotAddApplication'));
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
        toast.error(t('application.createApplicationFailed'));
        return;
      }

      const newApplication = await response.json();
      setApplications((prev) => [...prev, newApplication]);
      setShowApplicationForm(false);
      setSelectedUniversity(null);
      toast.success(t('application.createApplicationSuccess'));
    } catch (error) {
      console.error('创建申请失败:', error);
      toast.error(t('application.createApplicationFailed'));
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
        toast.error(t('application.updateApplicationFailed'));
        return;
      }

      const updatedApplication = await response.json();
      if (updatedApplication) {
        setApplications((prev) =>
          prev.map((app) =>
            app.id === applicationId ? updatedApplication : app
          )
        );
        toast.success(t('application.updateApplicationSuccess'));
      }
    } catch (error) {
      console.error('更新申请失败:', error);
      toast.error(t('application.updateApplicationFailed'));
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
        toast.error(t('application.deleteApplicationFailed'));
        return;
      }

      const result = await response.json();
      if (result.success) {
        setApplications((prev) =>
          prev.filter((app) => app.id !== applicationId)
        );
        toast.success(t('application.deleteApplicationSuccess'));
      }
    } catch (error) {
      console.error('删除申请失败:', error);
      toast.error(t('application.deleteApplicationFailed'));
    }
  };

  if (loading) {
    return (
      <div className='min-h-screen bg-gray-50 flex items-center justify-center'>
        <div className='text-center'>
          <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto'></div>
          <p className='mt-4 text-gray-600'>{t('common.loading')}</p>
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
                {t('dashboard.title')}
              </h1>
              <p className='text-gray-600'>{t('dashboard.subtitle')}</p>
            </div>
          </div>
        </div>

        <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
          {/* 左侧：仪表板和学生绑定 */}
          <div className='lg:col-span-1 space-y-6'>
            <Dashboard applications={applications} />
            {user?.role === UserRole.PARENT && <StudentBinding />}
          </div>

          {/* 右侧：主要内容 */}
          <div className='lg:col-span-2 space-y-8'>
            {/* 大学搜索 */}
            <div className='bg-white rounded-lg shadow p-6'>
              <h2 className='text-xl font-semibold text-gray-900 mb-4'>
                {t('university.search')}
              </h2>
              <UniversitySearch
                onUniversitySelect={handleUniversitySelect}
                applications={applications}
              />
            </div>

            {/* 申请列表 */}
            <div className='bg-white rounded-lg shadow p-6'>
              <h2 className='text-xl font-semibold text-gray-900 mb-4'>
                {user?.role === UserRole.STUDENT
                  ? t('application.myApplications')
                  : t('application.applicationList')}
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
                      {t('university.universityComparison')}
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
                {t('application.addApplicationFor', {
                  universityName: selectedUniversity.name,
                })}
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
