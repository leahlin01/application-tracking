import React, { useState, useEffect } from 'react';
import { useAuth } from './AuthProvider';

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
        setSuccess('学生绑定成功！');
        setNewStudentId('');
        fetchBindings(); // 刷新列表
      } else {
        const errorData = await response.json();
        setError(errorData.error || '绑定失败');
      }
    } catch (error) {
      setError('网络错误，请重试');
    } finally {
      setLoading(false);
    }
  };

  // 解绑学生
  const unbindStudent = async (bindingId: string) => {
    if (!confirm('确定要解绑这个学生吗？')) return;

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
        setSuccess('学生解绑成功！');
        fetchBindings(); // 刷新列表
      } else {
        const errorData = await response.json();
        setError(errorData.error || '解绑失败');
      }
    } catch (error) {
      setError('网络错误，请重试');
    }
  };

  if (user?.role !== 'PARENT') {
    return null;
  }

  return (
    <div className='bg-white rounded-lg shadow-md p-6'>
      <h3 className='text-lg font-semibold text-gray-900 mb-4'>学生绑定管理</h3>

      {/* 绑定新学生表单 */}
      <form onSubmit={bindStudent} className='mb-6'>
        <div className='flex gap-2'>
          <input
            type='text'
            value={newStudentId}
            onChange={(e) => setNewStudentId(e.target.value)}
            placeholder='输入学生ID'
            className='flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
            disabled={loading}
          />
          <button
            type='submit'
            disabled={loading || !newStudentId.trim()}
            className='px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50'
          >
            {loading ? '绑定中...' : '绑定学生'}
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
          已绑定的学生 ({bindings.length})
        </h4>

        {bindings.length === 0 ? (
          <p className='text-gray-500 text-sm'>
            还没有绑定任何学生。绑定学生后，您就可以查看他们的申请进度了。
          </p>
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
                      {binding.student?.name || '未知学生'}
                    </span>
                    <span className='text-sm text-gray-500'>
                      ID: {binding.studentId}
                    </span>
                  </div>
                  {binding.student && (
                    <div className='text-sm text-gray-600 mt-1'>
                      <span>GPA: {binding.student.gpa || 'N/A'}</span>
                      {binding.student.satScore && (
                        <span className='ml-3'>
                          SAT: {binding.student.satScore}
                        </span>
                      )}
                      {binding.student.actScore && (
                        <span className='ml-3'>
                          ACT: {binding.student.actScore}
                        </span>
                      )}
                    </div>
                  )}
                  <div className='text-xs text-gray-400 mt-1'>
                    绑定时间: {new Date(binding.createdAt).toLocaleString()}
                  </div>
                </div>
                <button
                  onClick={() => unbindStudent(binding.id)}
                  className='px-3 py-1 text-red-600 hover:text-red-800 border border-red-300 rounded hover:bg-red-50'
                >
                  解绑
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
