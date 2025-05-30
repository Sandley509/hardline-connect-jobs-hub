
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Layout from "@/components/Layout";
import HeroSection from "@/components/HeroSection";
import JobList from "@/components/JobList";
import AdsSidebar from "@/components/AdsSidebar";

const Index = () => {
  const location = useLocation();
  const [highlightedJobId, setHighlightedJobId] = useState<string | null>(null);

  useEffect(() => {
    // Check if there's a jobId in the URL parameters
    const urlParams = new URLSearchParams(location.search);
    const jobId = urlParams.get('jobId');
    const ref = urlParams.get('ref');
    
    if (jobId) {
      setHighlightedJobId(jobId);
      
      // Log the referral source
      if (ref) {
        console.log(`User came from ${ref} for job ${jobId}`);
      }
      
      // Scroll to the job listing after a short delay
      setTimeout(() => {
        const jobElement = document.getElementById(`job-${jobId}`);
        if (jobElement) {
          jobElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 1000);
    }
  }, [location]);

  return (
    <Layout>
      <HeroSection />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 lg:gap-8">
          <JobList highlightedJobId={highlightedJobId} />

          {/* Desktop Sidebar with Ads */}
          <div className="lg:col-span-1 order-first lg:order-last hidden lg:block">
            <AdsSidebar />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Index;
