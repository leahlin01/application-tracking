import createMiddleware from 'next-intl/middleware';
import { NextRequest } from 'next/server';

const intlMiddleware = createMiddleware({
  locales: ['en', 'zh'],
  defaultLocale: 'en',
});

export default function middleware(request: NextRequest) {
  console.log('Middleware called for:', request.nextUrl.pathname);
  console.log('Request URL:', request.url);

  return intlMiddleware(request);
}

export const config = {
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'],
};
