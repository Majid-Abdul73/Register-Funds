import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import DashboardHeader from '../../components/DashboardHeader';
import Sidebar from '@/components/Sidebar';
import VerificationCard from '../../components/VerificationCard';
import { useCampaigns } from '../../hooks/useCampaigns';
import { useSchool } from '../../hooks/useSchools';
import { Campaign } from '../../types/campaign';
import { auth } from '../../config/firebase';

export default function DashboardPage() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Use real API calls instead of mock data
  const { data: campaigns, isLoading: campaignsLoading, error: campaignsError } = useCampaigns();
  
  // Get current user's school ID from Firebase auth
  const currentUserId = auth.currentUser?.uid || '';
  const { data: currentSchool, isLoading: schoolLoading, error: schoolError } = useSchool(currentUserId);
  
  const [stats, setStats] = useState({
    totalCampaigns: 0,
    totalDonations: 0,
    studentPopulation: 0
  });

  // Calculate stats based on real data
  useEffect(() => {
    if (campaigns && currentSchool) {
      const userCampaigns = campaigns.filter(campaign => campaign.schoolId === currentUserId);
      const totalDonations = userCampaigns.reduce((sum, campaign) => sum + campaign.amountRaised, 0);
      
      setStats({
        totalCampaigns: userCampaigns.length,
        totalDonations,
        studentPopulation: currentSchool?.students?.total || 0
      });
    }
  }, [campaigns, currentSchool, currentUserId]);

  // Get user-specific campaigns
  const userCampaigns: Campaign[] = campaigns?.filter(campaign => campaign.schoolId === currentUserId) || [];

  if (campaignsLoading || schoolLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-register-green mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (campaignsError || schoolError) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600">Error loading dashboard data</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 px-4 py-2 bg-register-green text-white rounded-md"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-white shadow-sm">
        <DashboardHeader />
      </div>
      
      {/* Mobile Menu Button */}
      <div className="fixed top-4 left-4 z-50 lg:hidden">
        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="bg-register-green text-white p-2 rounded-md shadow-lg"
          aria-label="Toggle navigation menu"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {isMobileMenuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>
      
      {/* Main layout */}
      <div className="flex pt-16">
        {/* Sidebar */}
        <div className={`fixed lg:sticky left-0 top-16 bottom-0 bg-white z-40 w-64 transition-transform duration-300 ease-in-out ${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        } lg:static lg:block shadow-md h-[calc(100vh-4rem)]`}>
          <Sidebar />
        </div>
        
        {/* Overlay for mobile menu */}
        {isMobileMenuOpen && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          ></div>
        )}
        
        {/* Main content */}
        <div className="flex-1 p-4 md:p-6 lg:p-8 w-full transition-all duration-300">
          <div className="flex flex-col lg:flex-row gap-4 lg:gap-8">
            {/* Left Section */}
            <div className="w-full lg:flex-[3] space-y-6">
              {/* Header Card */}
              <div className="bg-register-green/10 rounded-lg p-6 md:p-14 -mt-6">
                <div className="flex items-center gap-2 text-gray-600 mb-2">
                  <img src="/images/location.svg" alt="" className="w-4 h-4" />
                  <span className="text-sm">
                    {userCampaigns.length > 0 
                      ? `${userCampaigns[userCampaigns.length - 1].location?.city}, ${userCampaigns[userCampaigns.length - 1].location?.country}`
                      : `${currentSchool?.city || 'Location not set'}, ${currentSchool?.country || ''}`
                    }
                  </span>
                </div>
                <h1 className="text-2xl md:text-3xl font-bold text-register-green mb-12">
                  {userCampaigns.length > 0 
                    ? userCampaigns[userCampaigns.length - 1].name
                    : `Support ${currentSchool?.schoolName || 'Your School'}`
                  }
                </h1>
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                  <Link 
                    to="/settings" 
                    className="px-6 py-2 bg-white rounded-md text-sm hover:bg-gray-50 transition-colors flex items-center gap-2"
                  >
                    Update School Profile
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                  <Link 
                    to="/campaigns/new" 
                    className="px-6 py-2 bg-white rounded-md text-sm hover:bg-gray-50 transition-colors flex items-center gap-2"
                  >
                    Create a New Campaign
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>
              </div>

              {/* Ongoing Campaigns */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-medium">Ongoing Campaign</h2>
                  {userCampaigns.length > 0 && (
                    <Link to="/campaigns" className="text flex items-center text-sm">
                      View all
                      <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  )}
                </div>
                
                {userCampaigns.length > 0 ? (
                  <div className="space-y-4">
                    {userCampaigns.slice(0, 2).map(campaign => (
                      <div key={campaign.id} className="bg-white rounded-lg shadow-sm p-4">
                        <div className="flex flex-col sm:flex-row gap-4">
                          {/* Campaign Image */}
                          <div className="w-full sm:w-1/2 relative">
                            <div className="aspect-[16/9] sm:aspect-[16/8] rounded-lg overflow-hidden">
                              <img 
                                src={campaign.mediaUrl || "/images/campaign-placeholder.jpg"} 
                                alt={campaign.name} 
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="absolute bottom-2 left-2 bg-register-green text-white rounded-xl px-2 py-1">
                              <span className="text-xs">{campaign.category}</span>
                            </div>
                          </div>

                          {/* Campaign Details */}
                          <div className="w-full sm:w-1/2">
                            <div className="flex items-center gap-2 mb-2">
                              <img src="/images/location.svg" alt="" className="w-4 h-4" />
                              <span className="text-sm text-register-green">
                                {campaign.location?.city}, {campaign.location?.country}
                              </span>
                            </div>
                            <h3 className="font-medium mb-2">{campaign.name}</h3>
                            <p className="text-sm text-gray-500 mb-4">{campaign.description}</p>
                            <div className="w-full h-2 bg-gray-100 rounded-full mb-2">
                              <div 
                                className="h-full bg-register-green rounded-full"
                                style={{ width: `${Math.min((campaign.amountRaised / campaign.goal) * 100, 100)}%` }}
                              />
                            </div>
                            <div className="flex justify-between text-sm">
                              <span>Raised: ${campaign.amountRaised}</span>
                              <span>Goal: ${campaign.goal}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-gray-50 rounded-lg p-8 text-center">
                    <div className="flex justify-center mb-4">
                      <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center">
                        <img src="/images/ellipse1.svg" alt="No Campaigns" className="w-16 h-16" />
                      </div>
                    </div>
                    <h3 className="text-2xl font-semibold text-register-green mb-2">No Campaigns</h3>
                    <p className="text-gray-600 text-sm mb-6">Broadcast your challenges to donors who care</p>
                    <Link 
                      to="/campaigns/new" 
                      className="inline-flex items-center px-6 py-2 bg-white rounded-md text-sm hover:bg-gray-50 transition-colors border border-gray-200"
                    >
                      Create a New Campaign
                      <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  </div>
                )}
              </div>
            </div>

            {/* Right Section */}
            <div className="w-full lg:flex-1 space-y-6">
              {/* Stats Card */}
              <div className="bg-[#FFFFFF] rounded-lg p-6 -mt-6 mb-16">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-1 gap-4">
                  <div>
                    <h3 className="text-3xl md:text-4xl font-bold text-register-green">
                      {String(stats.totalCampaigns).padStart(2, '0')}
                    </h3>
                    <p className="text-sm text-gray-600">Launched Campaigns</p>
                  </div>
                  <div>
                    <h3 className="text-3xl md:text-4xl font-bold text-register-green">
                      ${(stats.totalDonations / 1000).toFixed(1)}K
                    </h3>
                    <p className="text-sm text-gray-600">Donations Received</p>
                  </div>
                  <div>
                    <h3 className="text-3xl md:text-4xl font-bold text-register-green">
                      {stats.studentPopulation.toLocaleString()}
                    </h3>
                    <p className="text-sm text-gray-600">Students Population</p>
                  </div>
                </div>
              </div>

              {/* Verification Card */}
              <VerificationCard />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}