import { useState, lazy, Suspense, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import FeaturedCampaigns from '../components/campaign/FeaturedCampaigns';
import CampaignGrid from '../components/campaign/CampaignGrid';
import { useCampaigns } from '../hooks/useCampaigns';

const Navbar = lazy(() => import('../components/Navbar'));

export default function DonatePage() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  
  // Use real API calls instead of mock data
  const { data: campaigns, isLoading, error } = useCampaigns();
  
  // Convert error to string for display
  const errorMessage = error?.message || '';

  // Memoize categories
  const categories = useMemo(() => [
    { id: 'all', name: 'All' },
    ...Array.from(new Set(campaigns?.map(campaign => campaign.category) || []))
      .filter(Boolean)
      .map(category => ({
        id: category,
        name: category
      }))
  ], [campaigns]);

  // Memoize filtered campaigns
  const filteredCampaigns = useMemo(() => 
    selectedCategory === 'all'
      ? campaigns || []
      : campaigns?.filter(campaign => campaign.category === selectedCategory) || [],
    [campaigns, selectedCategory]
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen"
    >
      <Suspense fallback={<div>Loading...</div>}>
        <Navbar 
          variant="transparent"
          customLinks={[
            { to: "/campaigns", text: "Campaigns" },
            { to: "/#", text: "How It Works" },
            { to: "/#", text: "About Register" }
          ]}
          className='fixed top-0 left-0 right-0 z-50'
        />
      </Suspense>

      <AnimatePresence mode="wait">
        <motion.div
          key={selectedCategory}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >

      <FeaturedCampaigns 
        campaigns={campaigns || []}
        loading={isLoading}
        error={errorMessage}
        className='mt-24'
      />

      {/* Campaign Grid Section */}
      <CampaignGrid
        campaigns={filteredCampaigns}
        loading={isLoading}
        error={!!error}
        errorMessage={errorMessage}
        showCategories={true}
        categories={categories}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        titleStyle="bold"
        amountStyle="normal"
      />

        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
}