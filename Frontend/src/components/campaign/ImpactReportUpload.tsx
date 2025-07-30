import React, { useState } from 'react';
import { useFileUpload } from '../../hooks/useFileUpload';
import { toast } from 'react-hot-toast';

interface ImpactReportUploadProps {
  campaignId: string;
  onUploadSuccess?: (reportUrl: string) => void;
  existingReport?: string;
}

const ImpactReportUpload: React.FC<ImpactReportUploadProps> = ({
  campaignId,
  onUploadSuccess,
  existingReport
}) => {
  const [dragActive, setDragActive] = useState(false);
  const { uploadFile, uploading, error } = useFileUpload();

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileUpload(e.target.files[0]);
    }
  };

  const handleFileUpload = async (file: File) => {
    // Validate file type
    const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!allowedTypes.includes(file.type)) {
      toast.error('Please upload a PDF or Word document');
      return;
    }

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size must be less than 5MB');
      return;
    }

    try {
      const reportUrl = await uploadFile(file, `campaigns/${campaignId}/reports`);
      if (reportUrl) {
        toast.success('Impact report uploaded successfully!');
        onUploadSuccess?.(reportUrl);
      }
    } catch (err) {
      toast.error('Failed to upload impact report');
    }
  };

  const getFileIcon = () => {
    return (
      <svg className="w-12 h-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    );
  };

  if (existingReport) {
    return (
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
        <div className="text-center">
          <div className="flex items-center justify-center mb-4">
            <svg className="w-8 h-8 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-green-600 font-medium">Impact Report Uploaded</span>
          </div>
          <div className="flex gap-3 justify-center">
            <a
              href={existingReport}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-register-green text-white px-4 py-2 rounded-md hover:bg-green-600 transition-colors"
            >
              View Report
            </a>
            <label className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 transition-colors cursor-pointer">
              Replace Report
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

  return (
    <div
      className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
        dragActive ? 'border-register-green bg-green-50' : 'border-gray-300'
      } ${uploading ? 'opacity-50 pointer-events-none' : ''}`}
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
    >
      {uploading ? (
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-register-green mb-4"></div>
          <p className="text-gray-600">Uploading impact report...</p>
        </div>
      ) : (
        <>
          {getFileIcon()}
          <p className="text-register-green mb-2 font-medium">Click to upload or drag and drop</p>
          <p className="text-gray-500 text-sm mb-4">PDF, DOC, or DOCX (max. 5MB)</p>
          
          <label className="bg-register-green text-white px-6 py-2 rounded-md hover:bg-green-600 transition-colors cursor-pointer inline-block">
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
        <p className="text-red-500 text-sm mt-2">{error}</p>
      )}
    </div>
  );
};

export default ImpactReportUpload;