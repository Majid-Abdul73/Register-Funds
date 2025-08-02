import React, { useState } from 'react';
import { useFileUpload } from '../../hooks/useFileUpload';
import { toast } from 'react-hot-toast';

interface ImpactReportUploadProps {
  campaignId: string;
  onUploadSuccess?: (reportUrl: string) => void;
  existingReport?: string;
  fileName?: string;
  fileSize?: number;
}

const ImpactReportUpload: React.FC<ImpactReportUploadProps> = ({
  campaignId,
  onUploadSuccess,
  existingReport,
  fileName,
  fileSize
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const [uploadedFileSize, setUploadedFileSize] = useState<number | null>(null);
  const { uploadFile, uploading, error } = useFileUpload();

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(e.type === "dragenter" || e.type === "dragover");
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files?.[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      handleFileUpload(e.target.files[0]);
    }
  };

  const handleFileUpload = async (file: File) => {
    const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    
    if (!allowedTypes.includes(file.type)) {
      toast.error('Please upload a PDF or Word document');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size must be less than 5MB');
      return;
    }

    try {
      const reportUrl = await uploadFile(file, `campaigns/${campaignId}/reports`);
      if (reportUrl) {
        setUploadedFileName(file.name);
        setUploadedFileSize(file.size);
        toast.success('Impact report uploaded successfully!');
        onUploadSuccess?.(reportUrl);
      }
    } catch (err) {
      toast.error('Failed to upload impact report');
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const displayFileName = uploadedFileName || fileName || 'Impact Report';
  const displayFileSize = uploadedFileSize || fileSize || 200 * 1024;

  // File uploaded state
  if (existingReport || uploadedFileName) {
    return (
      <div className="rounded-lg p-6">
        <div className='flex justify-between'>
        <div className="bg-">
          <div className="flex items-center gap-3 ">
            <div className="w-12 h-12 p-2 bg-green-100 rounded-full flex items-center justify-center">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M19 9V17.8C19 18.9201 19 19.4802 18.782 19.908C18.5903 20.2843 18.2843 20.5903 17.908 20.782C17.4802 21 16.9201 21 15.8 21H8.2C7.07989 21 6.51984 21 6.09202 20.782C5.71569 20.5903 5.40973 20.2843 5.21799 19.908C5 19.4802 5 18.9201 5 17.8V6.2C5 5.07989 5 4.51984 5.21799 4.09202C5.40973 3.71569 5.71569 3.40973 6.09202 3.21799C6.51984 3 7.0799 3 8.2 3H13M19 9L13 3M19 9H14C13.4477 9 13 8.55228 13 8V3" stroke="#16a34a" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg>
            </div>
            <div>
              {existingReport && uploadedFileName ? (
                <a
                  href={existingReport}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-green-600 hover:text-green-700 underline"
                >
                  {displayFileName}
                </a>
              ) : (
                <p className="font-medium text-gray-800">{displayFileName}</p>
              )}
              <p className="text-sm text-gray-500">{formatFileSize(displayFileSize)}</p>
            </div>
          </div>
          
          
        </div>
        <div>
          <label className="text-gray-600 text-sm font-medium bg-register-gray/10 rounded py-2 px-4 w-full sm:w-auto hover:bg-gray-200">
            Upload Report
            <input
              type="file"
              className="hidden"
              accept=".pdf,.doc,.docx"
              onChange={handleFileChange}
              disabled={uploading}
            />
          </label>
        </div>
        </div>
      </div>
    );
  }

  // Upload state
  return (
    <div
      className={`border-2 border-dashed rounded-lg p-8 text-center transition-all ${
      dragActive ? 'border-green-400 bg-green-50' : 'border-gray-300 hover:border-gray-400'
      } ${uploading ? 'opacity-50 pointer-events-none' : ''}`}
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
    >
      {uploading ? (
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-gray-300 border-t-green-600 mb-3"></div>
          <p className="text-gray-600">Uploading...</p>
        </div>
      ) : (
        <>
          <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
          </svg>
          <h3 className="text-lg font-medium text-gray-800 mb-2">Upload Impact Report</h3>
          <p className="text-gray-500 mb-4">Drag and drop or click to select</p>
          <p className="text-sm text-gray-400 mb-6">PDF, DOC, or DOCX files up to 5MB</p>
          
          <label className="inline-flex items-center px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 cursor-pointer transition-colors">
            Select File
            <input
              type="file"
              className="hidden"
              accept=".pdf,.doc,.docx"
              onChange={handleFileChange}
              disabled={uploading}
            />
          </label>
        </>
      )}
      
      {error && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
          {error}
        </div>
      )}
    </div>
  );
};

export default ImpactReportUpload;