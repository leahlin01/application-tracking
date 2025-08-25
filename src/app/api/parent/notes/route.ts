import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';
import { requirePermission } from '../../../../lib/auth';
import { UserRole } from '../../../../types';

// 获取家长备注列表
export async function GET(request: NextRequest) {
  try {
    // 权限检查
    const authResult = await requirePermission('parentNotes', 'read')(request);
    if (authResult) return authResult;

    const user = (request as unknown as { user: any }).user;

    if (user.role !== UserRole.PARENT) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }

    const notes = await prisma.parentNote.findMany({
      where: {
        parentId: user.id,
      },
      include: {
        application: {
          include: {
            student: true,
            university: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(
      notes.map((note) => ({
        ...note,
        createdAt: note.createdAt.toISOString(),
        updatedAt: note.updatedAt.toISOString(),
        application: note.application
          ? {
              ...note.application,
              createdAt: note.application.createdAt.toISOString(),
              updatedAt: note.application.updatedAt.toISOString(),
              deadline: note.application.deadline.toISOString(),
              submittedDate: note.application.submittedDate?.toISOString(),
              decisionDate: note.application.decisionDate?.toISOString(),
              student: note.application.student
                ? {
                    ...note.application.student,
                    createdAt: note.application.student.createdAt.toISOString(),
                    updatedAt: note.application.student.updatedAt.toISOString(),
                  }
                : null,
              university: {
                ...note.application.university,
                createdAt: note.application.university.createdAt.toISOString(),
                updatedAt: note.application.university.updatedAt.toISOString(),
              },
            }
          : null,
      }))
    );
  } catch (error) {
    console.error('Get parent notes error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// 创建家长备注
export async function POST(request: NextRequest) {
  try {
    // 权限检查
    const authResult = await requirePermission(
      'parentNotes',
      'create'
    )(request);
    if (authResult) return authResult;

    const user = (request as unknown as { user: any }).user;
    const body = await request.json();

    if (user.role !== UserRole.PARENT) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }

    // 验证申请是否存在
    const application = await prisma.application.findUnique({
      where: { id: body.applicationId },
    });

    if (!application) {
      return NextResponse.json(
        { error: 'Application not found' },
        { status: 404 }
      );
    }

    const note = await prisma.parentNote.create({
      data: {
        applicationId: body.applicationId,
        parentId: user.id,
        content: body.content,
      },
      include: {
        application: {
          include: {
            student: true,
            university: true,
          },
        },
      },
    });

    return NextResponse.json(
      {
        ...note,
        createdAt: note.createdAt.toISOString(),
        updatedAt: note.updatedAt.toISOString(),
        application: note.application
          ? {
              ...note.application,
              createdAt: note.application.createdAt.toISOString(),
              updatedAt: note.application.updatedAt.toISOString(),
              deadline: note.application.deadline.toISOString(),
              submittedDate: note.application.submittedDate?.toISOString(),
              decisionDate: note.application.decisionDate?.toISOString(),
              student: note.application.student
                ? {
                    ...note.application.student,
                    createdAt: note.application.student.createdAt.toISOString(),
                    updatedAt: note.application.student.updatedAt.toISOString(),
                  }
                : null,
              university: {
                ...note.application.university,
                createdAt: note.application.university.createdAt.toISOString(),
                updatedAt: note.application.university.updatedAt.toISOString(),
              },
            }
          : null,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Create parent note error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
