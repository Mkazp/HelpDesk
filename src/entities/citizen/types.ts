export type CitizenGender = 'male' | 'female';
export type CitizenSocialStatus =
  | 'employed'
  | 'unemployed'
  | 'retired'
  | 'student'
  | 'vulnerable';
export type CitizenEducationLevel =
  | 'secondary'
  | 'vocational'
  | 'bachelor'
  | 'master'
  | 'phd';
export type CitizenEmploymentStatus =
  | 'employed'
  | 'unemployed'
  | 'self_employed'
  | 'retired'
  | 'student';
export type CitizenFamilyStatus =
  | 'single'
  | 'married'
  | 'divorced'
  | 'widowed'
  | 'with_children';

export interface CitizenFamilyMember {
  id: string;
  fullName: string;
  relation: string;
  birthDate: string;
  age: number;
}

export interface CitizenDocument {
  id: string;
  type: string;
  number: string;
  issuedAt: string;
  expiresAt: string;
  issuer: string;
}

export interface CitizenEducationRecord {
  id: string;
  institution: string;
  degree: string;
  startDate: string;
  endDate?: string | null;
}

export interface CitizenEmploymentRecord {
  id: string;
  organization: string;
  position: string;
  startDate: string;
  endDate?: string | null;
}

export interface Citizen {
  id: string;
  fullName: string;
  birthDate: string;
  age: number;
  gender: CitizenGender;
  phone: string;
  email: string;
  region: string;
  city: string;
  address: string;
  documentNumber: string;
  socialStatus: CitizenSocialStatus;
  educationLevel: CitizenEducationLevel;
  employmentStatus: CitizenEmploymentStatus;
  familyStatus: CitizenFamilyStatus;
  createdAt: string;
  updatedAt: string;
  familyMembers: CitizenFamilyMember[];
  documents: CitizenDocument[];
  requests: string[];
  educationHistory: CitizenEducationRecord[];
  employmentHistory: CitizenEmploymentRecord[];
}

export interface CitizenListFilters {
  page?: number;
  pageSize?: number;
  search?: string;
  status?: CitizenEmploymentStatus | CitizenSocialStatus | string;
  region?: string;
  category?: CitizenEducationLevel | string;
  priority?: CitizenFamilyStatus | string;
  createdFrom?: string;
  createdTo?: string;
  sortBy?: keyof Citizen;
  sortOrder?: 'asc' | 'desc';
}

export interface CitizenUpdateInput {
  fullName: string;
  phone: string;
  email: string;
  region: string;
  city: string;
  address: string;
  socialStatus: CitizenSocialStatus;
  educationLevel: CitizenEducationLevel;
  employmentStatus: CitizenEmploymentStatus;
  familyStatus: CitizenFamilyStatus;
}
