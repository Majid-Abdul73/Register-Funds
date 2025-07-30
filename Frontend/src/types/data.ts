export interface SchoolData {
  id: string;
  schoolName: string;
  country: string;
  city: string;
  schoolType: string;
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

export interface CampaignData {
  id: string;
  name: string;
  description: string;
  goal: number;
  startDate: string;
  endDate: string;
  category: string;
  amountRaised: number;
  status: string;
  mediaUrl: string;
  schoolId: string;
  featured: boolean;
  createdAt: Date;
  location: {
    city: string;
    country: string;
  };
  organizer: {
    name: string;
    profileImage?: string;
  };
}

export interface TransactionData {
  id: string;
  amount: number;
  date: string;
  time: string;
  status: string;
  type: string;
}

export interface CampaignPage {
  campaigns: CampaignData[];
  lastDoc: any;
  hasMore: boolean;
}

export interface CacheItem<T> {
  data: T[];
  timestamp: number;
  expiresAt: number;
}