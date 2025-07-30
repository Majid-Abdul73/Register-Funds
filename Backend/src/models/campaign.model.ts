// Campaign status options
export type CampaignStatus = 'draft' | 'active' | 'completed' | 'cancelled' | 'paused';

// Campaign category options
export type CampaignCategory = 'Education' | 'Infrastructure' | 'Technology' | 'Health' | 'Sports' | 'Arts' | 'Other';

// Location interface
export interface CampaignLocation {
  city: string;
  country: string;
}

// Organizer interface
export interface CampaignOrganizer {
  name: string;
  profileImage?: string;
  role?: string;
}

// Campaign interface
export interface Campaign {
  id?: string;
  name: string;
  description: string;
  goal: number;
  startDate: string;
  endDate: string;
  category: CampaignCategory | string;
  amountRaised: number;
  status: CampaignStatus | string;
  mediaUrl: string;
  additionalImages?: string[];
  schoolId: string;
  featured: boolean;
  createdAt: string;
  updatedAt: string;
  location?: CampaignLocation;
  organizer?: CampaignOrganizer;
  impactReport?: {
    url: string;
    uploadDate: string;
    fileName?: string;
  };
}

// Campaign creation DTO
export interface CreateCampaignDto {
  name: string;
  description: string;
  goal: number;
  startDate: string;
  endDate: string;
  category: CampaignCategory | string;
  mediaUrl: string;
  additionalImages?: string[];
  schoolId: string;
  featured?: boolean;
  location?: CampaignLocation;
  organizer?: CampaignOrganizer;
  impactReport?: {
    url: string;
    uploadDate: string;
    fileName?: string;
  };
}

// Campaign update DTO
export interface UpdateCampaignDto {
  name?: string;
  description?: string;
  goal?: number;
  startDate?: string;
  endDate?: string;
  category?: CampaignCategory | string;
  amountRaised?: number;
  status?: CampaignStatus | string;
  mediaUrl?: string;
  additionalImages?: string[];
  featured?: boolean;
  location?: CampaignLocation;
  organizer?: CampaignOrganizer;
}

// Campaign response DTO
export interface CampaignResponseDto {
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
  additionalImages?: string[];
  schoolId: string;
  featured: boolean;
  createdAt: string;
  updatedAt: string;
  location?: CampaignLocation;
  organizer?: CampaignOrganizer;
  progressPercentage?: number;
}