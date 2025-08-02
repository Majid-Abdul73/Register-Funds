export interface UpdateAuthor {
  name: string;
  role?: string;
  profileImage?: string;
}

export interface Update {
  id: string;
  title?: string;
  content: string;
  campaignId: string;
  schoolId: string;
  mediaUrl?: string;
  createdAt: string;
  updatedAt: string;
  status?: 'draft' | 'published' | 'archived';
  author?: UpdateAuthor;
}