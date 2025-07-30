import api from './api';
import { Update } from '../types/update';

export const updatesService = {
  // GET /api/updates - Get all updates
  getAllUpdates: () => api.get<Update[]>('/updates'),
  
  // GET /api/updates/:id - Get specific update
  getUpdateById: (id: string) => api.get<Update>(`/updates/${id}`),
  
  // POST /api/updates - Create new update
  createUpdate: (updateData: Partial<Update>) => api.post<Update>('/updates', updateData),
  
  // PUT /api/updates/:id - Update update
  updateUpdate: (id: string, updateData: Partial<Update>) => api.put<Update>(`/updates/${id}`, updateData),
  
  // DELETE /api/updates/:id - Delete update
  deleteUpdate: (id: string) => api.delete(`/updates/${id}`),
};