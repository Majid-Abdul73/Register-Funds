import request from 'supertest';
import configureExpress from '../../src/config/express';
import authRoutes from '../../src/api/routes/auth.routes';

const app = configureExpress();
app.use('/api/auth', authRoutes);

describe('Auth Integration Tests', () => {
  describe('POST /api/auth/register', () => {
    it('should register a new user with valid data', async () => {
      const userData = {
        email: 'integration@test.com',
        password: 'password123',
        displayName: 'Integration Test User'
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(201);

      expect(response.body).toHaveProperty('message', 'User registered successfully');
      expect(response.body).toHaveProperty('user');
      expect(response.body).toHaveProperty('token');
      expect(response.body.user).toHaveProperty('email', userData.email);
    });

    it('should return 500 for invalid registration data', async () => {
      const invalidData = {
        email: 'invalid-email',
        password: '123' // too short
      };

      await request(app)
        .post('/api/auth/register')
        .send(invalidData)
        .expect(500);
    });
  });

  describe('POST /api/auth/login', () => {
    it('should return 400 for missing ID token', async () => {
      await request(app)
        .post('/api/auth/login')
        .send({})
        .expect(400);
    });
  });
});