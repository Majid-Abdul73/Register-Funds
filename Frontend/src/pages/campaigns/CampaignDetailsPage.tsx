import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import DashboardHeader from '../../components/DashboardHeader';
import Sidebar from '../../components/Sidebar';
import EditCampaignModal from '../../components/campaign/EditCampaignModal';
import UpdatesManager from '../../components/campaign/UpdatesManager';
import QuickShare from '../../components/modal/QuickShare';
import MultipleImageUpload from '../../components/campaign/MultipleImageUpload';
import ImpactReportUpload from '../../components/campaign/ImpactReportUpload';
import { useCampaign, useUpdateCampaign, useDeleteCampaign } from '../../hooks/useCampaigns';
import { toast } from 'react-hot-toast';

export interface Campaign {
  id: string;
  name: string;
  description: string;
  goal: number;
  startDate: string;
  endDate: string;
  category: string;
  amountRaised: number;
  status: string;
  additionalImages: string[];
  mediaUrl: string;
  schoolId: string;
  updates?: any[];
  location?: {
    city: string;
    country: string;
  };
  organizer?: {
    name: string;
    profileImage?: string;
  };
  impactReport?: {
    url: string;
    uploadDate: string;
    fileName?: string;
  };
}

export default function CampaignDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [editModal, setEditModal] = useState<{ isOpen: boolean; field: 'title' | 'category' | 'description' | null }>({ isOpen: false, field: null });
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  // Add this missing state variable
  const [isMarkingCompleted, setIsMarkingCompleted] = useState(false);

  // Use real API hooks
  const { data: campaign, isLoading: loading, error } = useCampaign(id!);
  const updateCampaignMutation = useUpdateCampaign();
  const deleteCampaignMutation = useDeleteCampaign();

  const handleFieldUpdate = async (field: string, value: string) => {
    if (!campaign) return;
    
    try {
      await updateCampaignMutation.mutateAsync({
        id: campaign.id,
        data: { [field === 'title' ? 'name' : field]: value }
      });
    } catch (error) {
      console.error('Error updating campaign:', error);
    }
  };

  const handleImagesChange = async (images: string[]) => {
    if (!campaign) return;
    
    try {
      await updateCampaignMutation.mutateAsync({
        id: campaign.id,
        data: { additionalImages: images }
      });
    } catch (error) {
      console.error('Error updating campaign images:', error);
    }
  };

  const handleDelete = async () => {
    if (!campaign) return;
    
    try {
      await deleteCampaignMutation.mutateAsync(campaign.id);
      navigate('/campaigns');
    } catch (error) {
      console.error('Error deleting campaign:', error);
    }
  };

  const handleMarkAsCompleted = async () => {
    if (!campaign) return;
    
    setIsMarkingCompleted(true);
    try {
      await updateCampaignMutation.mutateAsync({
        id: campaign.id,
        data: { status: 'completed' }
      });
      toast.success('Campaign marked as completed successfully!');
    } catch (error) {
      console.error('Error marking campaign as completed:', error);
    } finally {
      setIsMarkingCompleted(false);
    }
  };

  const handleImpactReportUpload = async (reportUrl: string, fileName?: string) => {
    if (!campaign) return;
    
    try {
      await updateCampaignMutation.mutateAsync({
        id: campaign.id,
        data: {
          impactReport: {
            url: reportUrl,
            uploadDate: new Date().toISOString(),
            fileName: fileName
          }
        }
      });
      toast.success('Impact report uploaded successfully!');
    } catch (error) {
      console.error('Error uploading impact report:', error);
      toast.error('Failed to upload impact report');
    }
  };

  const openEditModal = (field: 'title' | 'category' | 'description') => {
    setEditModal({ isOpen: true, field });
  };

  const closeEditModal = () => {
    setEditModal({ isOpen: false, field: null });
  };

  const openShareModal = () => {
    setIsShareModalOpen(true);
  };

  const closeShareModal = () => {
    setIsShareModalOpen(false);
  };

  if (loading) return (
    <div className="min-h-screen flex justify-center items-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-register-green"></div>
    </div>
  );
  
  if (error || !campaign) return (
    <div className="min-h-screen flex justify-center items-center">
      <div className="text-center p-4">
        <h2 className="text-xl font-semibold mb-2">Campaign not found</h2>
        <p className="text-gray-600 mb-4">The campaign you're looking for doesn't exist or has been removed.</p>
        <Link to="/campaigns" className="text-register-green hover:underline">
          Return to all campaigns
        </Link>
      </div>
    </div>
  );

  const donationProgress = Math.min((campaign.amountRaised / campaign.goal) * 100, 100);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-white shadow-sm">
        <DashboardHeader />
      </div>
      
      {/* Mobile Menu Button */}
      <div className="fixed top-4 left-5 z-50 lg:hidden">
        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="bg-register-green text-white p-2 rounded-md shadow-lg"
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
        <div className={`fixed left-0 top-16 bottom-0 bg-white z-40 w-64 transition-transform duration-300 ease-in-out ${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        } lg:static lg:block shadow-md`}>
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
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
            {/* Left Column - Main Content */}
            <div className="lg:col-span-2">
              <Link to="/campaigns" className="flex items-center font-semibold text-lg mb-6">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                All Campaigns
              </Link>

              <div className="rounded-lg overflow-hidden bg-white shadow-sm">
                {/* Main Image */}
                <img 
                  src={campaign.mediaUrl} 
                  alt={campaign.name}
                  className="w-full h-48 sm:h-64 md:h-80 lg:h-96 object-cover"
                />
                
                {/* Thumbnail Images */}
                <div className="mt-2 p-2">
                  <MultipleImageUpload
                    campaignId={campaign.id}
                    existingImages={campaign.additionalImages || []}
                    onImagesUpdate={handleImagesChange}
                  />
                </div>

                <div className="p-4">
                  {/* Location & School */}
                  <div className="flex items-center gap-4 mb-4">
                    <div className="flex items-center gap-2">
                      <img src="/images/location.svg" alt="" className="w-5"/>
                      <span className="text-register-green text-sm">
                        {campaign.location ? `${campaign.location.city}, ${campaign.location.country}` : 'Location not specified'}
                      </span>
                    </div>
                  </div>
               
                  {/* Campaign Title */}
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center w-full gap-3 mb-4">
                    <h1 className="text-xl md:text-2xl font-bold">{campaign.name}</h1>
                    <button 
                      onClick={() => openEditModal('title')}
                      className="text-gray-600 text-sm font-medium bg-register-gray/10 rounded py-2 px-4 w-full sm:w-auto hover:bg-gray-200"
                      disabled={updateCampaignMutation.isPending}
                    >
                      {updateCampaignMutation.isPending ? 'Updating...' : 'Edit Campaign Title'}
                    </button>
                  </div>

                  {/* Category */}
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center w-full gap-3 mb-6">
                    <span className="bg-green-500 text-white px-2 py-1 rounded-full text-xs w-fit">
                      {campaign.category}
                    </span>
                    <button 
                      onClick={() => openEditModal('category')}
                      className="text-gray-600 text-sm font-medium bg-register-gray/10 rounded py-2 px-4 w-full sm:w-auto hover:bg-gray-200"
                      disabled={updateCampaignMutation.isPending}
                    >
                      {updateCampaignMutation.isPending ? 'Updating...' : 'Edit Category'}
                    </button>
                  </div>

                  {/* Description */}
                  <div className="border-t-2 border-b-2 py-6 md:py-8">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start w-full gap-4">
                      <p className="text-sm md:text-base text-gray-600 flex-1">{campaign.description}</p>
                      <button 
                        onClick={() => openEditModal('description')}
                        className="text-gray-600 text-sm font-medium bg-register-gray/10 rounded py-2 px-4 w-full sm:w-auto flex-shrink-0 hover:bg-gray-200"
                        disabled={updateCampaignMutation.isPending}
                      >
                        {updateCampaignMutation.isPending ? 'Updating...' : 'Edit Description'}
                      </button>
                    </div>
                  </div>

                  {/* Updates Manager */}
                  <UpdatesManager 
                    campaignId={campaign.id}
                    campaign={campaign}
                  />
                </div>

                {/* Impact Report Upload Section */}
                <div className="py-6 md:py-8">
                  <h2 className="text-xl px-5 font-bold mb-4">Impact Report</h2>
                  <ImpactReportUpload
                    campaignId={campaign.id}
                    onUploadSuccess={(reportUrl) => {
                      // Extract filename from the URL or use a default name
                      const fileName = reportUrl.split('/').pop() || 'Impact Report';
                      handleImpactReportUpload(reportUrl, fileName);
                    }}
                    existingReport={campaign.impactReport?.url}
                  />
                </div>

                {/* Desktop Action Buttons */}
                <div className="rounded-lg shadow-sm py-4 mt-6 hidden lg:block w-3/4">
                  <div className="flex gap-3">
                    <button 
                      onClick={openShareModal}
                      className="flex-1 bg-register-green text-white py-2 px-4 rounded-md hover:bg-green-600 transition-colors"
                    >
                      Share Campaign
                    </button>
                    <button 
                      onClick={() => setShowDeleteConfirm(true)}
                      className="flex-1 bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 transition-colors"
                    >
                      Delete Campaign
                    </button>
                  </div>
                </div>

                {/* Mobile Action Buttons */}
                <div className="rounded-lg shadow-sm py-4 px-4 lg:hidden">
                  <div className="flex gap-3">
                    <button 
                      onClick={openShareModal}
                      className="flex-1 bg-register-green text-white py-2 px-4 rounded-md hover:bg-green-600 transition-colors"
                    >
                      Share Campaign
                    </button>
                    <button 
                      onClick={() => setShowDeleteConfirm(true)}
                      className="flex-1 bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </div>

                {/* Organizer */}
                <div className="rounded-lg shadow-sm py-6 px-4">
                  <h2 className="font-medium mb-4">Organizer</h2>
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full mr-3 bg-register-green flex items-center justify-center text-white font-semibold">
                      {campaign.organizer?.name?.charAt(0).toUpperCase()}
                    </div>

                    <div>
                      <p className="font-medium">{campaign.organizer?.name}</p>
                      <p className="text-sm text-gray-500">{campaign.organizer?.role || 'Campaign organizer'}</p>
                    </div>

                  </div>
                </div>
              </div>

              
            </div>
            {/* Right Column - Donation Info */}
            <div className="space-y-6">
              <h2 className="text-lg font-semibold mb-4">Goals & Donation</h2>

              <div className="bg-white rounded-lg shadow-sm p-4">
                {/* Circular Progress */}
                <div className="relative w-24 h-24 sm:w-32 sm:h-32 mx-auto mb-4">
                  <svg className="w-full h-full" viewBox="0 0 100 100">
                    <circle
                      className="text-gray-200"
                      strokeWidth="10"
                      stroke="currentColor"
                      fill="transparent"
                      r="45"
                      cx="50"
                      cy="50"
                    />
                    <circle
                      className="text-register-green"
                      strokeWidth="10"
                      strokeDasharray={`${donationProgress * 283 / 100} 283`}
                      strokeLinecap="round"
                      stroke="currentColor"
                      fill="transparent"
                      r="45"
                      cx="50"
                      cy="50"
                      transform="rotate(-90 50 50)"
                    />
                    <text
                      x="50"
                      y="50"
                      className="text-xl sm:text-2xl font-medium"
                      textAnchor="middle"
                      dy=".3em"
                      fill="currentColor"
                    >
                      {Math.round(donationProgress)}%
                    </text>
                  </svg>
                </div>

                <div className="text-center mb-6">
                  <h3 className="text-xl sm:text-2xl font-semibold">${campaign.amountRaised.toLocaleString()} raised</h3>
                  <p className="text-gray-500 text-sm">${campaign.goal.toLocaleString()} Goal</p>
                </div>

                {/* Action Buttons */}
                <div>
                  <button 
                      onClick={() => setShowDeleteConfirm(true)}
                      className="w-full flex-1 bg-red-500 text-white py-2 px-4 mb-4 rounded-md hover:bg-red-600 transition-colors"
                    >
                      Delete
                  </button>
                  <button 
                    onClick={handleMarkAsCompleted}
                    disabled={isMarkingCompleted || campaign?.status === 'completed'}
                    className={`w-full py-2 text-white rounded-md mb-6 text-sm transition-colors ${
                      campaign?.status === 'completed' 
                        ? 'bg-gray-400 cursor-not-allowed' 
                        : 'bg-register-green hover:bg-green-600'
                    }`}
                  >
                    {isMarkingCompleted 
                      ? 'Marking as Completed...' 
                      : campaign?.status === 'completed' 
                        ? 'Campaign Completed' 
                        : 'Mark as Completed'
                    }
                  </button>
                </div>
                
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <svg className="w-5 h-5 text-register-green" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className="text-register-green text-xs sm:text-sm">24 people are already donated</span>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {[
                      { name: 'Anonymous', amount: 0 },                  
                    ].map((donor, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gray-200 rounded-full" />
                        <div>
                          <div className="font-medium text-sm">{donor.name}</div>
                          <div className="text-xs sm:text-sm text-gray-600">${donor.amount}</div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="flex justify-center mt-4">
                    <button className="text-register-green text-xs sm:text-sm hover:text-green-700 border-register-green border font-semibold py-2 px-4 sm:px-8 rounded">
                      View all Donors
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      {editModal.isOpen && editModal.field && (
        <EditCampaignModal
          isOpen={editModal.isOpen}
          onClose={closeEditModal}
          campaign={campaign}
          field={editModal.field}
          onUpdate={handleFieldUpdate}
        />
      )}

      {/* Quick Share Modal */}
      {campaign && (
        <QuickShare
          isOpen={isShareModalOpen}
          onClose={closeShareModal}
          campaign={{
            name: campaign.name,
            url: `${window.location.origin}/challenge/${campaign.id}`
          }}
        />
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-sm">
            <h3 className="text-lg font-semibold mb-4">Delete Campaign</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this campaign? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 py-2 px-4 border border-gray-300 rounded-md hover:bg-gray-50"
                disabled={deleteCampaignMutation.isPending}
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={deleteCampaignMutation.isPending}
                className="flex-1 py-2 px-4 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50"
              >
                {deleteCampaignMutation.isPending ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
