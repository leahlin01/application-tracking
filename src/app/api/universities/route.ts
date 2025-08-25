import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// 获取大学列表
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const country = searchParams.get('country');
    const state = searchParams.get('state');
    const ranking = searchParams.get('ranking');
    const system = searchParams.get('system');
    const search = searchParams.get('search');

    const where: {
      country?: string;
      state?: string;
      applicationSystem?: string;
      OR?: Array<{
        name?: { contains: string; mode: 'insensitive' };
        city?: { contains: string; mode: 'insensitive' };
        state?: { contains: string; mode: 'insensitive' };
      }>;
    } = {};

    if (country) where.country = country;
    if (state) where.state = state;
    if (system) where.applicationSystem = system;
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { city: { contains: search, mode: 'insensitive' } },
        { state: { contains: search, mode: 'insensitive' } },
      ];
    }

    const universities = await prisma.university.findMany({
      where,
      orderBy: ranking === 'true' ? { usNewsRanking: 'asc' } : { name: 'asc' },
      take: 50,
    });

    return NextResponse.json(universities);
  } catch (error) {
    console.error('获取大学列表失败:', error);
    return NextResponse.json({ error: '获取大学列表失败' }, { status: 500 });
  }
}

// 创建新大学
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      name,
      country,
      state,
      city,
      usNewsRanking,
      acceptanceRate,
      applicationSystem,
      tuitionInState,
      tuitionOutState,
      applicationFee,
      deadlines,
    } = body;

    const university = await prisma.university.create({
      data: {
        name,
        country,
        state,
        city,
        usNewsRanking: usNewsRanking ? parseInt(usNewsRanking) : null,
        acceptanceRate: acceptanceRate ? parseFloat(acceptanceRate) : null,
        applicationSystem,
        tuitionInState: tuitionInState ? parseFloat(tuitionInState) : null,
        tuitionOutState: tuitionOutState ? parseFloat(tuitionOutState) : null,
        applicationFee: applicationFee ? parseFloat(applicationFee) : null,
        deadlines,
      },
    });

    return NextResponse.json(university, { status: 201 });
  } catch (error) {
    console.error('创建大学失败:', error);
    return NextResponse.json({ error: '创建大学失败' }, { status: 500 });
  }
}
