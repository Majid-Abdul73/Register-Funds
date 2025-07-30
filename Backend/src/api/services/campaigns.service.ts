import { db } from '../../config/firebase';
import { Campaign } from '../../models/Campaign';

export class CampaignsService {
  private campaignsCollection = db.collection('campaigns');
  
  /**
   * Create a new campaign
   * @param campaignData Campaign data
   * @param userId User ID (school ID)
   * @returns Created campaign
   */
  async createCampaign(campaignData: Partial<Campaign>, userId: string) {
    try {
      const timestamp = new Date().toISOString();
      
      const newCampaign: Campaign = {
        ...campaignData as Campaign,
        schoolId: userId,
        amountRaised: 0,
        featured: false,
        status: 'active',
        createdAt: timestamp,
        updatedAt: timestamp
      };
      
      const campaignRef = await this.campaignsCollection.add(newCampaign);
      
      return {
        id: campaignRef.id,
        ...newCampaign
      };
    } catch (error) {
      console.error('Error creating campaign:', error);
      throw error;
    }
  }
  
  /**
   * Get all campaigns with filtering and pagination
   * @param filters Filter options
   * @returns List of campaigns
   */
  async getAllCampaigns(filters: {
    category?: string;
    featured?: boolean;
    status?: string;
    limit?: number;
    page?: number;
  }) {
    try {
      const {
        category,
        featured,
        status = 'active',
        limit = 10,
        page = 1
      } = filters;
      
      let query = this.campaignsCollection.where('status', '==', status);
      
      if (category) {
        query = query.where('category', '==', category);
      }
      
      if (featured) {
        query = query.where('featured', '==', true);
      }
      
      // Calculate pagination
      const offset = (page - 1) * limit;
      
      // Get total count (for pagination info)
      const countSnapshot = await query.get();
      const totalCount = countSnapshot.size;
      
      // Apply pagination
      const snapshot = await query.limit(limit).offset(offset).get();
      
      const campaigns: (Campaign & { id: string })[] = [];
      snapshot.forEach(doc => {
        campaigns.push({
          id: doc.id,
          ...doc.data() as Campaign
        });
      });
      
      return {
        campaigns,
        pagination: {
          total: totalCount,
          page,
          limit,
          pages: Math.ceil(totalCount / limit)
        }
      };
    } catch (error) {
      console.error('Error getting campaigns:', error);
      throw error;
    }
  }
  
  /**
   * Get campaign by ID
   * @param campaignId Campaign ID
   * @returns Campaign data
   */
  async getCampaignById(campaignId: string) {
    try {
      const campaignDoc = await this.campaignsCollection.doc(campaignId).get();
      
      if (!campaignDoc.exists) {
        throw new Error('Campaign not found');
      }
      
      return {
        id: campaignDoc.id,
        ...campaignDoc.data() as Campaign
      };
    } catch (error) {
      console.error('Error getting campaign:', error);
      throw error;
    }
  }
  
  /**
   * Get campaigns by school ID
   * @param schoolId School ID
   * @returns List of campaigns
   */
  async getCampaignsBySchoolId(schoolId: string) {
    try {
      const snapshot = await this.campaignsCollection
        .where('schoolId', '==', schoolId)
        .get();
      
      const campaigns: (Campaign & { id: string })[] = [];
      snapshot.forEach(doc => {
        campaigns.push({
          id: doc.id,
          ...doc.data() as Campaign
        });
      });
      
      return campaigns;
    } catch (error) {
      console.error('Error getting school campaigns:', error);
      throw error;
    }
  }
  
  /**
   * Update campaign
   * @param campaignId Campaign ID
   * @param updateData Update data
   * @param userId User ID (for authorization)
   * @returns Updated campaign
   */
  async updateCampaign(campaignId: string, updateData: Partial<Campaign>, userId: string) {
    try {
      const campaignRef = this.campaignsCollection.doc(campaignId);
      const campaignDoc = await campaignRef.get();
      
      if (!campaignDoc.exists) {
        throw new Error('Campaign not found');
      }
      
      const campaignData = campaignDoc.data() as Campaign;
      
      // Check if the user owns this campaign
      if (campaignData.schoolId !== userId) {
        throw new Error('Forbidden: You do not own this campaign');
      }
      
      const updatedData = {
        ...updateData,
        updatedAt: new Date().toISOString()
      };
      
      await campaignRef.update(updatedData);
      
      return {
        id: campaignId,
        ...campaignData,
        ...updatedData
      };
    } catch (error) {
      console.error('Error updating campaign:', error);
      throw error;
    }
  }
  
  /**
   * Delete campaign
   * @param campaignId Campaign ID
   * @param userId User ID (for authorization)
   * @returns Success status
   */
  async deleteCampaign(campaignId: string, userId: string) {
    try {
      const campaignRef = this.campaignsCollection.doc(campaignId);
      const campaignDoc = await campaignRef.get();
      
      if (!campaignDoc.exists) {
        throw new Error('Campaign not found');
      }
      
      const campaignData = campaignDoc.data() as Campaign;
      
      // Check if the user owns this campaign
      if (campaignData.schoolId !== userId) {
        throw new Error('Forbidden: You do not own this campaign');
      }
      
      await campaignRef.delete();
      
      return { success: true };
    } catch (error) {
      console.error('Error deleting campaign:', error);
      throw error;
    }
  }
}

export const campaignsService = new CampaignsService();