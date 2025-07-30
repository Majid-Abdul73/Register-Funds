import jwt from 'jsonwebtoken';
import environment from '../../src/config/environment';

export const createMockUser = (overrides = {}) => ({
  uid: 'test-user-123',
  email: 'test@example.com',
  role: 'user',
  ...overrides
});

export const createMockToken = (user = createMockUser()) => {
  return jwt.sign(user, environment.jwt.secret, { expiresIn: '1h' });
};

export const createMockSchool = (overrides = {}) => ({
  schoolName: 'Test School',
  country: 'Test Country',
  city: 'Test City',
  schoolType: 'Primary',
  challenges: ['Infrastructure'],
  contactName: 'John Doe',
  email: 'school@test.com',
  phone: '+1234567890',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  ...overrides
});

export const createMockCampaign = (overrides = {}) => ({
  name: 'Test Campaign',
  description: 'Test Description',
  goal: 10000,
  startDate: new Date().toISOString(),
  endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
  category: 'Education',
  amountRaised: 0,
  status: 'active',
  mediaUrl: 'https://example.com/image.jpg',
  schoolId: 'test-school-123',
  featured: false,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  ...overrides
});

export const createMockUpdate = (overrides = {}) => ({
  title: 'Test Update',
  content: 'Test update content',
  schoolId: 'test-school-123',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  status: 'published' as const,
  ...overrides
});