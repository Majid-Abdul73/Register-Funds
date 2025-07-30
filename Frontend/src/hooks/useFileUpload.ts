import { useState } from 'react';
import { fileUploadService } from '../services/fileUpload.service';

export const useFileUpload = () => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const uploadFile = async (file: File, folder?: string): Promise<string | null> => {
    try {
      setUploading(true);
      setError(null);
      const url = await fileUploadService.uploadFile(file, folder);
      return url;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed');
      return null;
    } finally {
      setUploading(false);
    }
  };

  const uploadMultipleFiles = async (files: File[], folder?: string): Promise<string[]> => {
    try {
      setUploading(true);
      setError(null);
      const urls = await fileUploadService.uploadMultipleFiles(files, folder);
      return urls;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed');
      return [];
    } finally {
      setUploading(false);
    }
  };

  return {
    uploadFile,
    uploadMultipleFiles,
    uploading,
    error,
  };
};