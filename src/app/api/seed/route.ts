import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import {
  mockUniversities,
  mockStudent,
  mockApplications,
} from '@/lib/mockData';

export async function POST() {
  try {
    console.log('开始初始化数据库...');

    // 使用事务来确保数据一致性
    const result = await prisma.$transaction(async (tx) => {
      // 清空现有数据
      console.log('清空现有数据...');
      await tx.applicationRequirement.deleteMany();
      await tx.application.deleteMany();
      await tx.student.deleteMany();
      await tx.university.deleteMany();
      await tx.user.deleteMany();

      console.log('现有数据已清空');

      // 创建学生
      console.log('创建学生...');
      const student = await tx.student.create({
        data: {
          id: mockStudent.id,
          name: mockStudent.name,
          email: mockStudent.email,
          graduationYear: mockStudent.graduationYear,
          gpa: mockStudent.gpa,
          satScore: mockStudent.satScore,
          actScore: mockStudent.actScore,
          targetCountries: mockStudent.targetCountries,
          intendedMajors: mockStudent.intendedMajors,
        },
      });

      console.log('学生创建成功:', student.name);

      // 创建大学
      console.log('创建大学...');
      await tx.university.createMany({
        data: mockUniversities.map((uni) => ({
          id: uni.id,
          name: uni.name,
          country: uni.country,
          state: uni.state,
          city: uni.city,
          usNewsRanking: uni.usNewsRanking,
          acceptanceRate: uni.acceptanceRate,
          applicationSystem: uni.applicationSystem,
          tuitionInState: uni.tuitionInState,
          tuitionOutState: uni.tuitionOutState,
          applicationFee: uni.applicationFee,
          deadlines: uni.deadlines,
        })),
        skipDuplicates: true,
      });

      console.log(`大学创建成功`);

      // 创建申请
      console.log('创建申请...');
      await tx.application.createMany({
        data: mockApplications.map((app) => ({
          id: app.id,
          studentId: app.studentId,
          universityId: app.universityId,
          applicationType: app.applicationType,
          deadline: new Date(app.deadline),
          status: app.status,
          submittedDate: app.submittedDate ? new Date(app.submittedDate) : null,
          decisionDate: app.decisionDate ? new Date(app.decisionDate) : null,
          decisionType: app.decisionType,
          notes: app.notes,
        })),
        skipDuplicates: true,
      });

      console.log(`申请创建成功`);

      return {
        student: student.name,
      };
    });

    console.log('数据库初始化完成！', result);

    return NextResponse.json({
      message: '示例数据初始化成功',
      ...result,
    });
  } catch (error) {
    console.error('初始化数据失败:', error);

    // 提供更详细的错误信息
    let errorMessage = '初始化数据失败';
    if (error instanceof Error) {
      if (error.message.includes('Unique constraint')) {
        errorMessage = '数据已存在，请先清空数据库';
      } else if (error.message.includes('Foreign key constraint')) {
        errorMessage = '数据关联错误，请检查数据完整性';
      } else {
        errorMessage = error.message;
      }
    }

    return NextResponse.json(
      {
        error: errorMessage,
        details: error instanceof Error ? error.message : '未知错误',
      },
      { status: 500 }
    );
  }
}
