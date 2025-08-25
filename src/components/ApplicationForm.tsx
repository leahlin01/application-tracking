'use client';

import { useState } from 'react';
import { University, ApplicationType } from '@/types';

interface ApplicationFormProps {
  university: University;
  onSubmit: (formData: {
    universityId: string;
    applicationType: ApplicationType;
    deadline: string;
    notes?: string;
  }) => void;
  onCancel: () => void;
}

export default function ApplicationForm({
  university,
  onSubmit,
  onCancel,
}: ApplicationFormProps) {
  const [formData, setFormData] = useState({
    applicationType: ApplicationType.REGULAR_DECISION,
    deadline: '',
    notes: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      universityId: university.id,
      ...formData,
    });
  };

  const getApplicationTypeText = (type: ApplicationType) => {
    switch (type) {
      case ApplicationType.EARLY_DECISION:
        return '提前决定 (Early Decision)';
      case ApplicationType.EARLY_ACTION:
        return '提前行动 (Early Action)';
      case ApplicationType.REGULAR_DECISION:
        return '常规决定 (Regular Decision)';
      case ApplicationType.ROLLING_ADMISSION:
        return '滚动录取 (Rolling Admission)';
      default:
        return type;
    }
  };

  return (
    <form onSubmit={handleSubmit} className='space-y-4'>
      <div>
        <label className='block text-sm font-medium text-gray-700 mb-1'>
          大学
        </label>
        <div className='p-3 bg-gray-50 rounded-md'>
          <p className='font-medium text-gray-900'>{university.name}</p>
          <p className='text-sm text-gray-600'>
            {university.city}, {university.state} • {university.country}
          </p>
        </div>
      </div>

      <div>
        <label className='block text-sm font-medium text-gray-700 mb-1'>
          申请类型
        </label>
        <select
          value={formData.applicationType}
          onChange={(e) =>
            setFormData({
              ...formData,
              applicationType: e.target.value as ApplicationType,
            })
          }
          className='w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent'
          required
        >
          {Object.values(ApplicationType).map((type) => (
            <option key={type} value={type}>
              {getApplicationTypeText(type)}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className='block text-sm font-medium text-gray-700 mb-1'>
          截止日期
        </label>
        <input
          type='date'
          value={formData.deadline}
          onChange={(e) =>
            setFormData({ ...formData, deadline: e.target.value })
          }
          className='w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent'
          required
        />
      </div>

      <div>
        <label className='block text-sm font-medium text-gray-700 mb-1'>
          备注 (可选)
        </label>
        <textarea
          value={formData.notes}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          className='w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent'
          rows={3}
          placeholder='添加任何备注或提醒...'
        />
      </div>

      <div className='flex space-x-3 pt-4'>
        <button
          type='submit'
          className='flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
        >
          添加申请
        </button>
        <button
          type='button'
          onClick={onCancel}
          className='flex-1 px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2'
        >
          取消
        </button>
      </div>
    </form>
  );
}
