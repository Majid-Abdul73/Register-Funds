import { Request, Response } from 'express';
import { createSchool, getSchool, updateSchool } from '../../../src/api/controllers/schoolController';
import { db } from '../../../src/config/firebase';
import { createMockUser, createMockSchool } from '../../utils/testHelpers';

// Fixed mock path
jest.mock('../../../src/config/firebase');

const mockDb = db as jest.Mocked<typeof db>;

describe('School Controller', () => {
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;
  let mockJson: jest.Mock;
  let mockStatus: jest.Mock;
  let mockCollection: jest.Mock;
  let mockDoc: jest.Mock;
  let mockSet: jest.Mock;
  let mockGet: jest.Mock;
  let mockUpdate: jest.Mock;

  beforeEach(() => {
    mockJson = jest.fn();
    mockStatus = jest.fn().mockReturnValue({ json: mockJson });
    mockSet = jest.fn();
    mockGet = jest.fn();
    mockUpdate = jest.fn();
    mockDoc = jest.fn().mockReturnValue({
      set: mockSet,
      get: mockGet,
      update: mockUpdate
    });
    mockCollection = jest.fn().mockReturnValue({
      doc: mockDoc
    });
    
    mockDb.collection = mockCollection;
    
    mockRes = {
      status: mockStatus,
      json: mockJson
    };
    
    mockReq = {
      body: {},
      params: {},
      user: createMockUser()
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createSchool', () => {
    it('should create a school successfully', async () => {
      const schoolData = createMockSchool();
      mockReq.body = schoolData;
      
      await createSchool(mockReq as Request, mockRes as Response);
      
      expect(mockCollection).toHaveBeenCalledWith('schools');
      expect(mockDoc).toHaveBeenCalledWith('test-user-123');
      expect(mockSet).toHaveBeenCalledWith(expect.objectContaining({
        ...schoolData,
        createdAt: expect.any(String),
        updatedAt: expect.any(String)
      }));
      expect(mockStatus).toHaveBeenCalledWith(201);
    });

    it('should handle unauthorized request', async () => {
      mockReq.user = undefined;
      
      await createSchool(mockReq as Request, mockRes as Response);
      
      expect(mockStatus).toHaveBeenCalledWith(401);
      expect(mockJson).toHaveBeenCalledWith({
        message: 'Unauthorized'
      });
    });
  });

  describe('getSchool', () => {
    it('should get school by user ID', async () => {
      const schoolData = createMockSchool();
      mockGet.mockResolvedValue({
        exists: true,
        id: 'test-user-123',
        data: () => schoolData
      });
      
      await getSchool(mockReq as Request, mockRes as Response);
      
      expect(mockDoc).toHaveBeenCalledWith('test-user-123');
      expect(mockStatus).toHaveBeenCalledWith(200);
      expect(mockJson).toHaveBeenCalledWith({
        id: 'test-user-123',
        ...schoolData
      });
    });

    it('should handle school not found', async () => {
      mockGet.mockResolvedValue({
        exists: false
      });
      
      await getSchool(mockReq as Request, mockRes as Response);
      
      expect(mockStatus).toHaveBeenCalledWith(404);
      expect(mockJson).toHaveBeenCalledWith({
        message: 'School not found'
      });
    });
  });

  describe('updateSchool', () => {
    it('should update school successfully', async () => {
      const existingSchool = createMockSchool();
      const updateData = { schoolName: 'Updated School Name' };
      
      mockReq.body = updateData;
      mockGet.mockResolvedValue({
        exists: true,
        data: () => existingSchool
      });
      
      await updateSchool(mockReq as Request, mockRes as Response);
      
      expect(mockUpdate).toHaveBeenCalledWith(expect.objectContaining({
        ...updateData,
        updatedAt: expect.any(String)
      }));
      expect(mockStatus).toHaveBeenCalledWith(200);
    });
  });
});