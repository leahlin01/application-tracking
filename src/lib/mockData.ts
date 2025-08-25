import {
  University,
  Application,
  Student,
  ApplicationType,
  ApplicationStatus,
  DecisionType,
} from '@/types';

// 模拟学生数据
export const mockStudent: Student = {
  id: 'demo-student-id',
  name: '张三',
  email: 'zhangsan@example.com',
  graduationYear: 2025,
  gpa: 3.8,
  satScore: 1450,
  actScore: 32,
  targetCountries: ['United States', 'Canada'],
  intendedMajors: ['Computer Science', 'Engineering'],
  createdAt: '2024-01-01T00:00:00Z',
  updatedAt: '2024-01-01T00:00:00Z',
};

// 模拟大学数据
export const mockUniversities: University[] = [
  {
    id: '1',
    name: 'Harvard University',
    country: 'United States',
    state: 'Massachusetts',
    city: 'Cambridge',
    usNewsRanking: 1,
    acceptanceRate: 0.05,
    applicationSystem: 'Common App',
    tuitionInState: 52000,
    tuitionOutState: 52000,
    applicationFee: 75,
    deadlines: {
      early_decision: '2024-11-01',
      regular: '2025-01-01',
    },
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: '2',
    name: 'Stanford University',
    country: 'United States',
    state: 'California',
    city: 'Stanford',
    usNewsRanking: 2,
    acceptanceRate: 0.04,
    applicationSystem: 'Common App',
    tuitionInState: 56000,
    tuitionOutState: 56000,
    applicationFee: 90,
    deadlines: {
      early_action: '2024-11-01',
      regular: '2025-01-02',
    },
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: '3',
    name: 'Massachusetts Institute of Technology',
    country: 'United States',
    state: 'Massachusetts',
    city: 'Cambridge',
    usNewsRanking: 3,
    acceptanceRate: 0.07,
    applicationSystem: 'Common App',
    tuitionInState: 55000,
    tuitionOutState: 55000,
    applicationFee: 75,
    deadlines: {
      early_action: '2024-11-01',
      regular: '2025-01-01',
    },
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: '4',
    name: 'University of California, Berkeley',
    country: 'United States',
    state: 'California',
    city: 'Berkeley',
    usNewsRanking: 15,
    acceptanceRate: 0.15,
    applicationSystem: 'Common App',
    tuitionInState: 14000,
    tuitionOutState: 44000,
    applicationFee: 70,
    deadlines: {
      regular: '2024-11-30',
    },
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: '5',
    name: 'University of Toronto',
    country: 'Canada',
    state: 'Ontario',
    city: 'Toronto',
    usNewsRanking: 18,
    acceptanceRate: 0.43,
    applicationSystem: 'Direct',
    tuitionInState: 6000,
    tuitionOutState: 45000,
    applicationFee: 180,
    deadlines: {
      regular: '2025-01-15',
    },
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: '6',
    name: 'University of British Columbia',
    country: 'Canada',
    state: 'British Columbia',
    city: 'Vancouver',
    usNewsRanking: 35,
    acceptanceRate: 0.52,
    applicationSystem: 'Direct',
    tuitionInState: 5500,
    tuitionOutState: 42000,
    applicationFee: 125,
    deadlines: {
      regular: '2025-01-15',
    },
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: '7',
    name: 'New York University',
    country: 'United States',
    state: 'New York',
    city: 'New York',
    usNewsRanking: 25,
    acceptanceRate: 0.16,
    applicationSystem: 'Common App',
    tuitionInState: 56000,
    tuitionOutState: 56000,
    applicationFee: 80,
    deadlines: {
      early_decision: '2024-11-01',
      regular: '2025-01-01',
    },
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: '8',
    name: 'University of Michigan',
    country: 'United States',
    state: 'Michigan',
    city: 'Ann Arbor',
    usNewsRanking: 23,
    acceptanceRate: 0.23,
    applicationSystem: 'Common App',
    tuitionInState: 16000,
    tuitionOutState: 52000,
    applicationFee: 75,
    deadlines: {
      early_action: '2024-11-01',
      regular: '2025-02-01',
    },
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
];

// 模拟申请数据
export const mockApplications: Application[] = [
  {
    id: '1',
    studentId: 'demo-student-id',
    universityId: '1',
    applicationType: ApplicationType.EARLY_DECISION,
    deadline: '2024-11-01T00:00:00Z',
    status: ApplicationStatus.IN_PROGRESS,
    notes: '需要准备补充材料',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
    university: mockUniversities[0],
  },
  {
    id: '2',
    studentId: 'demo-student-id',
    universityId: '2',
    applicationType: ApplicationType.EARLY_ACTION,
    deadline: '2024-11-01T00:00:00Z',
    status: ApplicationStatus.NOT_STARTED,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
    university: mockUniversities[1],
  },
  {
    id: '3',
    studentId: 'demo-student-id',
    universityId: '3',
    applicationType: ApplicationType.REGULAR_DECISION,
    deadline: '2025-01-01T00:00:00Z',
    status: ApplicationStatus.NOT_STARTED,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
    university: mockUniversities[2],
  },
  {
    id: '4',
    studentId: 'demo-student-id',
    universityId: '4',
    applicationType: ApplicationType.REGULAR_DECISION,
    deadline: '2024-11-30T00:00:00Z',
    status: ApplicationStatus.SUBMITTED,
    submittedDate: '2024-11-25T00:00:00Z',
    decisionType: DecisionType.ACCEPTED,
    decisionDate: '2025-03-15T00:00:00Z',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
    university: mockUniversities[3],
  },
];

// 内存存储
let applications = [...mockApplications];
const universities = [...mockUniversities];

// 大学筛选器类型
interface UniversityFilters {
  search?: string;
  country?: string;
  state?: string;
  system?: string;
  ranking?: boolean;
}

// 申请创建数据类型
interface CreateApplicationData {
  studentId: string;
  universityId: string;
  applicationType: ApplicationType;
  deadline: string;
  notes?: string;
}

// 申请更新数据类型
interface UpdateApplicationData {
  status?: ApplicationStatus;
  submittedDate?: string;
  decisionType?: DecisionType;
  decisionDate?: string;
  notes?: string;
}

// 模拟API函数
export const mockAPI = {
  // 大学相关
  getUniversities: (filters?: UniversityFilters) => {
    let filtered = [...universities];

    if (filters?.search) {
      const search = filters.search.toLowerCase();
      filtered = filtered.filter(
        (u) =>
          u.name.toLowerCase().includes(search) ||
          u.city.toLowerCase().includes(search) ||
          (u.state && u.state.toLowerCase().includes(search))
      );
    }

    if (filters?.country) {
      filtered = filtered.filter((u) => u.country === filters.country);
    }

    if (filters?.state) {
      filtered = filtered.filter((u) => u.state === filters.state);
    }

    if (filters?.system) {
      filtered = filtered.filter((u) => u.applicationSystem === filters.system);
    }

    if (filters?.ranking) {
      filtered.sort(
        (a, b) => (a.usNewsRanking || 999) - (b.usNewsRanking || 999)
      );
    } else {
      filtered.sort((a, b) => a.name.localeCompare(b.name));
    }

    return filtered.slice(0, 50);
  },

  // 申请相关
  getApplications: (studentId: string) => {
    return applications.filter((app) => app.studentId === studentId);
  },

  createApplication: (data: CreateApplicationData) => {
    const university = universities.find((u) => u.id === data.universityId);
    const newApplication: Application = {
      id: Date.now().toString(),
      ...data,
      status: ApplicationStatus.NOT_STARTED,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      university,
    };
    applications.push(newApplication);
    return newApplication;
  },

  updateApplication: (id: string, updates: UpdateApplicationData) => {
    const index = applications.findIndex((app) => app.id === id);
    if (index !== -1) {
      applications[index] = {
        ...applications[index],
        ...updates,
        updatedAt: new Date().toISOString(),
      };
      return applications[index];
    }
    return null;
  },

  deleteApplication: (id: string) => {
    const index = applications.findIndex((app) => app.id === id);
    if (index !== -1) {
      applications.splice(index, 1);
      return true;
    }
    return false;
  },

  // 初始化数据
  initializeData: () => {
    applications = [...mockApplications];
    return {
      message: '示例数据初始化成功',
      applications: applications.length,
      universities: universities.length,
    };
  },
};
