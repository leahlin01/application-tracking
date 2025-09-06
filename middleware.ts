import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import createIntlMiddleware from 'next-intl/middleware';
import { verifyToken } from './src/lib/auth';

const intlMiddleware = createIntlMiddleware({
  locales: ['zh', 'en', 'ja'],
  defaultLocale: 'zh',
});

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 跳过静态资源和API认证路由
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api/auth') ||
    pathname.includes('.') ||
    pathname === '/favicon.ico'
  ) {
    return NextResponse.next();
  }

  // 首先处理国际化路由
  const intlResponse = intlMiddleware(request);

  // 获取处理后的路径名（包含locale）
  const url = new URL(request.url);
  const locale = pathname.split('/')[1];
  const isValidLocale = ['zh', 'en', 'ja'].includes(locale);

  // 定义公开路径（需要包含locale前缀）
  const publicPaths = ['/welcome', '/auth', '/role-selection'];
  const isPublicPath = publicPaths.some((path) => {
    if (isValidLocale) {
      return pathname.startsWith(`/${locale}${path}`);
    }
    return pathname.startsWith(path);
  });

  // 如果是公开路径，直接返回国际化处理结果
  if (isPublicPath) {
    return intlResponse;
  }

  // 主页面保护 - 需要认证才能访问
  const isHomePage =
    pathname === '/' || (isValidLocale && pathname === `/${locale}`);

  if (isHomePage) {
    // 从Authorization header或cookie中获取token
    let token = request.headers.get('authorization')?.replace('Bearer ', '');

    if (!token) {
      // 尝试从cookie中获取token
      token = request.cookies.get('auth-token')?.value;
    }

    // 检查用户是否已认证
    if (!token) {
      const clientIP =
        request.headers.get('x-forwarded-for') ||
        request.headers.get('x-real-ip') ||
        'unknown';
      console.log(
        `Unauthorized home page access attempt: ${pathname} from ${clientIP}`
      );

      // 重定向到对应locale的welcome页面
      const welcomeUrl = isValidLocale ? `/${locale}/welcome` : '/zh/welcome';
      return NextResponse.redirect(new URL(welcomeUrl, request.url));
    }

    // 验证token
    const payload = verifyToken(token);
    if (!payload) {
      console.log(`Invalid token home page access: ${pathname}`);

      // 重定向到对应locale的welcome页面并清除无效cookie
      const welcomeUrl = isValidLocale ? `/${locale}/welcome` : '/zh/welcome';
      const response = NextResponse.redirect(new URL(welcomeUrl, request.url));
      response.cookies.delete('auth-token');
      return response;
    }

    // 添加用户信息到请求头，供后续组件使用
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set('x-user-id', payload.userId);
    requestHeaders.set('x-user-role', payload.role);
    requestHeaders.set('x-user-email', payload.email || '');

    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  }

  // 对于其他路径，返回国际化处理结果
  return intlResponse;
}

export const config = {
  matcher: [
    /*
     * 匹配所有路径除了:
     * - api/auth (NextAuth.js routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (public folder)
     */
    '/((?!api/auth|_next/static|_next/image|favicon.ico|public).*)',
  ],
};
