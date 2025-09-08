import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, Filter, X } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

export interface JobFilters {
  search: string;
  category: string;
  jobType: string;
  salaryRange: string;
  location: string;
}

interface JobAdvancedFiltersProps {
  filters: JobFilters;
  onFiltersChange: (filters: JobFilters) => void;
  onClearFilters: () => void;
  jobCount: number;
}

const JobAdvancedFilters = ({ 
  filters, 
  onFiltersChange, 
  onClearFilters, 
  jobCount 
}: JobAdvancedFiltersProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleFilterChange = (key: keyof JobFilters, value: string) => {
    onFiltersChange({
      ...filters,
      [key]: value
    });
  };

  const hasActiveFilters = Object.entries(filters).some(([key, value]) => 
    key !== 'category' && value !== '' && value !== 'all'
  );

  return (
    <Card className="mb-6">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Search className="h-5 w-5" />
            Search & Filter Jobs
          </CardTitle>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">
              {jobCount} jobs found
            </span>
            {hasActiveFilters && (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={onClearFilters}
                className="text-xs"
              >
                <X className="h-3 w-3 mr-1" />
                Clear
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search job titles, companies, or keywords..."
            value={filters.search}
            onChange={(e) => handleFilterChange('search', e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Advanced Filters Collapsible */}
        <Collapsible open={isOpen} onOpenChange={setIsOpen}>
          <CollapsibleTrigger asChild>
            <Button variant="outline" className="w-full">
              <Filter className="h-4 w-4 mr-2" />
              Advanced Filters
              {hasActiveFilters && (
                <span className="ml-2 bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full">
                  Active
                </span>
              )}
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-4 mt-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Job Type Filter */}
              <div className="space-y-2">
                <Label htmlFor="jobType">Job Type</Label>
                <Select
                  value={filters.jobType}
                  onValueChange={(value) => handleFilterChange('jobType', value)}
                >
                  <SelectTrigger id="jobType">
                    <SelectValue placeholder="Any type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Any type</SelectItem>
                    <SelectItem value="full-time">Full-time</SelectItem>
                    <SelectItem value="part-time">Part-time</SelectItem>
                    <SelectItem value="contract">Contract</SelectItem>
                    <SelectItem value="freelance">Freelance</SelectItem>
                    <SelectItem value="internship">Internship</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Salary Range Filter */}
              <div className="space-y-2">
                <Label htmlFor="salaryRange">Salary Range</Label>
                <Select
                  value={filters.salaryRange}
                  onValueChange={(value) => handleFilterChange('salaryRange', value)}
                >
                  <SelectTrigger id="salaryRange">
                    <SelectValue placeholder="Any salary" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Any salary</SelectItem>
                    <SelectItem value="0-30000">$0 - $30,000</SelectItem>
                    <SelectItem value="30000-50000">$30,000 - $50,000</SelectItem>
                    <SelectItem value="50000-70000">$50,000 - $70,000</SelectItem>
                    <SelectItem value="70000-100000">$70,000 - $100,000</SelectItem>
                    <SelectItem value="100000+">$100,000+</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Location Filter */}
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Select
                  value={filters.location}
                  onValueChange={(value) => handleFilterChange('location', value)}
                >
                  <SelectTrigger id="location">
                    <SelectValue placeholder="Any location" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Any location</SelectItem>
                    <SelectItem value="remote">Remote</SelectItem>
                    <SelectItem value="hybrid">Hybrid</SelectItem>
                    <SelectItem value="usa">United States</SelectItem>
                    <SelectItem value="canada">Canada</SelectItem>
                    <SelectItem value="uk">United Kingdom</SelectItem>
                    <SelectItem value="europe">Europe</SelectItem>
                    <SelectItem value="asia">Asia</SelectItem>
                    <SelectItem value="australia">Australia</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>
      </CardContent>
    </Card>
  );
};

export default JobAdvancedFilters;