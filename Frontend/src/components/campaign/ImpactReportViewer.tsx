import React from 'react';
import { useFileStatus } from '../../hooks/useFileStatus';

interface ImpactReportViewerProps {
  reportUrl?: string;
  reportName?: string;
  uploadDate?: string;
  className?: string;
}

const ImpactReportViewer: React.FC<ImpactReportViewerProps> = ({
  reportUrl,
  reportName = 'Impact Report',
  uploadDate,
  className = ''
}) => {
  // Use the file status hook to check file existence in real-time
  const { fileStatus, loading, error } = useFileStatus(reportUrl, 10000); // Check every 10 seconds

  // Function to clean filename by removing timestamp and unique IDs
  const cleanFileName = (fileName: string) => {
    // Remove timestamp prefix (e.g., "1703123456789_")
    const withoutTimestamp = fileName.replace(/^\d+_/, '');
    // Remove UUID patterns and other unique identifiers
    const withoutUUID = withoutTimestamp.replace(/[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}/gi, '');
    // Remove any remaining underscores or dashes at the beginning
    return withoutUUID.replace(/^[_-]+/, '');
  };

  // Show loading state while checking file status
  if (loading && !fileStatus) {
    return (
      <div className={`flex bg-gray-50 rounded-lg p-6 items-center gap-5 ${className}`}>
        <div className="w-12 h-12 p-2 bg-gray-100 rounded-full flex items-center justify-center animate-pulse">
          <div className="w-6 h-6 bg-gray-300 rounded"></div>
        </div>
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Checking file status...</h3>
        </div>
      </div>
    );
  }

  // Show error state if file checking failed
  if (error) {
    return (
      <div className={`flex bg-red-50 rounded-lg p-6 items-center gap-5 ${className}`}>
        <div className="w-12 h-12 p-2 bg-red-100 rounded-full flex items-center justify-center">
          <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div>
          <h3 className="text-lg font-medium text-red-900 mb-2">Error checking file</h3>
          <p className="text-sm text-red-700">{error}</p>
        </div>
      </div>
    );
  }

  // Show "no file" state if no URL provided or file doesn't exist
  if (!reportUrl || (fileStatus && !fileStatus.exists)) {
    return (
      <div className={`flex bg-gray-50 rounded-lg p-6 items-center gap-5 ${className}`}>
        <div className="w-12 h-12 p-2 bg-green-100 rounded-full flex items-center justify-center">
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
            <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
            <g id="SVGRepo_iconCarrier">
              <path d="M19 9V17.8C19 18.9201 19 19.4802 18.782 19.908C18.5903 20.2843 18.2843 20.5903 17.908 20.782C17.4802 21 16.9201 21 15.8 21H8.2C7.07989 21 6.51984 21 6.09202 20.782C5.71569 20.5903 5.40973 20.2843 5.21799 19.908C5 19.4802 5 18.9201 5 17.8V6.2C5 5.07989 5 4.51984 5.21799 4.09202C5.40973 3.71569 5.71569 3.40973 6.09202 3.21799C6.51984 3 7.0799 3 8.2 3H13M19 9L13 3M19 9H14C13.4477 9 13 8.55228 13 8V3" stroke="#16a34a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
            </g>
          </svg>
        </div>
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {!reportUrl ? 'No Impact Report' : 'File Not Found'}
          </h3>
          {!reportUrl ? null : (
            <p className="text-sm text-gray-600">The file may have been moved or deleted.</p>
          )}
        </div>
      </div>
    );
  }

  const getFileIcon = () => {
    return (
      <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
        <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      </div>
    );
  };

  // Use filename from backend if available, otherwise clean the provided name
  const displayName = fileStatus?.fileName ? cleanFileName(fileStatus.fileName) : cleanFileName(reportName);

  return (
    <div className={`bg-[#FFFFFF] rounded-lg p-4 ${className}`}>
      <a
        href={reportUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center space-x-3 hover:bg-gray-50 rounded-lg p-2 transition-colors cursor-pointer"
      >
        {getFileIcon()}
        <div>
          <h4 className="text-lg font-medium text-gray-900 hover:text-green-700">{displayName}</h4>
          {fileStatus?.formattedSize && (
            <p className="text-lg text-gray-500">{fileStatus.formattedSize}</p>
          )}
          {uploadDate && (
            <p className="text-xs text-gray-400">Uploaded: {uploadDate}</p>
          )}
          {fileStatus && (
            <p className="text-xs text-green-600">✓ File verified</p>
          )}
        </div>
      </a>
    </div>
  );
};

export default ImpactReportViewer;