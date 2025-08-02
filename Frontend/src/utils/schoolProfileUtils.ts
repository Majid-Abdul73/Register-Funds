import { School } from '../types/school';
import { SchoolData } from '../types/schoolProfile';

// Helper function to convert School API data to SchoolData format
export const convertSchoolToSchoolData = (school: School & {
  addressLine1?: string;
  addressLine2?: string;
  digitalAddress?: string;
  district?: string;
  postalAddress?: string;
}): SchoolData => ({
  schoolName: school.schoolName,
  schoolType: school.schoolType,
  addressLine1: school.addressLine1 || '',
  addressLine2: school.addressLine2 || '',
  digitalAddress: school.digitalAddress || '',
  city: school.city,
  district: school.district || '',
  country: school.country,
  email: school.email,
  phone: school.phone,
  postalAddress: school.postalAddress || ''
});

// Helper function to convert SchoolData to School API format
export const convertSchoolDataToSchool = (schoolData: SchoolData): Partial<School> & {
  addressLine1?: string;
  addressLine2?: string;
  digitalAddress?: string;
  district?: string;
  postalAddress?: string;
} => ({
  schoolName: schoolData.schoolName,
  schoolType: schoolData.schoolType,
  addressLine1: schoolData.addressLine1,
  addressLine2: schoolData.addressLine2,
  digitalAddress: schoolData.digitalAddress,
  city: schoolData.city,
  district: schoolData.district,
  country: schoolData.country,
  email: schoolData.email,
  phone: schoolData.phone,
  postalAddress: schoolData.postalAddress
});