export interface Campaign {
  id: string;
  name: string;
  description: string;
  goal: number;
  startDate: string;
  endDate: string;
  category: string;
  amountRaised: number;
  status: string;
  additionalImages: string[];
  mediaUrl: string;
  schoolId: string;
  featured: boolean;
  updates?: any[];
  location?: {
    city: string;
    country: string;
  };
  organizer?: {
    name: string;
    profileImage?: string;
  };
  impactReport?: {
    url: string;
    uploadDate: string;
    fileName?: string;
  };
}