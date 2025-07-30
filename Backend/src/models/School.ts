export interface School {
  id?: string;
  schoolName: string;
  country: string;
  city: string;
  schoolType: string;
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