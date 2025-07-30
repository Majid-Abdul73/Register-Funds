import { auth } from '../../config/firebase';
import jwt, { SignOptions} from 'jsonwebtoken';
import environment from '../../config/environment';

export class AuthService {
  /**
   * Create a new user in Firebase Auth
   * @param email User email
   * @param password User password
   * @param displayName User display name
   * @returns Created user record
   */
  async createUser(email: string, password: string, displayName: string) {
    try {
      const userRecord = await auth.createUser({
        email,
        password,
        displayName
      });
      
      // Set default role
      await auth.setCustomUserClaims(userRecord.uid, { role: 'user' });
      
      return userRecord;
    } catch (error: any) {
      console.error('Error creating user:', error);
      throw new Error(`Failed to create user: ${error.message}`);
    }
  }
  
  /**
   * Generate a JWT token for a user - Fixed implementation
   * @param uid User ID
   * @param email User email
   * @param role User role
   * @returns JWT token
   */
  generateToken(uid: string, email?: string, role: string = 'user'): string {
    try {
      // Ensure all required fields are properly typed
      const payload = {
        uid,
        email: email || '',
        role
      };
      
      const options: SignOptions = {
        expiresIn: '1d', // Keep as string "1d"
        algorithm: 'HS256'
      };
      
      return jwt.sign(payload, environment.jwt.secret, options);
    } catch (error: any) {
      console.error('Error generating token:', error);
      throw new Error(`Failed to generate token: ${error.message}`);
    }
  }
  
  /**
   * Verify a JWT token
   * @param token JWT token to verify
   * @returns Decoded token payload
   */
  verifyJwtToken(token: string): any {
    try {
      return jwt.verify(token, environment.jwt.secret, {
        algorithms: ['HS256']
      });
    } catch (error: any) {
      console.error('Error verifying JWT token:', error);
      throw new Error(`Invalid JWT token: ${error.message}`);
    }
  }
  
  /**
   * Verify a Firebase ID token
   * @param idToken Firebase ID token
   * @returns Decoded token
   */
  async verifyIdToken(idToken: string) {
    try {
      return await auth.verifyIdToken(idToken);
    } catch (error: any) {
      console.error('Error verifying ID token:', error);
      throw new Error(`Invalid token: ${error.message}`);
    }
  }
  
  /**
   * Get user by ID
   * @param uid User ID
   * @returns User record
   */
  async getUserById(uid: string) {
    try {
      return await auth.getUser(uid);
    } catch (error: any) {
      console.error('Error getting user:', error);
      throw new Error(`User not found: ${error.message}`);
    }
  }
  
  /**
   * Update user role
   * @param uid User ID
   * @param role New role
   * @returns Success status
   */
  async updateUserRole(uid: string, role: string) {
    try {
      await auth.setCustomUserClaims(uid, { role });
      return true;
    } catch (error: any) {
      console.error('Error updating user role:', error);
      throw new Error(`Failed to update user role: ${error.message}`);
    }
  }
}

export const authService = new AuthService();