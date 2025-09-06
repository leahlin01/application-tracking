'use client';

import React, { useState } from 'react';
import { LoginForm } from '../../../components/LoginForm';
import { RegisterForm } from '../../../components/RegisterForm';
import { useTranslations } from 'next-intl';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';

interface AuthPageProps {
  params: Promise<{
    locale: string;
  }>;
}

export default function AuthPage({ params }: AuthPageProps) {
  const [isLogin, setIsLogin] = useState(true);
  const t = useTranslations('auth');

  console.log(t('title'));

  return (
    <div className='min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8'>
      <div className='absolute top-4 right-4 z-10'>
        <LanguageSwitcher />
      </div>
      <div className='max-w-md w-full space-y-8'>
        <div className='text-center'>
          <h1 className='text-3xl font-bold text-gray-900'>{t('title')}</h1>
          <p className='mt-2 text-sm text-gray-600'>
            {isLogin ? t('signInSubtitle') : t('signUpSubtitle')}
          </p>
        </div>

        {isLogin ? (
          <LoginForm onSwitchToRegister={() => setIsLogin(false)} />
        ) : (
          <RegisterForm onSwitchToLogin={() => setIsLogin(true)} />
        )}
      </div>
    </div>
  );
}
