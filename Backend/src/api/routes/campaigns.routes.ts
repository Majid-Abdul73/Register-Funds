import { Router } from 'express';
import {
  createCampaign, getAllCampaigns, getCampaign, getSchoolCampaigns, updateCampaign
} from '../controllers/campaignController';
import { authenticate } from '../middleware/auth';

const router = Router();

// Create a new campaign (requires authentication)
router.post('/', authenticate, createCampaign);

// Get all campaigns (public)
router.get('/', getAllCampaigns);

// Get campaigns by school ID (requires authentication) - split into two routes
router.get('/school', authenticate, getSchoolCampaigns);
router.get('/school/:schoolId', authenticate, getSchoolCampaigns);

// Get campaign by ID (public)
router.get('/:id', getCampaign); 

// Update campaign (requires authentication)
router.put('/:id', authenticate, updateCampaign);

export default router;