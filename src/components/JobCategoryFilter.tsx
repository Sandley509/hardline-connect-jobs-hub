
import { Button } from "@/components/ui/button";

interface JobCategoryFilterProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  customerServiceCount: number;
  interpretationCount: number;
}

const JobCategoryFilter = ({ 
  selectedCategory, 
  onCategoryChange, 
  customerServiceCount, 
  interpretationCount 
}: JobCategoryFilterProps) => {
  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-6">
      <Button
        variant={selectedCategory === 'all' ? 'default' : 'outline'}
        onClick={() => onCategoryChange('all')}
        className="flex-1 sm:flex-none"
      >
        All Jobs ({customerServiceCount + interpretationCount})
      </Button>
      <Button
        variant={selectedCategory === 'customer_service' ? 'default' : 'outline'}
        onClick={() => onCategoryChange('customer_service')}
        className="flex-1 sm:flex-none"
      >
        Customer Service ({customerServiceCount})
      </Button>
      <Button
        variant={selectedCategory === 'interpretation' ? 'default' : 'outline'}
        onClick={() => onCategoryChange('interpretation')}
        className="flex-1 sm:flex-none"
      >
        Interpretation ({interpretationCount})
      </Button>
    </div>
  );
};

export default JobCategoryFilter;
