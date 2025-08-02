import api from './api';

export const fileUploadService = {
  // Upload single file
  uploadFile: async (file: File, folder: string = 'campaigns'): Promise<string> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', folder);
    
    const response = await api.post<{ url: string }>('/upload', formData);
    
    return response.url;
  },

  // Upload multiple files
  uploadMultipleFiles: async (files: File[], folder: string = 'campaigns'): Promise<string[]> => {
    const formData = new FormData();
    files.forEach(file => {
      formData.append('files', file);
    });
    formData.append('folder', folder);
    
    const response = await api.post<{ urls: string[] }>('/upload/multiple', formData);
    
    return response.urls;
  },
};