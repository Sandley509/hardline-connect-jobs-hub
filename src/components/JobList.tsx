
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import JobCard from "./JobCard";
import JobPagination from "./JobPagination";
import MobileAds from "./MobileAds";
import JobCategoryFilter from "./JobCategoryFilter";
import JobAdvancedFilters, { JobFilters } from "./JobAdvancedFilters";
import JobDetailModal from "./JobDetailModal";
import { useSavedJobs } from "@/hooks/useSavedJobs";

interface JobLink {
  id: string;
  title: string;
  company: string;
  location: string;
  type: string;
  salary: string;
  url: string;
  description: string;
  category: string;
}

interface JobListProps {
  highlightedJobId?: string | null;
}

const JobList = ({ highlightedJobId }: JobListProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedJob, setSelectedJob] = useState<JobLink | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const itemsPerPage = 6;

  // Advanced filters state
  const [filters, setFilters] = useState<JobFilters>({
    search: '',
    category: 'all',
    jobType: 'all',
    salaryRange: 'all',
    location: 'all'
  });

  // Saved jobs functionality
  const { saveJob, unsaveJob, isJobSaved } = useSavedJobs();

  const { data: jobLinks = [], isLoading } = useQuery({
    queryKey: ['jobs'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('jobs')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching jobs:', error);
        return [];
      }

      return data || [];
    }
  });

  // Advanced filtering logic
  const filteredJobs = jobLinks.filter(job => {
    // Search filter
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      const searchableText = `${job.title} ${job.company} ${job.description}`.toLowerCase();
      if (!searchableText.includes(searchTerm)) return false;
    }

    // Category filter
    const categoryToCheck = filters.category !== 'all' ? filters.category : selectedCategory;
    if (categoryToCheck !== 'all' && job.category !== categoryToCheck) return false;

    // Job type filter
    if (filters.jobType !== 'all' && job.type.toLowerCase() !== filters.jobType) return false;

    // Location filter
    if (filters.location !== 'all') {
      if (filters.location === 'remote' && !job.location.toLowerCase().includes('remote')) return false;
      if (filters.location === 'hybrid' && !job.location.toLowerCase().includes('hybrid')) return false;
      if (filters.location !== 'remote' && filters.location !== 'hybrid') {
        // For specific regions, this would need more sophisticated matching
        // For now, we'll do a simple includes check
        if (!job.location.toLowerCase().includes(filters.location)) return false;
      }
    }

    // Salary range filter (basic implementation)
    if (filters.salaryRange !== 'all' && job.salary) {
      const salaryNumbers = job.salary.match(/\d+/g);
      if (salaryNumbers && salaryNumbers.length > 0) {
        const salary = parseInt(salaryNumbers[0]);
        switch (filters.salaryRange) {
          case '0-30000':
            if (salary > 30000) return false;
            break;
          case '30000-50000':
            if (salary < 30000 || salary > 50000) return false;
            break;
          case '50000-70000':
            if (salary < 50000 || salary > 70000) return false;
            break;
          case '70000-100000':
            if (salary < 70000 || salary > 100000) return false;
            break;
          case '100000+':
            if (salary < 100000) return false;
            break;
        }
      }
    }

    return true;
  });

  // Calculate counts for each category
  const customerServiceCount = jobLinks.filter(job => job.category === 'customer_service').length;
  const interpretationCount = jobLinks.filter(job => job.category === 'interpretation').length;

  // Calculate pagination
  const totalPages = Math.ceil(filteredJobs.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentJobs = filteredJobs.slice(startIndex, endIndex);

  // Reset to page 1 when category changes
  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setFilters(prev => ({ ...prev, category }));
    setCurrentPage(1);
  };

  // Handle filter changes
  const handleFiltersChange = (newFilters: JobFilters) => {
    setFilters(newFilters);
    setSelectedCategory(newFilters.category);
    setCurrentPage(1);
  };

  // Clear all filters
  const handleClearFilters = () => {
    const clearedFilters: JobFilters = {
      search: '',
      category: 'all',
      jobType: 'all',
      salaryRange: 'all',
      location: 'all'
    };
    setFilters(clearedFilters);
    setSelectedCategory('all');
    setCurrentPage(1);
  };

  // Handle job card click to open modal
  const handleJobClick = (job: JobLink) => {
    setSelectedJob(job);
    setIsModalOpen(true);
  };

  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const shareJobOnWhatsApp = (job: JobLink) => {
    const jobPageUrl = `https://hardlineconnect.store/?jobId=${job.id}&ref=whatsapp`;
    const message = `Check out this job opportunity!\n\n*${job.title}*\nCompany: ${job.company}\n${job.location ? `Location: ${job.location}\n` : ''}${job.type ? `Type: ${job.type}\n` : ''}${job.salary ? `Salary: ${job.salary}\n` : ''}\nView and apply here: ${jobPageUrl}`;
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleApplyNow = (job: JobLink) => {
    window.open(job.url, '_blank');
  };

  const getCategoryDisplayName = (category: string) => {
    switch (category) {
      case 'customer_service':
        return 'Customer Service';
      case 'interpretation':
        return 'Interpretation';
      default:
        return 'All';
    }
  };

  return (
    <div className="lg:col-span-3">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 md:mb-8 space-y-4 sm:space-y-0">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
          Available Remote Positions
        </h2>
        <p className="text-gray-600 text-sm md:text-base">
          Page {currentPage} of {totalPages} ({filteredJobs.length} {getCategoryDisplayName(selectedCategory).toLowerCase()} jobs)
        </p>
      </div>

      <JobAdvancedFilters
        filters={filters}
        onFiltersChange={handleFiltersChange}
        onClearFilters={handleClearFilters}
        jobCount={filteredJobs.length}
      />

      <JobCategoryFilter
        selectedCategory={selectedCategory}
        onCategoryChange={handleCategoryChange}
        customerServiceCount={customerServiceCount}
        interpretationCount={interpretationCount}
      />

      {/* Job Listings */}
      {isLoading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600"></div>
        </div>
      ) : (
        <div className="space-y-4 md:space-y-6">
          {currentJobs.map((job) => (
            <div
              key={job.id}
              id={`job-${job.id}`}
              className={highlightedJobId === job.id ? "ring-2 ring-teal-500 rounded-lg" : ""}
            >
              <JobCard
                job={job}
                onShare={shareJobOnWhatsApp}
                onApply={handleApplyNow}
                onSave={saveJob}
                onUnsave={unsaveJob}
                onJobClick={handleJobClick}
                isHighlighted={highlightedJobId === job.id}
                isSaved={isJobSaved(job.id)}
              />
            </div>
          ))}

          {currentJobs.length === 0 && !isLoading && (
            <div className="text-center py-8">
              <p className="text-gray-500 text-lg">No {getCategoryDisplayName(selectedCategory).toLowerCase()} job listings available at the moment.</p>
              <p className="text-gray-400">Please check back later for new opportunities.</p>
            </div>
          )}
        </div>
      )}

      <JobPagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPrevPage={prevPage}
        onNextPage={nextPage}
        onPageSelect={setCurrentPage}
      />

      <MobileAds />

      {/* Job Detail Modal */}
      <JobDetailModal
        job={selectedJob}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onShare={shareJobOnWhatsApp}
        onApply={handleApplyNow}
        onSave={saveJob}
        onUnsave={unsaveJob}
        isSaved={selectedJob ? isJobSaved(selectedJob.id) : false}
      />
    </div>
  );
};

export default JobList;
