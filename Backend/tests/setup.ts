import dotenv from 'dotenv';

// Load test environment variables
dotenv.config({ path: '.env.test' });

// Mock Firebase Admin SDK for testing
jest.mock('../src/config/firebase', () => ({
  auth: {
    createUser: jest.fn(),
    verifyIdToken: jest.fn(),
    setCustomUserClaims: jest.fn()
  },
  db: {
    collection: jest.fn(() => ({
      doc: jest.fn(() => ({
        set: jest.fn(),
        get: jest.fn(),
        update: jest.fn(),
        delete: jest.fn()
      })),
      add: jest.fn(),
      where: jest.fn(() => ({
        orderBy: jest.fn(() => ({
          limit: jest.fn(() => ({
            offset: jest.fn(() => ({
              get: jest.fn()
            }))
          })),
          get: jest.fn()
        }))
      }))
    }))
  }
}));

// Global test timeout
jest.setTimeout(30000);