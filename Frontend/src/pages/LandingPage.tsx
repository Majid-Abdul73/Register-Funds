import { lazy, Suspense, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import FeaturedCampaigns from '../components/campaign/FeaturedCampaigns';
import CampaignGrid from '../components/campaign/CampaignGrid';
import { useCampaigns } from '../hooks/useCampaigns';

// Lazy load components
const Navbar = lazy(() => import('../components/Navbar'));
const HowItWorks = lazy(() => import('../components/HowItWorks'));

export default function LandingPage() {
  // Use real API calls instead of mock data
  const { data: campaigns, isLoading: loading, error } = useCampaigns();

  // Featured Campaigns
  const recentCampaigns = useMemo(() =>
    campaigns?.sort((a, b) => 
      new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
    ).slice(0, 8) || [],
    [campaigns]
  );

  // Convert error to string for components
  const errorMessage = error?.message || '';

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-white"
    >
      <Suspense fallback={<div>Loading...</div>}>
        <Navbar 
          variant="transparent" 
          customLinks={[
            { to: "/donate", text: "Campaigns" },
            { to: "/how-it-works", text: "How it Works" },
            { to: "/about-us", text: "About Register" }
          ]}
          className='fixed top-0 left-0 right-0 z-50'
        />
      </Suspense>

      {/* Keep existing hero section, but wrap with motion */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="relative pt-16"
      >
        {/* Background color container */}
        <div className="absolute inset-0 bg-register-green-light h-[79%]" />
        
        {/* Content container */}
        <div className="relative py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center pb-10">
            <h1 className="text-3xl font-bold text-register-black mb-6">
            Give where it matters—directly to <br /> classrooms left out and under- <br /> resourced.            </h1>
            <Link
              to="/donate"
              className="inline-block bg-register-green text-white px-6 py-3 rounded-3xl font-medium hover:bg-green-600 transition-colors mb-12"
            >
              Donate to a Cause
            </Link>

          </div>
        </div>
      </motion.div>

      <FeaturedCampaigns 
        campaigns={recentCampaigns}
        loading={loading}
        error={errorMessage}
        className="-mt-24"
      />

      {/* Campaign Grid Section */}
      <CampaignGrid
        campaigns={recentCampaigns}
        loading={loading}
        error={!!error}
        errorMessage={errorMessage}
        showHeader={true}
        headerTitle="Recent"
        headerLink={{
          to: "/donate",
          text: "View all Campaigns"
        }}
        titleStyle="bold"
        amountStyle="semibold"
      />

      <Suspense fallback={<div>Loading...</div>}>
        <HowItWorks />
      </Suspense>
    </motion.div>
  );
}