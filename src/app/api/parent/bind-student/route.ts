import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';
import { requirePermission } from '../../../../lib/auth';
import { UserRole, User } from '../../../../types';

// 家长绑定学生
export async function POST(request: NextRequest) {
  try {
    console.log('Parent bind student API called');

    // 权限检查
    const authResult = await requirePermission(
      'parentStudents',
      'create'
    )(request);
    if (authResult) return authResult;

    const user = (request as unknown as { user: User }).user;
    console.log('User authenticated:', { id: user.id, role: user.role });

    // 家长只能绑定学生
    if (user.role !== UserRole.PARENT) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }

    const body = await request.json();
    const { studentId } = body;

    if (!studentId) {
      return NextResponse.json(
        { error: 'Student ID is required' },
        { status: 400 }
      );
    }

    // 验证学生是否存在
    const student = await prisma.student.findUnique({
      where: { id: studentId },
    });

    if (!student) {
      return NextResponse.json({ error: 'Student not found' }, { status: 400 });
    }

    // 检查是否已经绑定
    const existingBinding = await prisma.parentStudent.findFirst({
      where: {
        parentId: user.id,
        studentId: studentId,
      },
    });

    if (existingBinding) {
      return NextResponse.json(
        { error: 'Student already bound to this parent' },
        { status: 400 }
      );
    }

    // 创建绑定关系
    const binding = await prisma.parentStudent.create({
      data: {
        parentId: user.id,
        studentId: studentId,
      },
    });

    return NextResponse.json(
      {
        message: 'Student bound successfully',
        binding: {
          id: binding.id,
          parentId: binding.parentId,
          studentId: binding.studentId,
          createdAt: binding.createdAt.toISOString(),
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Bind student error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// 家长查看已绑定的学生列表
export async function GET(request: NextRequest) {
  try {
    // 权限检查
    const authResult = await requirePermission(
      'parentStudents',
      'read'
    )(request);
    if (authResult) return authResult;

    const user = (request as unknown as { user: User }).user;

    // 家长只能查看自己的绑定关系
    if (user.role !== UserRole.PARENT) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }

    const bindings = await prisma.parentStudent.findMany({
      where: { parentId: user.id },
      include: {
        student: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(
      bindings.map((binding) => ({
        id: binding.id,
        parentId: binding.parentId,
        studentId: binding.studentId,
        createdAt: binding.createdAt.toISOString(),
        student: binding.student
          ? {
              id: binding.student.id,
              name: binding.student.name,
              email: binding.student.email,
              gpa: binding.student.gpa,
              satScore: binding.student.satScore,
              actScore: binding.student.actScore,
            }
          : null,
      }))
    );
  } catch (error) {
    console.error('Get bindings error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// 家长解绑学生
export async function DELETE(request: NextRequest) {
  try {
    // 权限检查
    const authResult = await requirePermission(
      'parentStudents',
      'delete'
    )(request);
    if (authResult) return authResult;

    const user = (request as unknown as { user: User }).user;

    // 家长只能解绑自己的绑定关系
    if (user.role !== UserRole.PARENT) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }

    const body = await request.json();
    const { bindingId } = body;

    if (!bindingId) {
      return NextResponse.json(
        { error: 'Binding ID is required' },
        { status: 400 }
      );
    }

    // 验证绑定关系是否存在且属于当前用户
    const binding = await prisma.parentStudent.findFirst({
      where: {
        id: bindingId,
        parentId: user.id,
      },
    });

    if (!binding) {
      return NextResponse.json({ error: 'Binding not found' }, { status: 404 });
    }

    // 删除绑定关系
    await prisma.parentStudent.delete({
      where: { id: bindingId },
    });

    return NextResponse.json(
      { message: 'Student unbound successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Unbind student error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
