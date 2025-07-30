export interface Campaign {
  id?: string;
  name: string;
  description: string;
  goal: number;
  startDate: string;
  endDate: string;
  category: string;
  amountRaised: number;
  status: string;
  mediaUrl: string;
  additionalImages?: string[];
  schoolId: string;
  featured: boolean;
  createdAt: string;
  updatedAt: string;
  location?: {
    city: string;
    country: string;
  };
  organizer?: {
    name: string;
    profileImage?: string;
  };
}