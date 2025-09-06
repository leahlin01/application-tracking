import { getRequestConfig } from 'next-intl/server';
import { notFound } from 'next/navigation';
import fs from 'fs';
import path from 'path';

// Can be imported from a shared config
const locales = ['en', 'zh'];

export default getRequestConfig(async ({ locale = 'en' }) => {
  // Validate that the incoming `locale` parameter is valid
  if (!locales.includes(locale)) notFound();

  try {
    // 使用同步方式加载翻译文件，避免动态导入问题
    const loadMessages = (namespace: string) => {
      const filePath = path.join(
        process.cwd(),
        'public',
        'locales',
        locale,
        `${namespace}.json`
      );

      if (fs.existsSync(filePath)) {
        const fileContent = fs.readFileSync(filePath, 'utf8');

        const parsed = JSON.parse(fileContent);
        return parsed;
      }
      console.warn(`File not found: ${filePath}`);
      // 如果文件不存在，返回空对象
      return {};
    };

    return {
      locale,
      messages: {
        ...loadMessages('common'),
        ...loadMessages('welcome'),
        ...loadMessages('navigation'),
      },
    };
  } catch (error) {
    console.error('Failed to load messages for locale:', locale, error);
    notFound();
  }
});

export async function getTranslations(locale: string, namespace: string) {
  try {
    const filePath = path.join(
      process.cwd(),
      'public',
      'locales',
      locale,
      `${namespace}.json`
    );

    if (!fs.existsSync(filePath)) {
      // Fallback to English if the locale file doesn't exist
      const fallbackPath = path.join(
        process.cwd(),
        'public',
        'locales',
        'en',
        `${namespace}.json`
      );

      if (fs.existsSync(fallbackPath)) {
        const fileContent = fs.readFileSync(fallbackPath, 'utf8');
        return JSON.parse(fileContent);
      }

      throw new Error(`Translation file not found: ${namespace}.json`);
    }

    const fileContent = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(fileContent);
  } catch (error) {
    console.error(
      `Failed to load translations for ${locale}/${namespace}:`,
      error
    );
    throw error;
  }
}
