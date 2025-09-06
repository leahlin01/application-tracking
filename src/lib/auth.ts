import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from './prisma';
import { User, UserRole, JwtPayload, Permission } from '../types';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const JWT_EXPIRES_IN = '7d';

// JWT工具函数
export const generateToken = (payload: JwtPayload): string => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
};

export const verifyToken = (token: string): JwtPayload | null => {
  try {
    return jwt.verify(token, JWT_SECRET) as JwtPayload;
  } catch (error) {
    return null;
  }
};

// 密码工具函数
export const hashPassword = async (password: string): Promise<string> => {
  return bcrypt.hash(password, 12);
};

export const comparePassword = async (
  password: string,
  hashedPassword: string
): Promise<boolean> => {
  return bcrypt.compare(password, hashedPassword);
};

// 权限配置
export const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  [UserRole.STUDENT]: [
    { resource: 'applications', action: 'create' },
    {
      resource: 'applications',
      action: 'read',
      conditions: { studentId: 'self' },
    },
    {
      resource: 'applications',
      action: 'update',
      conditions: { studentId: 'self' },
    },
    {
      resource: 'applications',
      action: 'delete',
      conditions: { studentId: 'self' },
    },
    { resource: 'profile', action: 'read', conditions: { studentId: 'self' } },
    {
      resource: 'profile',
      action: 'update',
      conditions: { studentId: 'self' },
    },
  ],
  [UserRole.PARENT]: [
    {
      resource: 'applications',
      action: 'read',
      conditions: { studentId: 'children' },
    },
    { resource: 'parentNotes', action: 'create' },
    {
      resource: 'parentNotes',
      action: 'read',
      conditions: { parentId: 'self' },
    },
    {
      resource: 'parentNotes',
      action: 'update',
      conditions: { parentId: 'self' },
    },
    {
      resource: 'parentNotes',
      action: 'delete',
      conditions: { parentId: 'self' },
    },
    {
      resource: 'parentStudents',
      action: 'read',
      conditions: { parentId: 'self' },
    },
    { resource: 'parentStudents', action: 'create' },
    {
      resource: 'parentStudents',
      action: 'delete',
      conditions: { parentId: 'self' },
    },
  ],
};

// 权限检查函数
export const hasPermission = (
  user: User,
  resource: string,
  action: string,
  context?: Record<string, unknown>
): boolean => {
  const permissions = ROLE_PERMISSIONS[user.role];

  // 管理员拥有所有权限（暂时注释掉）
  // if (user.role === UserRole.ADMIN) {
  //   return true;
  // }

  // 检查是否有匹配的权限
  const permission = permissions.find(
    (p) =>
      (p.resource === resource || p.resource === '*') &&
      (p.action === action || p.action === '*')
  );

  if (!permission) {
    return false;
  }

  // 检查条件
  if (permission.conditions && context) {
    for (const [key, value] of Object.entries(permission.conditions)) {
      if (value === 'self' && context[key] !== user.id) {
        return false;
      }
      if (
        value === 'children' &&
        !isParentOfStudent(user, context[key] as string)
      ) {
        return false;
      }
      if (value === 'studentId' && context[key] !== user.studentId) {
        return false;
      }
    }
  }

  return true;
};

// 检查家长是否是该学生的家长（简化实现，实际可能需要更复杂的关联）
const isParentOfStudent = (parent: User, studentId: string): boolean => {
  // 这里简化实现，实际可能需要查询家长-学生关联表
  // 暂时假设家长可以访问所有学生信息
  return true;
};

// 认证中间件
export const authenticateUser = async (
  request: NextRequest
): Promise<User | null> => {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '');

    if (!token) {
      return null;
    }

    const payload = verifyToken(token);
    if (!payload) {
      return null;
    }

    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      include: { student: true },
    });

    if (!user) return null;

    // 转换Prisma类型到自定义类型
    return {
      id: user.id,
      email: user.email,
      role: user.role as UserRole,
      studentId: user.studentId || undefined,
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString(),
      student: user.student
        ? {
            id: user.student.id,
            name: user.student.name,
            email: user.student.email,
            graduationYear: user.student.graduationYear,
            gpa: user.student.gpa ? Number(user.student.gpa) : undefined,
            satScore: user.student.satScore,
            actScore: user.student.actScore,
            targetCountries: user.student.targetCountries,
            intendedMajors: user.student.intendedMajors,
            createdAt: user.student.createdAt.toISOString(),
            updatedAt: user.student.updatedAt.toISOString(),
          }
        : undefined,
    };
  } catch (error) {
    return null;
  }
};

// 权限中间件
export const requirePermission = (resource: string, action: string) => {
  return async (request: NextRequest) => {
    const user = await authenticateUser(request);

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!hasPermission(user, resource, action)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // 将用户信息添加到请求中
    (request as unknown as { user: User }).user = user as User;

    return null; // 继续处理请求
  };
};

// 角色检查中间件
export const requireRole = (roles: UserRole[]) => {
  return async (request: NextRequest) => {
    const user = await authenticateUser(request);

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!roles.includes(user.role)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    (request as unknown as { user: User }).user = user as User;

    return null;
  };
};
