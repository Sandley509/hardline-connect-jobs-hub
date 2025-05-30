
import Layout from "@/components/Layout";
import HeroSection from "@/components/HeroSection";
import JobList from "@/components/JobList";
import AdsSidebar from "@/components/AdsSidebar";

const Index = () => {
  return (
    <Layout>
      <HeroSection />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 lg:gap-8">
          <JobList />

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
