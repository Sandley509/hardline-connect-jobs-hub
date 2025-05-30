
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import JobCard from "./JobCard";
import JobPagination from "./JobPagination";
import MobileAds from "./MobileAds";

interface JobLink {
  id: string;
  title: string;
  company: string;
  location: string;
  type: string;
  salary: string;
  url: string;
  description: string;
}

interface JobListProps {
  highlightedJobId?: string | null;
}

const JobList = ({ highlightedJobId }: JobListProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

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

  // Calculate pagination
  const totalPages = Math.ceil(jobLinks.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentJobs = jobLinks.slice(startIndex, endIndex);

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
    // Use your actual website URL with proper job parameters
    const jobPageUrl = `https://hardlineconnect.store/?jobId=${job.id}&ref=whatsapp`;
    const message = `Check out this job opportunity!\n\n*${job.title}*\nCompany: ${job.company}\n${job.location ? `Location: ${job.location}\n` : ''}${job.type ? `Type: ${job.type}\n` : ''}${job.salary ? `Salary: ${job.salary}\n` : ''}\nView and apply here: ${jobPageUrl}`;
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleApplyNow = (job: JobLink) => {
    // Redirect to the job's direct URL when applying from your site
    window.open(job.url, '_blank');
  };

  return (
    <div className="lg:col-span-3">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 md:mb-8 space-y-4 sm:space-y-0">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
          Available Remote Positions
        </h2>
        <p className="text-gray-600 text-sm md:text-base">
          Page {currentPage} of {totalPages} ({jobLinks.length} total jobs)
        </p>
      </div>

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
                isHighlighted={highlightedJobId === job.id}
              />
            </div>
          ))}

          {currentJobs.length === 0 && !isLoading && (
            <div className="text-center py-8">
              <p className="text-gray-500 text-lg">No job listings available at the moment.</p>
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
    </div>
  );
};

export default JobList;
