import { Request, Response } from 'express';
import { db } from '../../config/firebase';
import { Campaign } from '../../models/campaign.model';

const campaignsCollection = db.collection('campaigns');
const schoolsCollection = db.collection('schools');

// Helper function to populate campaign data
const populateCampaignData = async (campaign: any) => {
  try {
    // Get school data for location and organizer info
    const schoolDoc = await schoolsCollection.doc(campaign.schoolId).get();
    
    if (schoolDoc.exists) {
      const schoolData = schoolDoc.data();
      
      // Populate location from school data
      campaign.location = {
        city: schoolData?.city || '',
        country: schoolData?.country || ''
      };
      
      // Populate organizer from school contact data
      campaign.organizer = {
        name: schoolData?.contactName || 'Anonymous',
        profileImage: schoolData?.profileImage || null
      };
    }
    
    return campaign;
  } catch (error) {
    console.error('Error populating campaign data:', error);
    return campaign; // Return original campaign if population fails
  }
};

// Create a new campaign
export const createCampaign = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const campaignData: Campaign = {
      ...req.body,
      schoolId: req.user.uid,
      amountRaised: 0,
      featured: false,
      status: 'active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const campaignRef = await campaignsCollection.add(campaignData);

    return res.status(201).json({
      id: campaignRef.id,
      ...campaignData
    });
  } catch (error) {
    console.error('Error creating campaign:', error);
    return res.status(500).json({ message: 'Failed to create campaign' });
  }
};

// Get all campaigns
export const getAllCampaigns = async (req: Request, res: Response) => {
  try {
    const { category, featured, status } = req.query;
    let query = campaignsCollection.where('status', '==', status || 'active');

    if (category) {
      query = query.where('category', '==', category);
    }

    if (featured === 'true') {
      query = query.where('featured', '==', true);
    }

    // Remove limit to fetch all campaigns
    const snapshot = await query.get();
    const campaigns: Campaign[] = [];

    // Collect all campaigns first
    const campaignPromises = snapshot.docs.map(async (doc) => {
      const campaignData = {
        id: doc.id,
        ...doc.data() as Campaign
      };
      
      // Populate location and organizer data
      return await populateCampaignData(campaignData);
    });

    // Wait for all campaigns to be populated
    const populatedCampaigns = await Promise.all(campaignPromises);

    return res.status(200).json(populatedCampaigns);
  } catch (error) {
    console.error('Error getting campaigns:', error);
    return res.status(500).json({ message: 'Failed to get campaigns' });
  }
};

// Get campaign by ID
export const getCampaign = async (req: Request, res: Response) => {
  try {
    const campaignId = req.params.id;
    const campaignDoc = await campaignsCollection.doc(campaignId).get();

    if (!campaignDoc.exists) {
      return res.status(404).json({ message: 'Campaign not found' });
    }

    const campaignData = {
      id: campaignDoc.id,
      ...campaignDoc.data() as Campaign
    };

    // Populate location and organizer data
    const populatedCampaign = await populateCampaignData(campaignData);

    return res.status(200).json(populatedCampaign);
  } catch (error) {
    console.error('Error getting campaign:', error);
    return res.status(500).json({ message: 'Failed to get campaign' });
  }
};

// Get campaigns by school ID
export const getSchoolCampaigns = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const schoolId = req.params.schoolId || req.user.uid;
    const snapshot = await campaignsCollection.where('schoolId', '==', schoolId).get();
    
    // Collect and populate all campaigns
    const campaignPromises = snapshot.docs.map(async (doc) => {
      const campaignData = {
        id: doc.id,
        ...doc.data() as Campaign
      };
      
      return await populateCampaignData(campaignData);
    });

    const populatedCampaigns = await Promise.all(campaignPromises);

    return res.status(200).json(populatedCampaigns);
  } catch (error) {
    console.error('Error getting school campaigns:', error);
    return res.status(500).json({ message: 'Failed to get school campaigns' });
  }
};

// Update campaign
export const updateCampaign = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const campaignId = req.params.id;
    const campaignRef = campaignsCollection.doc(campaignId);
    const campaignDoc = await campaignRef.get();

    if (!campaignDoc.exists) {
      return res.status(404).json({ message: 'Campaign not found' });
    }

    const campaignData = campaignDoc.data() as Campaign;

    // Check if the user owns this campaign
    if (campaignData.schoolId !== req.user.uid) {
      return res.status(403).json({ message: 'Forbidden: You do not own this campaign' });
    }

    const updatedData = {
      ...req.body,
      updatedAt: new Date().toISOString()
    };

    await campaignRef.update(updatedData);

    return res.status(200).json({
      id: campaignId,
      ...updatedData
    });
  } catch (error) {
    console.error('Error updating campaign:', error);
    return res.status(500).json({ message: 'Failed to update campaign' });
  }
};