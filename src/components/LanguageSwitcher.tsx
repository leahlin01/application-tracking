'use client';

import React from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useLocale } from 'next-intl';

interface LanguageSwitcherProps {
  className?: string;
}

export const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({
  className = '',
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const locale = useLocale();

  const handleLanguageChange = (newLocale: string) => {
    // 移除当前语言前缀，获取原始路径
    const pathWithoutLocale = pathname.replace(`/${locale}`, '') || '/';

    // 构建新的路径
    const newPath = `/${newLocale}${pathWithoutLocale}`;

    // 导航到新路径
    router.push(newPath);
  };

  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'zh', name: '中文', flag: '🇨🇳' },
  ];

  console.log({ locale });

  return (
    <div className={`relative ${className}`}>
      <select
        value={locale}
        onChange={(e) => handleLanguageChange(e.target.value)}
        className='appearance-none bg-white border border-gray-300 rounded-md px-3 py-2 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 cursor-pointer'
        aria-label='选择语言'
      >
        {languages.map((lang) => (
          <option key={lang.code} value={lang.code}>
            {lang.flag} {lang.name}
          </option>
        ))}
      </select>
      <div className='absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none'>
        <svg
          className='w-4 h-4 text-gray-400'
          fill='none'
          stroke='currentColor'
          viewBox='0 0 24 24'
        >
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth={2}
            d='M19 9l-7 7-7-7'
          />
        </svg>
      </div>
    </div>
  );
};
