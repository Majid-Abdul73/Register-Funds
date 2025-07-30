import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { auth } from '../config/firebase';

interface SchoolData {
  schoolName?: string;
  contactName?: string;
  email?: string;
  phone?: string;
  city?: string;
  country?: string;
  postalAddress?: string;
  students?: {
    male: number;
    female: number;
    total: number;
  };
  teachers?: {
    steamInvolved: number;
    nonSteamInvolved: number;
    total: number;
  };
}

// Mock school data
const mockSchoolData: SchoolData = {
  schoolName: "Accra Technical School",
  contactName: "John Doe",
  email: "contact@accratech.edu",
  phone: "+233 20 123 4567",
  city: "Accra",
  country: "Ghana",
  postalAddress: "P.O. Box 1234, Accra",
  students: {
    male: 250,
    female: 230,
    total: 480
  },
  teachers: {
    steamInvolved: 15,
    nonSteamInvolved: 20,
    total: 35
  }
};

export default function VerificationCard() {
  const [schoolData, setSchoolData] = useState<SchoolData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!auth.currentUser) {
      // Use mock data if not logged in
      setSchoolData(mockSchoolData);
      setLoading(false);
      return;
    }

    // Simulate fetching data with a timeout
    const timeoutId = setTimeout(() => {
      setSchoolData(mockSchoolData);
      setLoading(false);
    }, 500);

    return () => clearTimeout(timeoutId);
  }, []);

  // Real-time verification status checks
  const hasContactInfo = Boolean(
    schoolData?.contactName && 
    schoolData?.email && 
    schoolData?.phone
  );
  
  const hasAddress = Boolean(
    schoolData?.city && 
    schoolData?.country
  );
  
  const hasPopulation = Boolean(
    (schoolData?.students?.total && schoolData.students.total > 0) ||
    (schoolData?.teachers?.total && schoolData.teachers.total > 0)
  );
  
  const completedSteps = [hasContactInfo, hasAddress, hasPopulation].filter(Boolean).length;
  const isVerificationComplete = completedSteps === 3;

  const getNextVerificationStep = () => {
    if (!hasContactInfo) return '/settings?tab=security';
    if (!hasAddress) return '/settings?tab=profile';
    if (!hasPopulation) return '/settings?tab=population';
    return '/settings';
  };

  const getNextStepText = () => {
    if (!hasContactInfo) return 'Update Contact Information';
    if (!hasAddress) return 'Update School Address';
    if (!hasPopulation) return 'Update Student Population';
    return 'View Settings';
  };

  if (loading) {
    return (
      <div className="bg-register-green rounded-2xl p-6 text-white">
        <div className="animate-pulse">
          <div className="h-6 bg-white/20 rounded mb-4"></div>
          <div className="h-4 bg-white/20 rounded mb-4"></div>
          <div className="space-y-3">
            <div className="h-4 bg-white/20 rounded"></div>
            <div className="h-4 bg-white/20 rounded"></div>
            <div className="h-4 bg-white/20 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-500 rounded-2xl p-6 text-white">
        <h2 className="text-xl font-semibold mb-2">Verification Status Unavailable</h2>
        <p className="text-sm opacity-80 mb-4">{error}</p>
        <Link
          to="/settings"
          className="block w-full px-4 py-2.5 bg-white text-red-500 text-center rounded-md hover:bg-gray-50 transition-colors"
        >
          Go to Settings
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-register-green rounded-2xl p-6 text-white">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">
          {isVerificationComplete ? 'Verification Complete' : 'Complete your verification'}
        </h2>
        {/* Real-time indicator */}
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          <span className="text-xs opacity-75">Live</span>
        </div>
      </div>
      
      <p className="text-sm opacity-80 mb-4">
        {isVerificationComplete 
          ? 'Your school is fully verified and will receive priority funding'
          : 'Verified schools receive 2x more funding'}
      </p>
      
      {!isVerificationComplete && (
        <div className="text-sm mb-4">
          <span className="font-medium">
            {3 - completedSteps} out of 3
          </span> steps remaining
        </div>
      )}

      <div className="space-y-3">
        <div className={`flex items-center gap-2 transition-all duration-300 ${
          hasContactInfo ? 'opacity-100' : 'opacity-60'
        }`}>
          <div className={`w-5 h-5 rounded-full flex items-center justify-center transition-colors ${
            hasContactInfo ? 'bg-green-400' : 'bg-white/20'
          }`}>
            {hasContactInfo ? (
              <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            ) : (
              <div className="w-2 h-2 bg-white rounded-full"></div>
            )}
          </div>
          <span className="flex-1">Contact Information</span>
          {!hasContactInfo && (
            <Link 
              to="/settings?tab=security" 
              className="text-xs bg-white/20 px-2 py-1 rounded hover:bg-white/30 transition-colors"
            >
              Update
            </Link>
          )}
        </div>

        <div className={`flex items-center gap-2 transition-all duration-300 ${
          hasAddress ? 'opacity-100' : 'opacity-60'
        }`}>
          <div className={`w-5 h-5 rounded-full flex items-center justify-center transition-colors ${
            hasAddress ? 'bg-green-400' : 'bg-white/20'
          }`}>
            {hasAddress ? (
              <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            ) : (
              <div className="w-2 h-2 bg-white rounded-full"></div>
            )}
          </div>
          <span className="flex-1">School Address</span>
          {!hasAddress && (
            <Link 
              to="/settings?tab=profile" 
              className="text-xs bg-white/20 px-2 py-1 rounded hover:bg-white/30 transition-colors"
            >
              Update
            </Link>
          )}
        </div>

        <div className={`flex items-center gap-2 transition-all duration-300 ${
          hasPopulation ? 'opacity-100' : 'opacity-60'
        }`}>
          <div className={`w-5 h-5 rounded-full flex items-center justify-center transition-colors ${
            hasPopulation ? 'bg-green-400' : 'bg-white/20'
          }`}>
            {hasPopulation ? (
              <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            ) : (
              <div className="w-2 h-2 bg-white rounded-full"></div>
            )}
          </div>
          <span className="flex-1">School Population Data</span>
          {!hasPopulation && (
            <Link 
              to="/settings?tab=population" 
              className="text-xs bg-white/20 px-2 py-1 rounded hover:bg-white/30 transition-colors"
            >
              Update
            </Link>
          )}
        </div>

        {!isVerificationComplete && (
          <Link
            to={getNextVerificationStep()}
            className="block w-full px-4 py-2.5 bg-white text-register-green text-center rounded-md hover:bg-gray-50 transition-colors mt-4 font-medium"
          >
            {getNextStepText()}
          </Link>
        )}
        
        {isVerificationComplete && (
          <div className="mt-4 p-3 bg-green-400/20 rounded-lg">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-green-200" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="text-sm font-medium">Verification Complete!</span>
            </div>
            <p className="text-xs opacity-80 mt-1">Your school is now eligible for priority funding</p>
          </div>
        )}
      </div>
    </div>
  );
}