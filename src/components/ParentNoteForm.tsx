'use client';

import React, { useState } from 'react';
import { useAuth } from './AuthProvider';
import { UserRole } from '../types';
import { useToast, ToastContainer } from './Toast';
import { useTranslations } from 'next-intl';

interface ParentNoteFormProps {
  applicationId: string;
  onNoteAdded: () => void;
  onCancel: () => void;
}

export const ParentNoteForm: React.FC<ParentNoteFormProps> = ({
  applicationId,
  onNoteAdded,
  onCancel,
}) => {
  const t = useTranslations();
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { user } = useAuth();
  const toast = useToast();

  // 只有家长可以添加备注
  if (user?.role !== UserRole.PARENT) {
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!content.trim()) {
      setError(t('parent.noteContentRequired'));
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/parent/notes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('authToken')}`,
        },
        body: JSON.stringify({
          applicationId,
          content: content.trim(),
        }),
      });

      if (response.ok) {
        setContent('');
        onNoteAdded();
        toast.success(t('parent.noteAddedSuccess'));
      } else {
        const errorData = await response.json();
        const errorMessage = errorData.error || t('parent.addNoteFailed');
        setError(errorMessage);
        toast.error(errorMessage);
      }
    } catch (error) {
      const errorMessage = t('parent.networkError');
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='bg-white rounded-lg shadow-md p-6'>
      <h3 className='text-lg font-semibold text-gray-900 mb-4'>
        {t('parent.addNoteTitle')}
      </h3>

      {error && (
        <div className='mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded'>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className='space-y-4'>
        <div>
          <label
            htmlFor='content'
            className='block text-sm font-medium text-gray-700 mb-1'
          >
            {t('parent.noteContent')}
          </label>
          <textarea
            id='content'
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
            rows={4}
            className='w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
            placeholder={t('parent.noteContentPlaceholder')}
          />
        </div>

        <div className='flex justify-end space-x-3'>
          <button
            type='button'
            onClick={onCancel}
            className='px-4 py-2 text-sm border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500'
          >
            {t('common.cancel')}
          </button>
          <button
            type='submit'
            disabled={loading}
            className='px-4 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed'
          >
            {loading ? t('parent.addingNote') : t('parent.addNoteButton')}
          </button>
        </div>
      </form>

      {/* Toast 通知容器 */}
      <ToastContainer toasts={toast.toasts} onRemove={toast.removeToast} />
    </div>
  );
};
