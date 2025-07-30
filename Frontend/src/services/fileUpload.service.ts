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
    const uploadPromises = files.map(file => 
      fileUploadService.uploadFile(file, `${folder}/additional`)
    );
    
    return Promise.all(uploadPromises);
  },
};