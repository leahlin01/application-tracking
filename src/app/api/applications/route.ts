import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { ApplicationStatus } from '@/types';

// 获取申请列表
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const studentId = searchParams.get('studentId');
    const statusParam = searchParams.get('status');

    if (!studentId) {
      return NextResponse.json({ error: '需要提供学生ID' }, { status: 400 });
    }

    const where: {
      studentId: string;
      status?: ApplicationStatus;
    } = {
      studentId,
    };

    // 验证status参数是否为有效的ApplicationStatus枚举值
    if (
      statusParam &&
      Object.values(ApplicationStatus).includes(
        statusParam as ApplicationStatus
      )
    ) {
      where.status = statusParam as ApplicationStatus;
    }

    const applications = await prisma.application.findMany({
      where,
      include: {
        university: true,
        requirements: true,
      },
      orderBy: { deadline: 'asc' },
    });

    return NextResponse.json(applications);
  } catch (error) {
    console.error('获取申请列表失败:', error);
    return NextResponse.json({ error: '获取申请列表失败' }, { status: 500 });
  }
}

// 创建新申请
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { studentId, universityId, applicationType, deadline, notes } = body;

    const application = await prisma.application.create({
      data: {
        studentId,
        universityId,
        applicationType,
        deadline: new Date(deadline),
        notes,
      },
      include: {
        university: true,
        requirements: true,
      },
    });

    return NextResponse.json(application, { status: 201 });
  } catch (error) {
    console.error('创建申请失败:', error);
    return NextResponse.json({ error: '创建申请失败' }, { status: 500 });
  }
}
