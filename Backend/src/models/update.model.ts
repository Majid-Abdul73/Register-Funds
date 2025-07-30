// Update status options
export type UpdateStatus = 'draft' | 'published' | 'archived';

// Author interface
export interface UpdateAuthor {
  name: string;
  role?: string;
  profileImage?: string;
}

// Update interface
export interface Update {
  id?: string;
  title: string;
  content: string;
  schoolId: string;
  campaignId?: string;
  mediaUrl?: string;
  createdAt: string;
  updatedAt: string;
  status?: UpdateStatus;
  author?: UpdateAuthor;
}

// Update creation DTO
export interface CreateUpdateDto {
  title: string;
  content: string;
  schoolId: string;
  campaignId?: string;
  mediaUrl?: string;
  status?: UpdateStatus;
  author?: UpdateAuthor;
}

// Update update DTO
export interface UpdateUpdateDto {
  title?: string;
  content?: string;
  mediaUrl?: string;
  status?: UpdateStatus;
  author?: UpdateAuthor;
}

// Update response DTO
export interface UpdateResponseDto {
  id: string;
  title: string;
  content: string;
  schoolId: string;
  campaignId?: string;
  mediaUrl?: string;
  createdAt: string;
  updatedAt: string;
  status: UpdateStatus;
  author?: UpdateAuthor;
}