'use client';

import React, { useState } from 'react';
import { useAuth } from './AuthProvider';
import { useTranslations } from 'next-intl';

interface LoginFormProps {
  onSwitchToRegister: () => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onSwitchToRegister }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const t = useTranslations();

  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const success = await login(email, password);
      if (!success) {
        setError('Invalid email or password');
      }
      // 登录成功后，AuthProvider会自动重定向
    } catch (error) {
      setError('An error occurred during login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='max-w-md mx-auto bg-white rounded-lg shadow-md p-6'>
      <h2 className='text-2xl font-bold text-center text-gray-900 mb-6'>
        {t('auth.signIn')}
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
            className='w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
            placeholder={t('auth.enterPassword')}
          />
        </div>

        <button
          type='submit'
          disabled={loading}
          className='w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed'
        >
          {loading ? t('auth.signingIn') : t('auth.signIn')}
        </button>
      </form>

      <div className='mt-6 text-center'>
        <p className='text-sm text-gray-600'>
          {t('auth.dontHaveAccount')}{' '}
          <button
            type='button'
            onClick={onSwitchToRegister}
            className='text-blue-600 hover:text-blue-500 font-medium'
          >
            {t('auth.signUp')}
          </button>
        </p>
      </div>
    </div>
  );
};
