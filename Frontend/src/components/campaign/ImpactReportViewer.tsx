import React from 'react';

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
  if (!reportUrl) {
    return (
      <div className={`bg-gray-50 rounded-lg p-6 text-center ${className}`}>
        <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No Impact Report</h3>
        <p className="text-gray-500 text-sm">
          The impact report will be available once the campaign organizer uploads it.
        </p>
      </div>
    );
  }

  const getFileSize = () => {
    // This would typically come from the backend
    return '200 KB';
  };

  const getFileIcon = () => {
    return (
      <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-3">
        <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      </div>
    );
  };

  return (
    <div className={`bg-white rounded-lg border border-gray-200 p-4 ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          {getFileIcon()}
          <div>
            <h4 className="text-sm font-medium text-gray-900">{reportName}</h4>
            <p className="text-xs text-gray-500">{getFileSize()}</p>
            {uploadDate && (
              <p className="text-xs text-gray-400">Uploaded: {uploadDate}</p>
            )}
          </div>
        </div>
        <a
          href={reportUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-register-green text-white px-4 py-2 rounded-md text-sm hover:bg-green-600 transition-colors"
        >
          View Report
        </a>
      </div>
    </div>
  );
};

export default ImpactReportViewer;