import api from './api';
import { Campaign } from '../types/campaign';

export const campaignsService = {
  // GET /api/campaigns - Get all campaigns
  getAllCampaigns: () => api.get<Campaign[]>('/campaigns'),
  
  // GET /api/campaigns/:id - Get specific campaign
  getCampaignById: (id: string) => api.get<Campaign>(`/campaigns/${id}`),
  
  // POST /api/campaigns - Create new campaign
  createCampaign: (campaignData: Partial<Campaign>) => api.post<Campaign>('/campaigns', campaignData),
  
  // PUT /api/campaigns/:id - Update campaign
  updateCampaign: (id: string, campaignData: Partial<Campaign>) => api.put<Campaign>(`/campaigns/${id}`, campaignData),
  
  // DELETE /api/campaigns/:id - Delete campaign
  deleteCampaign: (id: string) => api.delete(`/campaigns/${id}`),
};