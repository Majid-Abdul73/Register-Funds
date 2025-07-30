import { Link } from 'react-router-dom';
import { Campaign } from '../../types/campaign';
import Loading from '../Loading';

interface CampaignGridProps {
  campaigns: Campaign[];
  loading: boolean;
  error: boolean;
  errorMessage: string;
  showHeader?: boolean;
  headerTitle?: string;
  headerLink?: {
    to: string;
    text: string;
  };
  showCategories?: boolean;
  categories?: Array<{ id: string; name: string }>;
  selectedCategory?: string;
  onCategoryChange?: (categoryId: string) => void;
  titleStyle?: 'normal' | 'bold';
  amountStyle?: 'normal' | 'semibold';
}

export default function CampaignGrid({
  campaigns,
  loading,
  error,
  errorMessage,
  showHeader = false,
  headerTitle,
  headerLink,
  showCategories = false,
  categories = [],
  selectedCategory,
  onCategoryChange,
  titleStyle = 'normal',
  amountStyle = 'normal'
}: CampaignGridProps) {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="py-12">
        {showHeader && (
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold">{headerTitle}</h2>
            {headerLink && (
              <Link 
                to={headerLink.to} 
                className="text-register-green bg-[#FFFFFF] shadow p-2 justify-between rounded-xl px-6 flex items-center gap-2"
              >
                {headerLink.text}
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            )}
          </div>
        )}
        
        {showCategories && (
          <div className="mb-6">
            {categories.map(category => (
              <button
                key={category.id}
                onClick={() => onCategoryChange?.(category.id)}
                className={`px-6 py-2 rounded-full text-sm font-medium whitespace-nowrap mb-4 mr-2
                  ${selectedCategory === category.id 
                    ? 'bg-register-green text-white' 
                    : 'bg-white text-gray-700 hover:bg-gray-50'}`}
              >
                {category.name}
              </button>
            ))}
          </div>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {loading ? (
            <div className="col-span-full">
              <Loading size="lg" text="Loading campaigns" />
            </div>
          ) : error ? (
            <div className="col-span-full text-center text-red-500 py-12">{errorMessage}</div>
          ) : (
            campaigns?.map(campaign => (
              <Link 
                to={`/challenge/${campaign.id}`}
                key={campaign.id}
                className="bg-white rounded-lg overflow-hidden shadow hover:shadow-lg transition-shadow"
              >
                <div className="relative h-48">
                  <span className="absolute bottom-4 left-4 bg-green-500 text-white px-2 py-1 rounded-full text-xs">
                    {campaign.category}
                  </span>
                  <img 
                    src={campaign.mediaUrl || '/assets/images/campaign-placeholder.jpg'}
                    alt={campaign.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-4">
                  <div className="flex items-center gap-2 mb-2 text-register-green">
                    <img src="/images/location.svg" alt="" className="w-4 h-4" />
                    <span className="text-sm">
                      {campaign.location?.city && campaign.location?.country 
                        ? `${campaign.location.city}, ${campaign.location.country}`
                        : 'Location not available'
                      }
                    </span>
                  </div>
                  <h3 className={`mb-2 ${
                    titleStyle === 'bold' ? 'font-bold text-xl' : 'font-medium'
                  }`}>
                    {campaign.name}
                  </h3>
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                    {campaign.description}
                  </p>
                  <div className="w-full h-2 bg-gray-100 rounded-full mb-2">
                    <div 
                      className="h-2 bg-register-green rounded-full"
                      style={{ 
                        width: `${Math.min((campaign.amountRaised / campaign.goal) * 100, 100)}%` 
                      }}
                    />
                  </div>
                  <div className={`flex justify-between text-sm ${
                    amountStyle === 'semibold' ? 'font-semibold' : ''
                  }`}>
                    <span>Raised: ${campaign.amountRaised?.toLocaleString()}</span>
                    <span>Goal: ${campaign.goal?.toLocaleString()}</span>
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>
      </div>
    </div>
  );
}