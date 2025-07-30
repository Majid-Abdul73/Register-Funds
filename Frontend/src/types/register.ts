export interface FormData {
  schoolName: string;
  country: string;
  city: string;
  schoolType: string;
  // Address fields for step 2
  addressLine1: string;
  addressLine2: string;
  digitalAddress: string;
  townCity: string;
  districtRegion: string;
  postalAddress: string;
  schoolEmail: string;
  schoolContactNumber: string;
  // Other fields
  challenges: string[];
  contactName: string;
  email: string;
  phone: string;
  staffId: string;
  password: string;
  confirmPassword: string;
  acceptTerms: boolean;
}