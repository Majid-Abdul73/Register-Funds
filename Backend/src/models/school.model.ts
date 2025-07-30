// School type options
export type SchoolType = 'Private' | 'Public';

// Student demographics interface
export interface StudentDemographics {
  male: number;
  female: number;
  total: number;
}

// Teacher demographics interface
export interface TeacherDemographics {
  steamInvolved: number;
  nonSteamInvolved: number;
  total: number;
}

// School interface
export interface School {
  id?: string;
  schoolName: string;
  country: string;
  city: string;
  schoolType: SchoolType | string;
  challenges: string[];
  contactName: string;
  email: string;
  phone: string;
  createdAt: string;
  updatedAt: string;
  students?: StudentDemographics;
  teachers?: TeacherDemographics;
}

// School creation DTO
export interface CreateSchoolDto {
  schoolName: string;
  country: string;
  city: string;
  schoolType: SchoolType | string;
  challenges: string[];
  contactName: string;
  email: string;
  phone: string;
  students?: StudentDemographics;
  teachers?: TeacherDemographics;
}

// School update DTO
export interface UpdateSchoolDto {
  schoolName?: string;
  country?: string;
  city?: string;
  schoolType?: SchoolType | string;
  challenges?: string[];
  contactName?: string;
  email?: string;
  phone?: string;
  students?: StudentDemographics;
  teachers?: TeacherDemographics;
}