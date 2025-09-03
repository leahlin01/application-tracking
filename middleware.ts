import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyToken } from './src/lib/auth';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 跳过静态资源、API认证路由和公开页面
  const publicPaths = ['/welcome', '/auth', '/role-selection'];
  const isPublicPath = publicPaths.some((path) => pathname.startsWith(path));

  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api/auth') ||
    pathname.includes('.') ||
    pathname === '/favicon.ico' ||
    isPublicPath
  ) {
    return NextResponse.next();
  }

  // 主页面保护 - 需要认证才能访问
  if (pathname === '/') {
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

      return NextResponse.redirect(new URL('/welcome', request.url));
    }

    // 验证token
    const payload = verifyToken(token);
    if (!payload) {
      console.log(`Invalid token home page access: ${pathname}`);

      const response = NextResponse.redirect(new URL('/welcome', request.url));
      // 清除无效的认证cookie
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

  return NextResponse.next();
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
