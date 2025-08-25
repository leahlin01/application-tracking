import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';
import { hashPassword, generateToken } from '../../../../lib/auth';
import { RegisterRequest, UserRole } from '../../../../types';

export async function POST(request: NextRequest) {
  try {
    const body: RegisterRequest = await request.json();
    const { email, password, role, studentId, studentIds } = body;

    // 验证输入
    if (!email || !password || !role) {
      return NextResponse.json(
        { error: 'Email, password, and role are required' },
        { status: 400 }
      );
    }

    // 检查邮箱是否已存在
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'Email already exists' },
        { status: 400 }
      );
    }

    // 如果角色是学生，验证studentId
    if (role === UserRole.STUDENT && studentId) {
      const student = await prisma.student.findUnique({
        where: { id: studentId },
      });

      if (!student) {
        return NextResponse.json(
          { error: 'Student not found' },
          { status: 400 }
        );
      }

      // 检查该学生是否已经有用户账户
      const existingStudentUser = await prisma.user.findUnique({
        where: { studentId },
      });

      if (existingStudentUser) {
        return NextResponse.json(
          { error: 'Student already has a user account' },
          { status: 400 }
        );
      }
    }

    // 如果角色是家长，暂时不需要验证studentIds（注册后通过绑定功能关联）

    // 加密密码
    const hashedPassword = await hashPassword(password);

    // 创建用户
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        role,
        studentId: role === UserRole.STUDENT ? studentId : null,
      },
      include: { student: true },
    });

    // 如果角色是家长，暂时不创建关联（注册后通过绑定功能关联）

    // 生成JWT token
    const token = generateToken({
      userId: user.id,
      email: user.email,
      role: user.role as UserRole,
      studentId: user.studentId || undefined,
    });

    // 返回用户信息和token（不包含密码）
    const { password: _, ...userWithoutPassword } = user;

    return NextResponse.json(
      {
        user: {
          ...userWithoutPassword,
          createdAt: user.createdAt.toISOString(),
          updatedAt: user.updatedAt.toISOString(),
          student: user.student
            ? {
                ...user.student,
                createdAt: user.student.createdAt.toISOString(),
                updatedAt: user.student.updatedAt.toISOString(),
              }
            : null,
        },
        token,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
