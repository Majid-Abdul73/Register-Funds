import { useState, useEffect, useCallback } from 'react';
import api from '../services/api';

interface FileStatus {
  exists: boolean;
  fileName?: string;
  size?: number;
  formattedSize?: string;
  lastModified?: string;
  contentType?: string;
}

export const useFileStatus = (fileUrl?: string, pollInterval: number = 5000) => {
  const [fileStatus, setFileStatus] = useState<FileStatus | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const checkFileStatus = useCallback(async () => {
    if (!fileUrl) {
      setFileStatus(null);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const response = await api.get<FileStatus>(`/upload/status?fileUrl=${encodeURIComponent(fileUrl)}`);
      setFileStatus(response);
    } catch (err) {
      console.error('Error checking file status:', err);
      setError(err instanceof Error ? err.message : 'Failed to check file status');
      setFileStatus({ exists: false });
    } finally {
      setLoading(false);
    }
  }, [fileUrl]);

  useEffect(() => {
    if (!fileUrl) return;

    // Initial check
    checkFileStatus();

    // Set up polling
    const interval = setInterval(checkFileStatus, pollInterval);

    return () => clearInterval(interval);
  }, [fileUrl, pollInterval, checkFileStatus]);

  return {
    fileStatus,
    loading,
    error,
    refetch: checkFileStatus
  };
};