import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// 获取学生列表
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const graduationYear = searchParams.get('graduationYear');
    const search = searchParams.get('search');

    const where: {
      graduationYear?: number;
      OR?: Array<{
        name?: { contains: string; mode: 'insensitive' };
        email?: { contains: string; mode: 'insensitive' };
      }>;
    } = {};

    if (graduationYear) where.graduationYear = parseInt(graduationYear);
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
      ];
    }

    const students = await prisma.student.findMany({
      where,
      include: {
        applications: {
          include: {
            university: true,
          },
        },
      },
      orderBy: { name: 'asc' },
    });

    return NextResponse.json(students);
  } catch (error) {
    console.error('获取学生列表失败:', error);
    return NextResponse.json({ error: '获取学生列表失败' }, { status: 500 });
  }
}

// 创建新学生
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      name,
      email,
      graduationYear,
      gpa,
      satScore,
      actScore,
      targetCountries,
      intendedMajors,
    } = body;

    const student = await prisma.student.create({
      data: {
        name,
        email,
        graduationYear: parseInt(graduationYear),
        gpa: gpa ? parseFloat(gpa) : null,
        satScore: satScore ? parseInt(satScore) : null,
        actScore: actScore ? parseInt(actScore) : null,
        targetCountries: targetCountries || [],
        intendedMajors: intendedMajors || [],
      },
    });

    return NextResponse.json(student, { status: 201 });
  } catch (error) {
    console.error('创建学生失败:', error);
    return NextResponse.json({ error: '创建学生失败' }, { status: 500 });
  }
}
