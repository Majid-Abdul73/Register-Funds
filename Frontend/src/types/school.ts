export interface School {
  id: string;
  schoolName: string; // Changed from 'name' to 'schoolName'
  country: string;
  city: string;
  schoolType: string; // Changed from 'type' to 'schoolType'
  challenges: string[];
  contactName: string;
  email: string;
  phone: string;
  createdAt: string;
  updatedAt: string;
  students?: {
    male: number;
    female: number;
    total: number;
  };
  teachers?: {
    steamInvolved: number;
    nonSteamInvolved: number;
    total: number;
  };
}