export interface Student {
  id: string;
  name: string;
  email: string;
  graduationYear: number;
  gpa?: number;
  satScore?: number;
  actScore?: number;
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

export enum ApplicationType {
  EARLY_DECISION = 'EARLY_DECISION',
  EARLY_ACTION = 'EARLY_ACTION',
  REGULAR_DECISION = 'REGULAR_DECISION',
  ROLLING_ADMISSION = 'ROLLING_ADMISSION',
}

export enum ApplicationStatus {
  NOT_STARTED = 'NOT_STARTED',
  IN_PROGRESS = 'IN_PROGRESS',
  SUBMITTED = 'SUBMITTED',
  UNDER_REVIEW = 'UNDER_REVIEW',
  DECIDED = 'DECIDED',
}

export enum DecisionType {
  ACCEPTED = 'ACCEPTED',
  REJECTED = 'REJECTED',
  WAITLISTED = 'WAITLISTED',
  DEFERRED = 'DEFERRED',
}

export enum RequirementType {
  ESSAY = 'ESSAY',
  RECOMMENDATION = 'RECOMMENDATION',
  TRANSCRIPT = 'TRANSCRIPT',
  TEST_SCORES = 'TEST_SCORES',
  PORTFOLIO = 'PORTFOLIO',
  INTERVIEW = 'INTERVIEW',
  SUPPLEMENTAL_MATERIALS = 'SUPPLEMENTAL_MATERIALS',
}

export enum RequirementStatus {
  NOT_STARTED = 'NOT_STARTED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  WAIVED = 'WAIVED',
}

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
