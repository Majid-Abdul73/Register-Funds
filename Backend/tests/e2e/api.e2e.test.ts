import request from 'supertest';
import app from '../../src/app';
import { createMockToken, createMockSchool, createMockCampaign } from '../utils/testHelpers';

describe('API E2E Tests', () => {
  let authToken: string;

  beforeAll(() => {
    authToken = createMockToken();
  });

  describe('Health Check', () => {
    it('should return health status', async () => {
      const response = await request(app)
        .get('/health')
        .expect(200);

      expect(response.body).toEqual({ status: 'ok' });
    });
  });

  describe('School API Flow', () => {
    it('should create, get, and update a school', async () => {
      const schoolData = createMockSchool();

      // Create school
      const createResponse = await request(app)
        .post('/api/schools')
        .set('Authorization', `Bearer ${authToken}`)
        .send(schoolData)
        .expect(201);

      expect(createResponse.body).toHaveProperty('id');
      expect(createResponse.body.schoolName).toBe(schoolData.schoolName);

      // Get school
      await request(app)
        .get('/api/schools')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      // Update school
      const updateData = { schoolName: 'Updated School Name' };
      await request(app)
        .put('/api/schools')
        .set('Authorization', `Bearer ${authToken}`)
        .send(updateData)
        .expect(200);
    });
  });

  describe('Campaign API Flow', () => {
    it('should handle campaign operations', async () => {
      // Get all campaigns (public)
      await request(app)
        .get('/api/campaigns')
        .expect(200);

      // Create campaign (authenticated)
      const campaignData = createMockCampaign();
      await request(app)
        .post('/api/campaigns')
        .set('Authorization', `Bearer ${authToken}`)
        .send(campaignData)
        .expect(201);
    });
  });

  describe('Authentication Required Endpoints', () => {
    it('should return 401 for protected routes without token', async () => {
      await request(app)
        .post('/api/schools')
        .send(createMockSchool())
        .expect(401);

      await request(app)
        .post('/api/campaigns')
        .send(createMockCampaign())
        .expect(401);

      await request(app)
        .post('/api/updates')
        .send({ title: 'Test', content: 'Test content' })
        .expect(401);
    });
  });
});