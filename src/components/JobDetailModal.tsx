import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  ExternalLink, 
  MapPin, 
  Clock, 
  DollarSign, 
  Building, 
  Share2, 
  Bookmark,
  BookmarkCheck,
  Calendar
} from "lucide-react";
import { useState } from "react";

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
  created_at?: string;
}

interface JobDetailModalProps {
  job: JobLink | null;
  isOpen: boolean;
  onClose: () => void;
  onShare: (job: JobLink) => void;
  onApply: (job: JobLink) => void;
  onSave?: (job: JobLink) => void;
  onUnsave?: (job: JobLink) => void;
  isSaved?: boolean;
}

const JobDetailModal = ({
  job,
  isOpen,
  onClose,
  onShare,
  onApply,
  onSave,
  onUnsave,
  isSaved = false
}: JobDetailModalProps) => {
  const [isBookmarked, setIsBookmarked] = useState(isSaved);

  if (!job) return null;

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
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'interpretation':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const handleBookmarkToggle = () => {
    if (isBookmarked) {
      onUnsave?.(job);
      setIsBookmarked(false);
    } else {
      onSave?.(job);
      setIsBookmarked(true);
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return null;
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="space-y-4">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <DialogTitle className="text-2xl font-bold text-primary mb-2">
                {job.title}
              </DialogTitle>
              <div className="flex items-center gap-2 mb-3">
                <Building className="h-4 w-4 text-muted-foreground" />
                <span className="text-lg font-semibold text-foreground">{job.company}</span>
                <Badge className={getCategoryColor(job.category)}>
                  {getCategoryDisplayName(job.category)}
                </Badge>
              </div>
            </div>
            <div className="flex gap-2 ml-4">
              <Button
                variant="outline"
                size="sm"
                onClick={handleBookmarkToggle}
                className="flex items-center gap-2"
              >
                {isBookmarked ? (
                  <>
                    <BookmarkCheck className="h-4 w-4" />
                    Saved
                  </>
                ) : (
                  <>
                    <Bookmark className="h-4 w-4" />
                    Save
                  </>
                )}
              </Button>
            </div>
          </div>
        </DialogHeader>

        {/* Job Details */}
        <div className="space-y-6">
          {/* Quick Info */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {job.location && (
              <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">{job.location}</span>
              </div>
            )}
            {job.type && (
              <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">{job.type}</span>
              </div>
            )}
            {job.salary && (
              <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg">
                <DollarSign className="h-4 w-4 text-green-600" />
                <span className="text-sm font-medium text-green-600">{job.salary}</span>
              </div>
            )}
          </div>

          {/* Posted Date */}
          {job.created_at && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>Posted on {formatDate(job.created_at)}</span>
            </div>
          )}

          {/* Job Description */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Job Description</h3>
            <div className="prose prose-sm max-w-none">
              <p className="text-foreground whitespace-pre-wrap leading-relaxed">
                {job.description || "No detailed description available. Please click 'Apply Now' to view full job details on the company's website."}
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t">
            <Button 
              onClick={() => onApply(job)}
              className="flex-1 bg-primary hover:bg-primary/90"
              size="lg"
            >
              Apply Now <ExternalLink className="ml-2 h-4 w-4" />
            </Button>
            <Button 
              onClick={() => onShare(job)}
              variant="outline" 
              className="border-green-500 text-green-600 hover:bg-green-50"
              size="lg"
            >
              <Share2 className="mr-2 h-4 w-4" />
              Share on WhatsApp
            </Button>
          </div>
        </div>

        <DialogDescription className="sr-only">
          Detailed information about the {job.title} position at {job.company}
        </DialogDescription>
      </DialogContent>
    </Dialog>
  );
};

export default JobDetailModal;