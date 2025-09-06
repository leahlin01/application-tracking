import { notFound } from 'next/navigation';

interface WelcomePageProps {
  params: Promise<{
    locale: string;
  }>;
}

// Define supported locales
const locales = ['en', 'zh', 'ja'];

export default async function WelcomePage({ params }: WelcomePageProps) {
  const { locale } = await params;

  // Validate locale
  if (!locales.includes(locale)) {
    notFound();
  }

  return (
    <div className='min-h-screen flex items-center justify-center bg-gray-50'>
      <div className='max-w-md w-full space-y-8'>
        <div className='text-center'>
          <h1 className='text-3xl font-bold text-gray-900'>
            {locale === 'zh' && '欢迎'}
            {locale === 'en' && 'Welcome'}
            {locale === 'ja' && 'ようこそ'}
          </h1>
          <p className='mt-4 text-gray-600'>
            {locale === 'zh' && '欢迎来到应用程序跟踪系统'}
            {locale === 'en' && 'Welcome to the Application Tracking System'}
            {locale === 'ja' && 'アプリケーション追跡システムへようこそ'}
          </p>
        </div>
      </div>
    </div>
  );
}
