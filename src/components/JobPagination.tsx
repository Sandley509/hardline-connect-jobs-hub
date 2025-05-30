
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface JobPaginationProps {
  currentPage: number;
  totalPages: number;
  onPrevPage: () => void;
  onNextPage: () => void;
  onPageSelect: (page: number) => void;
}

const JobPagination = ({ 
  currentPage, 
  totalPages, 
  onPrevPage, 
  onNextPage, 
  onPageSelect 
}: JobPaginationProps) => {
  if (totalPages <= 1) return null;

  return (
    <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-4 mt-6 md:mt-8">
      <Button
        variant="outline"
        onClick={onPrevPage}
        disabled={currentPage === 1}
        className="w-full sm:w-auto"
      >
        <ChevronLeft className="h-4 w-4 mr-2" />
        Previous
      </Button>
      
      <div className="flex space-x-2 overflow-x-auto">
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <Button
            key={page}
            variant={currentPage === page ? "default" : "outline"}
            onClick={() => onPageSelect(page)}
            className="w-10 h-10 flex-shrink-0"
          >
            {page}
          </Button>
        ))}
      </div>

      <Button
        variant="outline"
        onClick={onNextPage}
        disabled={currentPage === totalPages}
        className="w-full sm:w-auto"
      >
        Next
        <ChevronRight className="h-4 w-4 ml-2" />
      </Button>
    </div>
  );
};

export default JobPagination;
