import { useState } from "react";
import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useSavedJobs } from "@/hooks/useSavedJobs";
import JobDetailModal from "@/components/JobDetailModal";
import { 
  Bookmark, 
  ExternalLink, 
  Share2, 
  MapPin, 
  Clock, 
  DollarSign, 
  Trash2,
  BookmarkX 
} from "lucide-react";

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

const SavedJobs = () => {
  const { savedJobs, unsaveJob, isJobSaved, clearAllSavedJobs, savedJobsCount } = useSavedJobs();
  const [selectedJob, setSelectedJob] = useState<JobLink | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const getCategoryDisplayName = (category: string) => {
    switch (category) {
      case 'customer_service':
        return 'Customer Service';
      case 'interpretation':
        return 'Interpretation';
      default:
        return category;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'customer_service':
        return 'bg-blue-100 text-blue-800';
      case 'interpretation':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
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

  const handleJobClick = (job: JobLink) => {
    setSelectedJob(job);
    setIsModalOpen(true);
  };

  const handleUnsaveFromModal = (job: JobLink) => {
    unsaveJob(job.id);
    setIsModalOpen(false);
  };

  return (
    <Layout>
      <div className="min-h-screen bg-background py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
            <div className="mb-4 sm:mb-0">
              <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
                <Bookmark className="h-8 w-8 text-primary" />
                Saved Jobs
              </h1>
              <p className="text-muted-foreground mt-2">
                {savedJobsCount > 0 ? `${savedJobsCount} job${savedJobsCount === 1 ? '' : 's'} saved` : 'No saved jobs yet'}
              </p>
            </div>
            
            {savedJobsCount > 0 && (
              <Button 
                variant="outline" 
                onClick={clearAllSavedJobs}
                className="text-destructive hover:bg-destructive/10"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Clear All
              </Button>
            )}
          </div>

          {/* Saved Jobs List */}
          {savedJobsCount === 0 ? (
            <Card className="text-center py-12">
              <CardContent>
                <BookmarkX className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h2 className="text-xl font-semibold text-foreground mb-2">No Saved Jobs</h2>
                <p className="text-muted-foreground mb-4">
                  Start browsing jobs and save the ones you're interested in.
                </p>
                <Button asChild>
                  <a href="/">Browse Jobs</a>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {savedJobs.map((job) => (
                <Card 
                  key={job.id} 
                  className="hover:shadow-lg transition-all duration-300 cursor-pointer"
                  onClick={() => handleJobClick(job)}
                >
                  <CardHeader>
                    <div className="flex flex-col md:flex-row md:justify-between md:items-start space-y-4 md:space-y-0">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <CardTitle className="text-lg md:text-xl text-primary">
                            {job.title}
                          </CardTitle>
                          <Badge className={getCategoryColor(job.category)}>
                            {getCategoryDisplayName(job.category)}
                          </Badge>
                        </div>
                        <p className="text-base md:text-lg font-semibold text-foreground">
                          {job.company}
                        </p>
                      </div>
                      
                      <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
                        <Button 
                          onClick={(e) => {
                            e.stopPropagation();
                            shareJobOnWhatsApp(job);
                          }}
                          variant="outline" 
                          size="sm"
                          className="border-green-500 text-green-600 hover:bg-green-50"
                        >
                          <Share2 className="mr-2 h-4 w-4" />
                          Share
                        </Button>
                        <Button 
                          onClick={(e) => {
                            e.stopPropagation();
                            unsaveJob(job.id);
                          }}
                          variant="outline" 
                          size="sm"
                          className="text-destructive hover:bg-destructive/10"
                        >
                          <BookmarkX className="mr-2 h-4 w-4" />
                          Remove
                        </Button>
                        <Button 
                          onClick={(e) => {
                            e.stopPropagation();
                            handleApplyNow(job);
                          }}
                          size="sm"
                          className="bg-primary hover:bg-primary/90"
                        >
                          Apply <ExternalLink className="ml-2 h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent>
                    <div className="flex flex-wrap gap-3 md:gap-4 mb-3">
                      {job.location && (
                        <div className="flex items-center text-muted-foreground text-sm">
                          <MapPin className="h-4 w-4 mr-1" />
                          {job.location}
                        </div>
                      )}
                      {job.type && (
                        <div className="flex items-center text-muted-foreground text-sm">
                          <Clock className="h-4 w-4 mr-1" />
                          {job.type}
                        </div>
                      )}
                      {job.salary && (
                        <div className="flex items-center text-green-600 font-semibold text-sm">
                          <DollarSign className="h-4 w-4 mr-1" />
                          {job.salary}
                        </div>
                      )}
                    </div>
                    {job.description && (
                      <p className="text-muted-foreground text-sm line-clamp-2">
                        {job.description}
                      </p>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Job Detail Modal */}
          <JobDetailModal
            job={selectedJob}
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onShare={shareJobOnWhatsApp}
            onApply={handleApplyNow}
            onUnsave={handleUnsaveFromModal}
            isSaved={selectedJob ? isJobSaved(selectedJob.id) : false}
          />
        </div>
      </div>
    </Layout>
  );
};

export default SavedJobs;