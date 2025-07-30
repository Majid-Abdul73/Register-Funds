import api from './api';
import { School } from '../types/school';

export const schoolsService = {
  // GET /api/schools - Get all schools
  getAllSchools: () => api.get<School[]>('/schools'),
  
  // GET /api/schools/:id - Get specific school
  getSchoolById: (id: string) => api.get<School>(`/schools/${id}`),
  
  // POST /api/schools - Create new school
  createSchool: (schoolData: Partial<School>) => api.post<School>('/schools', schoolData),
  
  // PUT /api/schools/:id - Update school
  updateSchool: (id: string, schoolData: Partial<School>) => api.put<School>(`/schools/${id}`, schoolData),
  
  // DELETE /api/schools/:id - Delete school
  deleteSchool: (id: string) => api.delete(`/schools/${id}`),
};