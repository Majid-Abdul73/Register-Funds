import api from './api';
import { School } from '../types/school';

export interface RegisterData {
  schoolName: string;
  country: string;
  city: string;
  schoolType: string;
  challenges: string[];
  contactName: string;
  email: string;
  phone: string;
  firebaseUid: string;
}

export const authService = {
  // Register user and create school profile
  registerUser: async (userData: RegisterData): Promise<School> => {
    return api.post<School>('/auth/register', userData);
  },

  // Get current user profile
  getCurrentUser: async (): Promise<School> => {
    return api.get<School>('/auth/me');
  },

  // Update user profile
  updateProfile: async (userData: Partial<School>): Promise<School> => {
    return api.put<School>('/auth/profile', userData);
  },
};