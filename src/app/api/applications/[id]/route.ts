import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// 获取申请详情
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const application = await prisma.application.findUnique({
      where: { id },
      include: {
        university: true,
        requirements: true,
        student: true,
      },
    });

    if (!application) {
      return NextResponse.json({ error: '申请不存在' }, { status: 404 });
    }

    return NextResponse.json(application);
  } catch (error) {
    console.error('获取申请详情失败:', error);
    return NextResponse.json({ error: '获取申请详情失败' }, { status: 500 });
  }
}

// 更新申请
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const {
      applicationType,
      deadline,
      status,
      submittedDate,
      decisionDate,
      decisionType,
      notes,
    } = body;

    const application = await prisma.application.update({
      where: { id },
      data: {
        applicationType,
        deadline: deadline ? new Date(deadline) : undefined,
        status,
        submittedDate: submittedDate ? new Date(submittedDate) : undefined,
        decisionDate: decisionDate ? new Date(decisionDate) : undefined,
        decisionType,
        notes,
      },
      include: {
        university: true,
        requirements: true,
      },
    });

    return NextResponse.json(application);
  } catch (error) {
    console.error('更新申请失败:', error);
    return NextResponse.json({ error: '更新申请失败' }, { status: 500 });
  }
}

// 删除申请
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await prisma.application.delete({
      where: { id },
    });

    return NextResponse.json({ message: '申请已删除' });
  } catch (error) {
    console.error('删除申请失败:', error);
    return NextResponse.json({ error: '删除申请失败' }, { status: 500 });
  }
}
