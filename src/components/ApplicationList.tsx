'use client';

import { useState, useEffect } from 'react';
import {
  Application,
  ApplicationStatus,
  DecisionType,
  UserRole,
} from '@/types';
import { format } from 'date-fns';
import {
  PencilIcon,
  TrashIcon,
  CheckCircleIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  ChatBubbleLeftIcon,
} from '@heroicons/react/24/outline';
import { useAuth } from './AuthProvider';
import { ParentNoteForm } from './ParentNoteForm';

interface ApplicationListProps {
  applications: Application[];
  onUpdate: (applicationId: string, updates: Partial<Application>) => void;
  onDelete: (applicationId: string) => void;
}

export default function ApplicationList({
  applications,
  onUpdate,
  onDelete,
}: ApplicationListProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingData, setEditingData] = useState<Partial<Application>>({});
  const [isClient, setIsClient] = useState(false);
  const [showNoteForm, setShowNoteForm] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    setIsClient(true);
  }, []);

  const getStatusColor = (status: ApplicationStatus) => {
    switch (status) {
      case ApplicationStatus.NOT_STARTED:
        return 'bg-gray-100 text-gray-800';
      case ApplicationStatus.IN_PROGRESS:
        return 'bg-yellow-100 text-yellow-800';
      case ApplicationStatus.SUBMITTED:
        return 'bg-blue-100 text-blue-800';
      case ApplicationStatus.UNDER_REVIEW:
        return 'bg-purple-100 text-purple-800';
      case ApplicationStatus.DECIDED:
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getDecisionColor = (decision: DecisionType) => {
    switch (decision) {
      case DecisionType.ACCEPTED:
        return 'bg-green-100 text-green-800';
      case DecisionType.REJECTED:
        return 'bg-red-100 text-red-800';
      case DecisionType.WAITLISTED:
        return 'bg-yellow-100 text-yellow-800';
      case DecisionType.DEFERRED:
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: ApplicationStatus) => {
    switch (status) {
      case ApplicationStatus.NOT_STARTED:
        return '未开始';
      case ApplicationStatus.IN_PROGRESS:
        return '进行中';
      case ApplicationStatus.SUBMITTED:
        return '已提交';
      case ApplicationStatus.UNDER_REVIEW:
        return '审核中';
      case ApplicationStatus.DECIDED:
        return '已决定';
      default:
        return status;
    }
  };

  const getDecisionText = (decision: DecisionType) => {
    switch (decision) {
      case DecisionType.ACCEPTED:
        return '录取';
      case DecisionType.REJECTED:
        return '拒绝';
      case DecisionType.WAITLISTED:
        return '候补';
      case DecisionType.DEFERRED:
        return '延期';
      default:
        return decision;
    }
  };

  const isDeadlineNear = (deadline: string) => {
    if (!isClient) return false;
    const deadlineDate = new Date(deadline);
    const now = new Date();
    const diffTime = deadlineDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 7 && diffDays >= 0;
  };

  const isDeadlineOverdue = (deadline: string) => {
    if (!isClient) return false;
    const deadlineDate = new Date(deadline);
    const now = new Date();
    return deadlineDate < now;
  };

  const handleEdit = (application: Application) => {
    setEditingId(application.id);
    setEditingData({
      status: application.status,
      decisionType: application.decisionType,
      notes: application.notes,
    });
  };

  const handleSave = (applicationId: string) => {
    onUpdate(applicationId, editingData);
    setEditingId(null);
    setEditingData({});
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditingData({});
  };

  if (applications.length === 0) {
    return (
      <div className='text-center py-8'>
        <div className='text-gray-400 mb-4'>
          <ClockIcon className='h-12 w-12 mx-auto' />
        </div>
        <h3 className='text-lg font-medium text-gray-900 mb-2'>还没有申请</h3>
        <p className='text-gray-600'>搜索并选择大学开始你的申请之旅</p>
      </div>
    );
  }

  return (
    <div className='space-y-4'>
      {applications.map((application) => (
        <div
          key={application.id}
          className='border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors'
        >
          <div className='flex justify-between items-start mb-3'>
            <div className='flex-1'>
              <h3 className='font-semibold text-gray-900'>
                {application.university?.name}
              </h3>
              <p className='text-sm text-gray-600'>
                {application.university?.city}, {application.university?.state}
              </p>
            </div>
            <div className='flex items-center space-x-2'>
              {isDeadlineOverdue(application.deadline) && (
                <ExclamationTriangleIcon className='h-5 w-5 text-red-500' />
              )}
              {isDeadlineNear(application.deadline) &&
                !isDeadlineOverdue(application.deadline) && (
                  <ClockIcon className='h-5 w-5 text-yellow-500' />
                )}
              <button
                onClick={() => handleEdit(application)}
                className='p-1 text-gray-400 hover:text-gray-600'
              >
                <PencilIcon className='h-4 w-4' />
              </button>
              <button
                onClick={() => onDelete(application.id)}
                className='p-1 text-gray-400 hover:text-red-600'
              >
                <TrashIcon className='h-4 w-4' />
              </button>
            </div>
          </div>

          <div className='grid grid-cols-2 md:grid-cols-4 gap-4 text-sm'>
            <div>
              <span className='text-gray-500'>申请类型:</span>
              <p className='font-medium'>{application.applicationType}</p>
            </div>
            <div>
              <span className='text-gray-500'>截止日期:</span>
              <p
                className={`font-medium ${
                  isDeadlineOverdue(application.deadline)
                    ? 'text-red-600'
                    : isDeadlineNear(application.deadline)
                    ? 'text-yellow-600'
                    : ''
                }`}
              >
                {format(new Date(application.deadline), 'yyyy-MM-dd')}
              </p>
            </div>
            <div>
              <span className='text-gray-500'>状态:</span>
              <span
                className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                  application.status
                )}`}
              >
                {getStatusText(application.status)}
              </span>
            </div>
            {application.decisionType && (
              <div>
                <span className='text-gray-500'>决定:</span>
                <span
                  className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getDecisionColor(
                    application.decisionType
                  )}`}
                >
                  {getDecisionText(application.decisionType)}
                </span>
              </div>
            )}
          </div>

          {/* 家长备注显示 */}
          {application.parentNotes && application.parentNotes.length > 0 && (
            <div className='mt-3'>
              <span className='text-sm text-gray-500'>家长备注:</span>
              <div className='mt-2 space-y-2'>
                {application.parentNotes.map((note) => (
                  <div
                    key={note.id}
                    className='bg-blue-50 border border-blue-200 rounded-md p-3'
                  >
                    <div className='flex justify-between items-start'>
                      <p className='text-sm text-gray-700'>{note.content}</p>
                      <span className='text-xs text-gray-500'>
                        {format(new Date(note.createdAt), 'yyyy-MM-dd HH:mm')}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 家长添加备注按钮 */}
          {user?.role === UserRole.PARENT && (
            <div className='mt-3'>
              <button
                onClick={() =>
                  setShowNoteForm(
                    showNoteForm === application.id ? null : application.id
                  )
                }
                className='inline-flex items-center px-3 py-1 text-sm text-blue-600 hover:text-blue-700 border border-blue-300 rounded-md hover:bg-blue-50'
              >
                <ChatBubbleLeftIcon className='w-4 h-4 mr-1' />
                {showNoteForm === application.id ? '取消' : '添加备注'}
              </button>
            </div>
          )}

          {/* 家长备注表单 */}
          {showNoteForm === application.id && (
            <div className='mt-3'>
              <ParentNoteForm
                applicationId={application.id}
                onNoteAdded={() => {
                  setShowNoteForm(null);
                  // 这里可以刷新数据
                }}
                onCancel={() => setShowNoteForm(null)}
              />
            </div>
          )}

          {editingId === application.id ? (
            <div className='mt-4 space-y-3'>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>
                  状态
                </label>
                <select
                  value={editingData.status || ''}
                  onChange={(e) =>
                    setEditingData({
                      ...editingData,
                      status: e.target.value as ApplicationStatus,
                    })
                  }
                  className='w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500'
                >
                  {Object.values(ApplicationStatus).map((status) => (
                    <option key={status} value={status}>
                      {getStatusText(status)}
                    </option>
                  ))}
                </select>
              </div>
              {editingData.status === ApplicationStatus.DECIDED && (
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-1'>
                    决定
                  </label>
                  <select
                    value={editingData.decisionType || ''}
                    onChange={(e) =>
                      setEditingData({
                        ...editingData,
                        decisionType: e.target.value as DecisionType,
                      })
                    }
                    className='w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500'
                  >
                    <option value=''>选择决定</option>
                    {Object.values(DecisionType).map((decision) => (
                      <option key={decision} value={decision}>
                        {getDecisionText(decision)}
                      </option>
                    ))}
                  </select>
                </div>
              )}
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>
                  备注
                </label>
                <textarea
                  value={editingData.notes || ''}
                  onChange={(e) =>
                    setEditingData({ ...editingData, notes: e.target.value })
                  }
                  className='w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500'
                  rows={2}
                />
              </div>
              <div className='flex space-x-2'>
                <button
                  onClick={() => handleSave(application.id)}
                  className='px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm'
                >
                  保存
                </button>
                <button
                  onClick={handleCancel}
                  className='px-3 py-1 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 text-sm'
                >
                  取消
                </button>
              </div>
            </div>
          ) : (
            application.notes && (
              <div className='mt-3'>
                <span className='text-sm text-gray-500'>备注:</span>
                <p className='text-sm text-gray-700 mt-1'>
                  {application.notes}
                </p>
              </div>
            )
          )}
        </div>
      ))}
    </div>
  );
}
