import { notFound } from 'next/navigation';
import { getTranslations } from '@/lib/i18n';
import Link from 'next/link';

interface WelcomePageProps {
  params: Promise<{
    locale: string;
  }>;
}

// Define supported locales
const locales = ['en', 'zh'];

export default async function WelcomePage({ params }: WelcomePageProps) {
  const { locale } = await params;

  // Validate locale
  if (!locales.includes(locale)) {
    notFound();
  }

  // Load translations using custom function
  const content = await getTranslations(locale, 'welcome');

  // Create a simple translation function
  const t = (key: string) => {
    const keys = key.split('.');
    let value: any = content;
    for (const k of keys) {
      value = value?.[k];
    }
    return value || key;
  };

  return (
    <div className='min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50'>
      {/* Hero Section */}
      <section className='relative overflow-hidden'>
        <div className='absolute inset-0 bg-gradient-to-r from-blue-600/10 to-indigo-600/10'></div>
        <div className='relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24'>
          <div className='text-center'>
            <h1 className='text-4xl md:text-6xl font-bold text-gray-900 mb-6'>
              {t('hero.title')}
            </h1>
            <p className='text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto'>
              {t('hero.subtitle')}
            </p>
            <p className='text-lg text-gray-500 mb-10 max-w-2xl mx-auto'>
              {t('hero.description')}
            </p>
            <Link
              href={`/${locale}/auth`}
              className='inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-8 rounded-lg text-lg transition-colors duration-200 shadow-lg hover:shadow-xl'
            >
              {t('hero.cta')}
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className='py-20 bg-white'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='text-center mb-16'>
            <h2 className='text-3xl md:text-4xl font-bold text-gray-900 mb-4'>
              {t('features.title')}
            </h2>
            <p className='text-xl text-gray-600 max-w-2xl mx-auto'>
              {t('features.subtitle')}
            </p>
          </div>
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8'>
            {[0, 1, 2, 3].map((index) => (
              <div
                key={index}
                className='text-center p-6 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors duration-200'
              >
                <div className='text-4xl mb-4'>
                  {t(`features.items.${index}.icon`)}
                </div>
                <h3 className='text-xl font-semibold text-gray-900 mb-3'>
                  {t(`features.items.${index}.title`)}
                </h3>
                <p className='text-gray-600'>
                  {t(`features.items.${index}.description`)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className='py-20 bg-gradient-to-r from-blue-600 to-indigo-600'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='text-center mb-16'>
            <h2 className='text-3xl md:text-4xl font-bold text-white mb-4'>
              {t('whyChoose.title')}
            </h2>
          </div>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
            {[0, 1, 2, 3].map((index) => (
              <div
                key={index}
                className='bg-white/10 backdrop-blur-sm rounded-xl p-6 hover:bg-white/20 transition-colors duration-200'
              >
                <h3 className='text-xl font-semibold text-white mb-3'>
                  {t(`whyChoose.items.${index}.title`)}
                </h3>
                <p className='text-blue-100'>
                  {t(`whyChoose.items.${index}.description`)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className='py-20 bg-gray-50'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='text-center mb-16'>
            <h2 className='text-3xl md:text-4xl font-bold text-gray-900 mb-4'>
              {t('testimonials.title')}
            </h2>
          </div>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
            {[0, 1, 2].map((index) => (
              <div
                key={index}
                className='bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-200'
              >
                <div className='flex mb-4'>
                  {[
                    ...Array(parseInt(t(`testimonials.items.${index}.rating`))),
                  ].map((_, i) => (
                    <span key={i} className='text-yellow-400 text-xl'>
                      ★
                    </span>
                  ))}
                </div>
                <p className='text-gray-600 mb-4 italic'>
                  &ldquo;{t(`testimonials.items.${index}.content`)}&rdquo;
                </p>
                <div className='border-t pt-4'>
                  <p className='font-semibold text-gray-900'>
                    {t(`testimonials.items.${index}.name`)}
                  </p>
                  <p className='text-sm text-gray-500'>
                    {t(`testimonials.items.${index}.role`)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className='py-20 bg-white'>
        <div className='max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center'>
          <h2 className='text-3xl md:text-4xl font-bold text-gray-900 mb-4'>
            {t('contact.title')}
          </h2>
          <p className='text-xl text-gray-600 mb-8 max-w-2xl mx-auto'>
            {t('contact.description')}
          </p>
          <div className='flex flex-col sm:flex-row gap-4 justify-center items-center'>
            <a
              href={`mailto:${t('contact.email')}`}
              className='bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 shadow-lg hover:shadow-xl'
            >
              {t('contact.cta')}
            </a>
            <p className='text-gray-500'>{t('contact.email')}</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className='bg-gray-900 text-white py-8'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center'>
          <p className='text-gray-400'>
            © 2025 University Application Tracker. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
