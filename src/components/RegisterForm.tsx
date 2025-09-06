'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from './AuthProvider';
import { UserRole } from '../types';
import { useTranslations } from 'next-intl';

interface RegisterFormProps {
  onSwitchToLogin: () => void;
}

export const RegisterForm: React.FC<RegisterFormProps> = ({
  onSwitchToLogin,
}) => {
  const t = useTranslations();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState<UserRole>(UserRole.STUDENT);
  const [studentId, setStudentId] = useState('');
  const [studentIds, setStudentIds] = useState<string[]>(['']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { register } = useAuth();

  // 从URL参数获取角色
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const roleParam = urlParams.get('role') as UserRole;
      if (roleParam && Object.values(UserRole).includes(roleParam)) {
        setRole(roleParam);
      }
    }
  }, []);

  // 当角色改变时重置学生ID
  useEffect(() => {
    if (role === UserRole.PARENT) {
      setStudentIds(['']);
    } else {
      setStudentIds([]);
      setStudentId('');
    }
  }, [role]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // 验证密码
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      setLoading(false);
      return;
    }

    try {
      // 验证家长角色必须有学生ID
      if (role === UserRole.PARENT && studentIds.length === 0) {
        setError('家长角色必须至少绑定一个学生ID');
        setLoading(false);
        return;
      }

      const success = await register(email, password, role);
      if (!success) {
        setError('Registration failed. Please try again.');
      }
      // 注册成功后，AuthProvider会自动重定向
    } catch (error) {
      setError('An error occurred during registration');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='max-w-md mx-auto bg-white rounded-lg shadow-md p-6'>
      <h2 className='text-2xl font-bold text-center text-gray-900 mb-6'>
        {t('auth.signUp')}
      </h2>

      {error && (
        <div className='mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded'>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className='space-y-4'>
        <div>
          <label
            htmlFor='email'
            className='block text-sm font-medium text-gray-700 mb-1'
          >
            {t('auth.email')}
          </label>
          <input
            type='email'
            id='email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className='w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
            placeholder={t('auth.enterEmail')}
          />
        </div>

        <div>
          <label
            htmlFor='role'
            className='block text-sm font-medium text-gray-700 mb-1'
          >
            {t('auth.role')}
          </label>
          <select
            id='role'
            value={role}
            onChange={(e) => setRole(e.target.value as UserRole)}
            required
            className='w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
          >
            <option value={UserRole.STUDENT}>{t('auth.student')}</option>
            <option value={UserRole.PARENT}>{t('auth.parent')}</option>
          </select>
        </div>

        {role === UserRole.STUDENT && (
          <div>
            <label
              htmlFor='studentId'
              className='block text-sm font-medium text-gray-700 mb-1'
            >
              {t('auth.studentId')}
            </label>
            <input
              type='text'
              id='studentId'
              value={studentId}
              onChange={(e) => setStudentId(e.target.value)}
              className='w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
              placeholder={t('auth.studentIdPlaceholder')}
            />
          </div>
        )}

        {role === UserRole.PARENT && (
          <div>
            <p className='text-sm text-gray-500 mb-2'>
              {t('auth.parentRegistrationNote')}
            </p>
          </div>
        )}

        <div>
          <label
            htmlFor='password'
            className='block text-sm font-medium text-gray-700 mb-1'
          >
            {t('auth.password')}
          </label>
          <input
            type='password'
            id='password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
            className='w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
            placeholder={t('auth.enterPassword')}
          />
        </div>

        <div>
          <label
            htmlFor='confirmPassword'
            className='block text-sm font-medium text-gray-700 mb-1'
          >
            {t('auth.confirmPassword')}
          </label>
          <input
            type='password'
            id='confirmPassword'
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            className='w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
            placeholder={t('auth.enterConfirmPassword')}
          />
        </div>

        <button
          type='submit'
          disabled={loading}
          className='w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed'
        >
          {loading ? t('auth.creatingAccount') : t('auth.signUp')}
        </button>
      </form>

      <div className='mt-6 text-center'>
        <p className='text-sm text-gray-600'>
          {t('auth.alreadyHaveAccount')}{' '}
          <button
            type='button'
            onClick={onSwitchToLogin}
            className='text-blue-600 hover:text-blue-500 font-medium'
          >
            {t('auth.signIn')}
          </button>
        </p>
      </div>
    </div>
  );
};
