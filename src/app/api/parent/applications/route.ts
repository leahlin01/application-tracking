import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';
import { requirePermission } from '../../../../lib/auth';
import { UserRole, User } from '../../../../types';

// 家长查看申请列表（只读）
export async function GET(request: NextRequest) {
  try {
    console.log('Parent applications API called');

    // 权限检查
    const authResult = await requirePermission('applications', 'read')(request);
    if (authResult) return authResult;

    const user = (request as unknown as { user: User }).user;
    console.log('User authenticated:', { id: user.id, role: user.role });

    // 家长只能查看申请，不能修改
    if (user.role !== UserRole.PARENT) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }

    // 获取家长关联的学生ID列表
    const parentStudents = await prisma.parentStudent.findMany({
      where: { parentId: user.id },
      select: { studentId: true },
    });

    const studentIds = parentStudents.map((ps) => ps.studentId);

    if (studentIds.length === 0) {
      return NextResponse.json([]);
    }

    // 家长只能查看关联学生的申请
    const applications = await prisma.application.findMany({
      where: {
        studentId: { in: studentIds },
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
        requirements: app.requirements.map((req: any) => ({
          ...req,
          createdAt: req.createdAt.toISOString(),
          updatedAt: req.updatedAt.toISOString(),
          deadline: req.deadline?.toISOString(),
        })),
        parentNotes: app.parentNotes.map((note: any) => ({
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
