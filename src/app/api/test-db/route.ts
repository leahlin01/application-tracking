import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    // 测试数据库连接
    await prisma.$connect();

    // 测试基本查询
    const studentCount = await prisma.student.count();
    const universityCount = await prisma.university.count();
    const applicationCount = await prisma.application.count();

    await prisma.$disconnect();

    return NextResponse.json({
      success: true,
      message: '数据库连接正常',
      counts: {
        students: studentCount,
        universities: universityCount,
        applications: applicationCount,
      },
      databaseUrl: process.env.DATABASE_URL ? '已配置' : '未配置',
    });
  } catch (error) {
    console.error('数据库连接测试失败:', error);

    let errorMessage = '数据库连接失败';
    let details = '';

    if (error instanceof Error) {
      if (error.message.includes('ECONNREFUSED')) {
        errorMessage = '无法连接到数据库服务器';
        details = '请检查数据库服务是否正在运行';
      } else if (error.message.includes('authentication failed')) {
        errorMessage = '数据库认证失败';
        details = '请检查数据库用户名和密码';
      } else if (error.message.includes('does not exist')) {
        errorMessage = '数据库不存在';
        details = '请检查数据库名称是否正确';
      } else if (error.message.includes('DATABASE_URL')) {
        errorMessage = '数据库连接字符串未配置';
        details = '请检查环境变量 DATABASE_URL';
      } else {
        details = error.message;
      }
    }

    return NextResponse.json(
      {
        success: false,
        error: errorMessage,
        details,
        stack:
          process.env.NODE_ENV === 'development'
            ? error instanceof Error
              ? error.stack
              : undefined
            : undefined,
      },
      { status: 500 }
    );
  }
}
