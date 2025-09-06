import React, { useState, useEffect } from 'react';
import { useAuth } from './AuthProvider';
import { useTranslations } from 'next-intl';

interface StudentBinding {
  id: string;
  parentId: string;
  studentId: string;
  createdAt: string;
  student: {
    id: string;
    name: string;
    email: string;
    gpa?: number;
    satScore?: number | null;
    actScore?: number | null;
  } | null;
}

export const StudentBinding: React.FC = () => {
  const t = useTranslations();
  const { user } = useAuth();
  const [bindings, setBindings] = useState<StudentBinding[]>([]);
  const [newStudentId, setNewStudentId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // 获取已绑定的学生列表
  const fetchBindings = async () => {
    try {
      const response = await fetch('/api/parent/bind-student', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('authToken')}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setBindings(data);
      } else {
        console.error('Failed to fetch bindings');
      }
    } catch (error) {
      console.error('Error fetching bindings:', error);
    }
  };

  useEffect(() => {
    if (user?.role === 'PARENT') {
      fetchBindings();
    }
  }, [user]);

  // 绑定新学生
  const bindStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStudentId.trim()) return;

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch('/api/parent/bind-student', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('authToken')}`,
        },
        body: JSON.stringify({ studentId: newStudentId.trim() }),
      });

      if (response.ok) {
        setSuccess(t('parent.studentBoundSuccess'));
        setNewStudentId('');
        fetchBindings(); // 刷新列表
      } else {
        const errorData = await response.json();
        setError(errorData.error || t('parent.bindFailed'));
      }
    } catch (error) {
      setError(t('parent.networkError'));
    } finally {
      setLoading(false);
    }
  };

  // 解绑学生
  const unbindStudent = async (bindingId: string) => {
    if (!confirm(t('parent.confirmUnbind'))) return;

    try {
      const response = await fetch('/api/parent/bind-student', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('authToken')}`,
        },
        body: JSON.stringify({ bindingId }),
      });

      if (response.ok) {
        setSuccess(t('parent.studentUnboundSuccess'));
        fetchBindings(); // 刷新列表
      } else {
        const errorData = await response.json();
        setError(errorData.error || t('parent.unbindFailed'));
      }
    } catch (error) {
      setError(t('parent.networkError'));
    }
  };

  if (user?.role !== 'PARENT') {
    return null;
  }

  return (
    <div className='bg-white rounded-lg shadow-md p-6'>
      <h3 className='text-lg font-semibold text-gray-900 mb-4'>
        {t('parent.studentBindingManagement')}
      </h3>

      {/* 绑定新学生表单 */}
      <form onSubmit={bindStudent} className='mb-6'>
        <div className='flex gap-2'>
          <input
            type='text'
            value={newStudentId}
            onChange={(e) => setNewStudentId(e.target.value)}
            placeholder={t('parent.enterStudentId')}
            className='flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
            disabled={loading}
          />
          <button
            type='submit'
            disabled={loading || !newStudentId.trim()}
            className='px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50'
          >
            {loading ? t('parent.binding') : t('parent.bindStudent')}
          </button>
        </div>
      </form>

      {/* 消息提示 */}
      {error && (
        <div className='mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded'>
          {error}
        </div>
      )}
      {success && (
        <div className='mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded'>
          {success}
        </div>
      )}

      {/* 已绑定的学生列表 */}
      <div>
        <h4 className='text-md font-medium text-gray-700 mb-3'>
          {t('parent.boundStudents', { count: bindings.length })}
        </h4>

        {bindings.length === 0 ? (
          <p className='text-gray-500 text-sm'>{t('parent.noBoundStudents')}</p>
        ) : (
          <div className='space-y-3'>
            {bindings.map((binding) => (
              <div
                key={binding.id}
                className='flex items-center justify-between p-3 border border-gray-200 rounded-lg'
              >
                <div className='flex-1'>
                  <div className='flex items-center gap-3'>
                    <span className='font-medium text-gray-900'>
                      {binding.student?.name || t('parent.unknownStudent')}
                    </span>
                    <span className='text-sm text-gray-500'>
                      ID: {binding.studentId}
                    </span>
                  </div>
                  {binding.student && (
                    <div className='text-sm text-gray-600 mt-1'>
                      <span>
                        {t('parent.gpa')}:{' '}
                        {binding.student.gpa || t('common.na')}
                      </span>
                      {binding.student.satScore && (
                        <span className='ml-3'>
                          {t('parent.satScore')}: {binding.student.satScore}
                        </span>
                      )}
                      {binding.student.actScore && (
                        <span className='ml-3'>
                          {t('parent.actScore')}: {binding.student.actScore}
                        </span>
                      )}
                    </div>
                  )}
                  <div className='text-xs text-gray-400 mt-1'>
                    {t('parent.bindingTime')}:{' '}
                    {new Date(binding.createdAt).toLocaleString()}
                  </div>
                </div>
                <button
                  onClick={() => unbindStudent(binding.id)}
                  className='px-3 py-1 text-red-600 hover:text-red-800 border border-red-300 rounded hover:bg-red-50'
                >
                  {t('parent.unbind')}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
