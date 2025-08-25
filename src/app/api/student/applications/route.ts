import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';
import { requirePermission, authenticateUser } from '../../../../lib/auth';
import { UserRole } from '../../../../types';

// 获取学生的申请列表
export async function GET(request: NextRequest) {
  try {
    // 权限检查
    const authResult = await requirePermission('applications', 'read')(request);
    if (authResult) return authResult;

    const user = (request as unknown as { user: any }).user;

    // 学生只能查看自己的申请
    if (user.role === UserRole.STUDENT && !user.studentId) {
      return NextResponse.json(
        { error: 'Student profile not found' },
        { status: 400 }
      );
    }

    const applications = await prisma.application.findMany({
      where: {
        studentId: user.role === UserRole.STUDENT ? user.studentId : undefined,
      },
      include: {
        student: true,
        university: true,
        requirements: true,
        parentNotes: {
          include: {
            parent: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(
      applications.map((app) => ({
        ...app,
        createdAt: app.createdAt.toISOString(),
        updatedAt: app.updatedAt.toISOString(),
        deadline: app.deadline.toISOString(),
        submittedDate: app.submittedDate?.toISOString(),
        decisionDate: app.decisionDate?.toISOString(),
        student: app.student
          ? {
              ...app.student,
              createdAt: app.student.createdAt.toISOString(),
              updatedAt: app.student.updatedAt.toISOString(),
            }
          : null,
        university: {
          ...app.university,
          createdAt: app.university.createdAt.toISOString(),
          updatedAt: app.university.updatedAt.toISOString(),
        },
        requirements: app.requirements.map((req) => ({
          ...req,
          createdAt: req.createdAt.toISOString(),
          updatedAt: req.updatedAt.toISOString(),
          deadline: req.deadline?.toISOString(),
        })),
        parentNotes: app.parentNotes.map((note) => ({
          ...note,
          createdAt: note.createdAt.toISOString(),
          updatedAt: note.updatedAt.toISOString(),
          parent: {
            id: note.parent.id,
            email: note.parent.email,
            role: note.parent.role,
          },
        })),
      }))
    );
  } catch (error) {
    console.error('Get applications error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// 创建新申请
export async function POST(request: NextRequest) {
  try {
    // 权限检查
    const authResult = await requirePermission(
      'applications',
      'create'
    )(request);
    if (authResult) return authResult;

    const user = (request as unknown as { user: any }).user;
    const body = await request.json();

    // 学生只能为自己创建申请
    if (user.role === UserRole.STUDENT && !user.studentId) {
      return NextResponse.json(
        { error: 'Student profile not found' },
        { status: 400 }
      );
    }

    const application = await prisma.application.create({
      data: {
        ...body,
        studentId:
          user.role === UserRole.STUDENT ? user.studentId : body.studentId,
        deadline: new Date(body.deadline),
      },
      include: {
        student: true,
        university: true,
      },
    });

    return NextResponse.json(
      {
        ...application,
        createdAt: application.createdAt.toISOString(),
        updatedAt: application.updatedAt.toISOString(),
        deadline: application.deadline.toISOString(),
        student: application.student
          ? {
              ...application.student,
              createdAt: application.student.createdAt.toISOString(),
              updatedAt: application.student.updatedAt.toISOString(),
            }
          : null,
        university: {
          ...application.university,
          createdAt: application.university.createdAt.toISOString(),
          updatedAt: application.university.updatedAt.toISOString(),
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Create application error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
