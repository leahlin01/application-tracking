import {
  ApplicationType,
  ApplicationStatus,
  DecisionType,
  RequirementType,
  RequirementStatus,
  UserRole,
} from '@prisma/client';

export interface Student {
  id: string;
  name: string;
  email: string;
  graduationYear: number;
  gpa?: number;
  satScore?: number | null;
  actScore?: number | null;
  targetCountries: string[];
  intendedMajors: string[];
  createdAt: string;
  updatedAt: string;
  applications?: Application[];
}

export interface University {
  id: string;
  name: string;
  country: string;
  state?: string;
  city: string;
  usNewsRanking?: number;
  acceptanceRate?: number;
  applicationSystem: string;
  tuitionInState?: number;
  tuitionOutState?: number;
  applicationFee?: number;
  deadlines?: Record<string, string>;
  createdAt: string;
  updatedAt: string;
  applications?: Application[];
}

export interface Application {
  id: string;
  studentId: string;
  universityId: string;
  applicationType: ApplicationType;
  deadline: string;
  status: ApplicationStatus;
  submittedDate?: string;
  decisionDate?: string;
  decisionType?: DecisionType;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  student?: Student;
  university?: University;
  requirements?: ApplicationRequirement[];
  parentNotes?: ParentNote[];
}

export interface ApplicationRequirement {
  id: string;
  applicationId: string;
  requirementType: RequirementType;
  status: RequirementStatus;
  deadline?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  application?: Application;
}

// 使用 Prisma 生成的枚举类型
export {
  ApplicationType,
  ApplicationStatus,
  DecisionType,
  RequirementType,
  RequirementStatus,
  UserRole,
} from '@prisma/client';

export interface ApplicationFormData {
  universityId: string;
  applicationType: ApplicationType;
  deadline: string;
  notes?: string;
}

export interface UniversityFormData {
  name: string;
  country: string;
  state?: string;
  city: string;
  usNewsRanking?: number;
  acceptanceRate?: number;
  applicationSystem: string;
  tuitionInState?: number;
  tuitionOutState?: number;
  applicationFee?: number;
  deadlines?: Record<string, string>;
}

// 新增：用户认证和角色相关类型
export interface User {
  id: string;
  email: string;
  role: UserRole;
  studentId?: string;
  createdAt: string;
  updatedAt: string;
  student?: Student;
}

export interface AuthRequest {
  user: User;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  role: UserRole;
  studentId?: string;
  studentIds?: string[];
}

export interface JwtPayload {
  userId: string;
  email: string;
  role: UserRole;
  studentId?: string;
}

// 权限相关类型
export interface Permission {
  resource: string;
  action: string;
  conditions?: Record<string, unknown>;
}

export interface RolePermissions {
  role: UserRole;
  permissions: Permission[];
}

// 家长-学生关联类型
export interface ParentStudent {
  id: string;
  parentId: string;
  studentId: string;
  createdAt: string;
  updatedAt: string;
  parent?: User;
  student?: Student;
}

// 家长备注类型
export interface ParentNote {
  id: string;
  applicationId: string;
  parentId: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  application?: Application;
  parent?: User;
}
