import { Suspense, lazy, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Loading from '../components/Loading';
import QuickShare from '../components/modal/QuickShare';
import SchoolProfile from '../components/modal/SchoolProfile';
import { useCampaign, useCampaigns } from '../hooks/useCampaigns';
import { useCampaignUpdates } from '../hooks/useUpdates';
import { useSchool } from '../hooks/useSchools'; // Add this import
import ImpactReportViewer from '../components/campaign/ImpactReportViewer';

const Navbar = lazy(() => import('../components/Navbar'));

const ChallengePage = () => {
  const navigate = useNavigate();
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const { id } = useParams();

  // Real API calls
  const { data: campaign, isLoading, error } = useCampaign(id!);
  const { data: updates } = useCampaignUpdates(id!);
  const { data: allCampaigns } = useCampaigns();
  
  // Fetch school data using the schoolId from campaign
  const { data: school, isLoading: schoolLoading } = useSchool(campaign?.schoolId || '');

  if (isLoading) return <Loading size="lg" text="Loading campaign details" className="min-h-screen" />;
  if (error) return <div>Error: {error.message}</div>;
  if (!campaign) return <div>Campaign not found</div>;

  // Merge campaign data with updates
  const campaignWithUpdates = {
    ...campaign,
    updates: updates || []
  };

  // Get other campaigns (excluding current one) for the "Other Campaigns" section
  const otherCampaigns = allCampaigns?.filter(c => c.id !== campaign.id).slice(0, 5) || [];

  // Replace with real API call when donors endpoint is available
  const recentDonors = [
    { name: 'Anonymous', amount: 50 },
    { name: 'John Doe', amount: 100 },
    { name: 'Jane Smith', amount: 75 },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <Suspense fallback={<Loading size="md" text="Loading navigation" />}>
        <Navbar variant="transparent" className="fixed top-0 left-0 right-0 z-50" />
      </Suspense>

      <div className="mt-20">
        {/* Back Button */}
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-4 mb-6 text-gray-600"
        >
          <img src="/images/back.svg" alt="" className='w-2'/>
          All Campaigns
        </button>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12">
          {/* Part 1 & 2 - Main Content */}
          <div className="col-span-1 lg:col-span-8">
            {/* Campaign Images */}
            <div className="relative rounded-xl overflow-hidden mb-2">
              <img
                src={campaign.mediaUrl || ''}
                alt=""
                className="w-full h-[300px] md:h-[300px] object-cover"
              />
            </div>
            
            {/* Image Gallery */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-0 mb-6">
              {campaign.additionalImages && campaign.additionalImages.length > 0 && (
                campaign.additionalImages.slice(0, 4).map((imageUrl: string, index: number) => (
                  <div 
                    key={index} 
                    className="aspect-[4/3] rounded-lg overflow-hidden border-2 border-white hover:opacity-90 transition-opacity cursor-pointer"
                  >
                    <img
                      src={imageUrl}
                      alt={`Campaign image ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))
              )}
            </div>

            {/* Campaign Info */}
            <div className="space-y-4 mb-6 -mt-8 py-12 max-w-3xl">
              <div className="flex flex-wrap items-center gap-4 text-register-green">
                <div className="flex items-center gap-2">
                  <img src="/images/location.svg" alt="" className="w-5 h-5" />
                  <span className="text-sm md:text-base">{campaign.location?.city}, {campaign.location?.country}</span>
                </div>
              </div>
              
              <h1 className="text-xl md:text-2xl font-bold">{campaign.name}</h1>

              <span className="absolute bg-green-500 text-white px-2 rounded-full text-xs py-2">
                {campaign.category}
              </span>
            </div>

            {/* Description and Updates sections */}
            <div className="border-t-2 border-b-2 py-8 md:py-12 max-w-2xl">
              <p className="text-sm md:text-base text-gray-600">{campaign.description}</p>
            </div>

            {/* Update section */}
            <div className="border-t- border-b-2 py-8 md:py-12 max-w-2xl">
              <div className="mb-6">
                <h2 className="text-xl font-bold mb-4">Updates</h2>
                <div className="space-y-4">
                  {campaignWithUpdates.updates && campaignWithUpdates.updates.length > 0 ? (
                    campaignWithUpdates.updates.map((update: any) => (
                      <div key={update.id}>
                        <div className="flex items-center gap-2 text-gray-600 text-sm mb-2">
                          <span>
                            {update.createdAt instanceof Date 
                              ? update.createdAt.toLocaleDateString()
                              : new Date(update.createdAt?.seconds * 1000 || update.createdAt).toLocaleDateString()
                            }
                          </span>
                          <span>by {update.author}</span>
                        </div>
                        <p className="text-gray-600 text-sm">
                          {update.content}
                        </p>
                      </div>
                    ))
                  ) : (
                    <div className="text-gray-500 text-sm">
                      No updates available for this campaign yet.
                    </div>
                  )}
                </div>
                {campaignWithUpdates.updates && campaignWithUpdates.updates.length > 3 && (
                  <button className="text-gray-600 text-sm mt-4 hover:text-gray-800">
                    See older updates
                  </button>
                )}
              </div>


              {/* Impact report section */}
              <div className="py-8 md:py-12 max-w-2xl">
                <h2 className="text-xl font-bold mb-4">Impact Report</h2>
    
                <ImpactReportViewer
                  reportUrl={campaign.impactReport?.url}
                  reportName={campaign.impactReport?.fileName || 'Impact Report'}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button 
                  onClick={() => navigate(`/donation/${campaign.id}`)}
                  className="bg-register-green text-white py-3 rounded-lg font-medium"
                >
                  Donate
                </button>
                <button 
                  onClick={() => setIsShareOpen(true)}
                  className="bg-black text-white py-3 rounded-lg font-medium"
                >
                  Share
                </button>
              </div>
            </div>


            

            {/* Organizer Section */}
            <div className="py-8 max-w-2xl">
              <h2 className="text-xl font-bold mb-4">Organizer</h2>
              <div className="flex items-center gap-4 mb-8">
                <div className="w-10 h-10 rounded-full shadow bg-register-green flex items-center justify-center text-white text-xs font-semibold">
                  {campaign.organizer?.name?.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 className="font-medium">{campaign.organizer?.name}</h3>
                </div>
              </div>

              <h2 className="text-xl font-semibold mb-4">on Behalf of</h2>
           
              <h3 className="text-3xl md:text-2xl font-semibold mb-2">
                {schoolLoading ? 'Loading...' : (school?.schoolName || 'School name not available')}
              </h3>
              
              <div className="flex items-center gap-2 mb-4">
                <img src="/images/location-b.svg" alt="" className="w-5 h-5" />
                <span className="text-sm md:text-base">
                  {campaign.location?.city && campaign.location?.country 
                    ? `${campaign.location.city}, ${campaign.location.country}`
                    : school && !schoolLoading 
                    ? `${school.city}, ${school.country}`
                    : 'Location not available'
                  }
                </span>
              </div>
              
              <button
                onClick={() => setIsProfileOpen(true)}
                className="inline-flex items-center justify-between text-register-green font-medium py-2 px-2 rounded-lg bg-register-green-light text-md w-[200px]"
              >
                <span>View School Profile</span>
                <img src="/images/greater.svg" alt="" className="w-[15px] h-[15px]"/>
              </button>

              <SchoolProfile
                isOpen={isProfileOpen}
                onClose={() => setIsProfileOpen(false)}
                schoolId={campaign.schoolId}
              />
            </div>
          </div>

          {/* Part 3 - Donation Info */}
          <div className="col-span-1 lg:col-span-4">
            <div className="bg-[#FFFFFF] rounded-xl p-4 md:p-6 shadowlg shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)]">
              {/* Amount Raised */}
              <div className="mb-6">
                <h2 className="text-2xl font-bold mb-1">
                  ${campaign.amountRaised?.toLocaleString()} raised
                </h2>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <span>${campaign.goal?.toLocaleString()} Goal</span>
                  <span>•</span>
                  <span>{recentDonors.length} donations</span>
                </div>

                {/* Progress Circle */}
                <div className="relative w-16 h-16 ml-auto -mt-12">
                  <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                    <path
                      d="M18 2.0845
                        a 15.9155 15.9155 0 0 1 0 31.831
                        a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="#E6E6E6"
                      strokeWidth="3"
                    />
                    <path
                      d="M18 2.0845
                        a 15.9155 15.9155 0 0 1 0 31.831
                        a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="#22C55E"
                      strokeWidth="3"
                      strokeDasharray={`${(campaign.amountRaised / campaign.goal) * 100}, 100`}
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center text-sm">
                    {Math.round((campaign.amountRaised / campaign.goal) * 100)}%
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className='border-b-2'>
              <button 
                onClick={() => navigate(`/donation/${campaign.id}`)}
                className="w-full bg-register-green text-white py-3 rounded-lg font-medium mb-3" >
                Donate
              </button>

              <button 
                onClick={() => setIsShareOpen(true)} 
                className="w-full bg-black text-white py-3 rounded-lg font-medium mb-10" >
                Share
              </button>
              </div>
              
              {/* QuickShare component: */}
              <QuickShare
                isOpen={isShareOpen}
                onClose={() => setIsShareOpen(false)}
                campaign={{
                  name: campaign.name,
                  url: `${window.location.origin}/challenge/${campaign.id}`
                }}
              />
              {/* Recent Donors */}
              <div className='py-6'>
                <div className="flex items-center gap-2 mb-4">
                  <svg className="w-5 h-5 text-register-green" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-register-green">... people are already donated</span>
                </div>

                <div className="space-y-4">
                  {recentDonors.map((donor, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gray-200 rounded-full" />
                      <div>
                        <div className="font-medium">{donor.name}</div>
                        <div className="text-sm text-gray-600">${donor.amount}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section - Other Campaigns */}
        <div className="mt-12 md:mt-24 border-t-2 py-8 md:py-12">
          <h2 className="text-xl md:text-2xl font-semibold mb-6 md:mb-8">Other Campaigns</h2>
          <div className="relative">
            <div className="overflow-x-auto scrollbar-hide -mx-4 px-4">
              <div className="flex gap-4 md:gap-6" style={{ width: 'max-content' }}>
                {otherCampaigns.length > 0 ? (
                  otherCampaigns.map((otherCampaign) => (
                    <div key={otherCampaign.id} className="bg-white p-2 rounded-xl shadow-[0_2px_15px_-3px_rgba(170,170,170,0.3),0_10px_20px_-2px_rgba(170,170,170,0.25)] flex cursor-pointer hover:shadow-lg transition-shadow" style={{ width: '500px', minWidth: '500px' }} onClick={() => navigate(`/challenge/${otherCampaign.id}`)}>
                      {/* Left side - Image */}
                      <div className="w-1/2">
                        <div className="h-full">
                          <img
                            src={otherCampaign.mediaUrl}
                            alt=""
                            className="w-full h-ful h-[180px] rounded-md object-cover"
                          />
                        </div>
                      </div>
                      
                      {/* Right side - Content */}
                      <div className="w-1/2 h-full px-4">
                        <div className="flex items-center gap-2 mb-2 text-register-green">
                          <img src="/images/location.svg" alt="" className="w-4 h-4" />
                          <span className="text-sm">
                            {otherCampaign.location?.city}, {otherCampaign.location?.country}
                          </span>
                        </div>
                        <h3 className="font-medium mb-1 text-sm md:text-base line-clamp-2">{otherCampaign.name}</h3>
                        <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                          {otherCampaign.description}
                        </p>
                        <div className="flex justify-between text-xs md:text-sm font-medium">
                          <span>Goal: ${otherCampaign.goal?.toLocaleString()}</span>
                          <span>Raised: ${otherCampaign.amountRaised?.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-gray-500 text-center py-8">
                    No other campaigns available at the moment.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChallengePage;