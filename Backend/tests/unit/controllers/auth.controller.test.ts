import { Request, Response } from 'express';
import { register, login, resetPassword, verifyToken } from '../../../src/api/controllers/auth.controller';
import { auth } from '../../../src/config/firebase';
import jwt from 'jsonwebtoken';

// Mock Firebase auth - Fixed path
jest.mock('../../../src/config/firebase');
jest.mock('jsonwebtoken');

const mockAuth = auth as jest.Mocked<typeof auth>;
const mockJwt = jwt as jest.Mocked<typeof jwt>;

describe('Auth Controller', () => {
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;
  let mockJson: jest.Mock;
  let mockStatus: jest.Mock;

  beforeEach(() => {
    mockJson = jest.fn();
    mockStatus = jest.fn().mockReturnValue({ json: mockJson });
    mockRes = {
      status: mockStatus,
      json: mockJson
    };
    mockReq = {
      body: {}
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('register', () => {
    it('should register a new user successfully', async () => {
      const userData = {
        email: 'test@example.com',
        password: 'password123',
        displayName: 'Test User'
      };
      
      mockReq.body = userData;
      
      const mockUserRecord = {
        uid: 'test-uid-123',
        email: userData.email,
        displayName: userData.displayName
      };
      
      mockAuth.createUser.mockResolvedValue(mockUserRecord as any);
      mockAuth.setCustomUserClaims.mockResolvedValue();
      mockJwt.sign.mockReturnValue('mock-token');
      
      await register(mockReq as Request, mockRes as Response);
      
      expect(mockAuth.createUser).toHaveBeenCalledWith({
        email: userData.email,
        password: userData.password,
        displayName: userData.displayName
      });
      expect(mockAuth.setCustomUserClaims).toHaveBeenCalledWith('test-uid-123', { role: 'user' });
      expect(mockStatus).toHaveBeenCalledWith(201);
      expect(mockJson).toHaveBeenCalledWith({
        message: 'User registered successfully',
        user: {
          uid: 'test-uid-123',
          email: userData.email,
          displayName: userData.displayName,
          role: 'user'
        },
        token: 'mock-token'
      });
    });

    it('should handle registration errors', async () => {
      mockReq.body = {
        email: 'test@example.com',
        password: 'password123'
      };
      
      const error = new Error('Firebase error');
      mockAuth.createUser.mockRejectedValue(error);
      
      await register(mockReq as Request, mockRes as Response);
      
      expect(mockStatus).toHaveBeenCalledWith(500);
      expect(mockJson).toHaveBeenCalledWith({
        message: 'Failed to register user',
        error: 'Firebase error'
      });
    });
  });

  describe('login', () => {
    it('should login user successfully', async () => {
      mockReq.body = { idToken: 'valid-id-token' };
      
      const mockDecodedToken = {
        uid: 'test-uid-123',
        email: 'test@example.com',
        role: 'user'
      };
      
      mockAuth.verifyIdToken.mockResolvedValue(mockDecodedToken as any);
      mockJwt.sign.mockReturnValue('session-token');
      
      await login(mockReq as Request, mockRes as Response);
      
      expect(mockAuth.verifyIdToken).toHaveBeenCalledWith('valid-id-token');
      expect(mockStatus).toHaveBeenCalledWith(200);
      expect(mockJson).toHaveBeenCalledWith({
        message: 'Login successful',
        user: {
          uid: 'test-uid-123',
          email: 'test@example.com',
          role: 'user'
        },
        token: 'session-token'
      });
    });

    it('should handle missing ID token', async () => {
      mockReq.body = {};
      
      await login(mockReq as Request, mockRes as Response);
      
      expect(mockStatus).toHaveBeenCalledWith(400);
      expect(mockJson).toHaveBeenCalledWith({
        message: 'ID token is required'
      });
    });

    it('should handle invalid ID token', async () => {
      mockReq.body = { idToken: 'invalid-token' };
      
      const error = new Error('Invalid token');
      mockAuth.verifyIdToken.mockRejectedValue(error);
      
      await login(mockReq as Request, mockRes as Response);
      
      expect(mockStatus).toHaveBeenCalledWith(401);
      expect(mockJson).toHaveBeenCalledWith({
        message: 'Authentication failed',
        error: 'Invalid token'
      });
    });
  });

  describe('verifyToken', () => {
    it('should verify valid token', async () => {
      const mockUser = {
        uid: 'test-uid-123',
        email: 'test@example.com',
        role: 'user'
      };
      
      mockReq.user = mockUser;
      
      await verifyToken(mockReq as Request, mockRes as Response);
      
      expect(mockStatus).toHaveBeenCalledWith(200);
      expect(mockJson).toHaveBeenCalledWith({
        message: 'Token is valid',
        user: mockUser
      });
    });

    it('should handle unauthorized request', async () => {
      mockReq.user = undefined;
      
      await verifyToken(mockReq as Request, mockRes as Response);
      
      expect(mockStatus).toHaveBeenCalledWith(401);
      expect(mockJson).toHaveBeenCalledWith({
        message: 'Unauthorized'
      });
    });
  });
});