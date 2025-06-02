
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink, MapPin, Clock, DollarSign, Share2, Tag } from "lucide-react";

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

interface JobCardProps {
  job: JobLink;
  onShare: (job: JobLink) => void;
  onApply: (job: JobLink) => void;
  isHighlighted?: boolean;
}

const JobCard = ({ job, onShare, onApply, isHighlighted }: JobCardProps) => {
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

  return (
    <Card className={`hover:shadow-lg transition-all duration-300 hover:-translate-y-1 ${isHighlighted ? 'bg-teal-50 border-teal-200' : ''}`}>
      <CardHeader>
        <div className="flex flex-col md:flex-row md:justify-between md:items-start space-y-4 md:space-y-0">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <CardTitle className="text-lg md:text-xl text-teal-600">
                {job.title}
              </CardTitle>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(job.category)}`}>
                {getCategoryDisplayName(job.category)}
              </span>
            </div>
            <CardDescription className="text-base md:text-lg font-semibold text-gray-700">
              {job.company}
            </CardDescription>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
            <Button 
              onClick={() => onShare(job)}
              variant="outline" 
              className="border-green-500 text-green-600 hover:bg-green-50 w-full sm:w-auto"
            >
              <Share2 className="mr-2 h-4 w-4" />
              Share on WhatsApp
            </Button>
            <Button 
              onClick={() => onApply(job)}
              className="bg-teal-600 hover:bg-teal-700 w-full sm:w-auto"
            >
              Apply Now <ExternalLink className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-3 md:gap-4 mb-4">
          {job.location && (
            <div className="flex items-center text-gray-600 text-sm md:text-base">
              <MapPin className="h-4 w-4 mr-1 flex-shrink-0" />
              {job.location}
            </div>
          )}
          {job.type && (
            <div className="flex items-center text-gray-600 text-sm md:text-base">
              <Clock className="h-4 w-4 mr-1 flex-shrink-0" />
              {job.type}
            </div>
          )}
          {job.salary && (
            <div className="flex items-center text-green-600 font-semibold text-sm md:text-base">
              <DollarSign className="h-4 w-4 mr-1 flex-shrink-0" />
              {job.salary}
            </div>
          )}
        </div>
        {job.description && (
          <p className="text-gray-700 text-sm md:text-base">{job.description}</p>
        )}
      </CardContent>
    </Card>
  );
};

export default JobCard;
