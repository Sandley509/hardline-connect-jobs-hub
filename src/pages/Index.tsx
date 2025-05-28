
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, ExternalLink, MapPin, Clock, DollarSign } from "lucide-react";

interface JobLink {
  id: number;
  title: string;
  company: string;
  location: string;
  type: string;
  salary: string;
  url: string;
  description: string;
}

const Index = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [jobLinks, setJobLinks] = useState<JobLink[]>([]);
  const itemsPerPage = 6;

  useEffect(() => {
    // Load job links from localStorage
    const savedLinks = localStorage.getItem('jobLinks');
    if (savedLinks) {
      setJobLinks(JSON.parse(savedLinks));
    } else {
      // Default sample job links
      const defaultJobs: JobLink[] = [
        {
          id: 1,
          title: "Customer Service Representative",
          company: "Remote Solutions Inc.",
          location: "Remote - USA",
          type: "Full-time",
          salary: "$35,000 - $45,000",
          url: "https://example.com/job1",
          description: "Handle customer inquiries and provide excellent service via phone, email, and chat."
        },
        {
          id: 2,
          title: "Virtual Sales Associate",
          company: "Digital Commerce Co.",
          location: "Remote - USA",
          type: "Part-time",
          salary: "$15 - $20/hour",
          url: "https://example.com/job2",
          description: "Drive sales through online platforms and build relationships with customers."
        },
        {
          id: 3,
          title: "Data Entry Specialist",
          company: "InfoTech Services",
          location: "Remote - USA",
          type: "Contract",
          salary: "$18 - $22/hour",
          url: "https://example.com/job3",
          description: "Accurate data entry and management of digital records and databases."
        }
      ];
      setJobLinks(defaultJobs);
      localStorage.setItem('jobLinks', JSON.stringify(defaultJobs));
    }
  }, []);

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

  return (
    <Layout>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-teal-600 via-blue-600 to-purple-600 text-white py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-6 animate-fade-in">
            Find Your Perfect Work From Home Job
          </h1>
          <p className="text-lg md:text-xl lg:text-2xl mb-8 opacity-90 max-w-3xl mx-auto">
            Connect with remote opportunities in customer service, sales, and interpretation
          </p>
          <Button size="lg" className="bg-white text-teal-600 hover:bg-gray-100 text-lg px-8 py-3">
            Browse Opportunities
          </Button>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 lg:gap-8">
          {/* Main Content */}
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
            <div className="space-y-4 md:space-y-6">
              {currentJobs.map((job) => (
                <Card key={job.id} className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                  <CardHeader>
                    <div className="flex flex-col md:flex-row md:justify-between md:items-start space-y-4 md:space-y-0">
                      <div className="flex-1">
                        <CardTitle className="text-lg md:text-xl text-teal-600 mb-2">
                          {job.title}
                        </CardTitle>
                        <CardDescription className="text-base md:text-lg font-semibold text-gray-700">
                          {job.company}
                        </CardDescription>
                      </div>
                      <Button asChild className="bg-teal-600 hover:bg-teal-700 w-full md:w-auto">
                        <a href={job.url} target="_blank" rel="noopener noreferrer">
                          Apply Now <ExternalLink className="ml-2 h-4 w-4" />
                        </a>
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-3 md:gap-4 mb-4">
                      <div className="flex items-center text-gray-600 text-sm md:text-base">
                        <MapPin className="h-4 w-4 mr-1 flex-shrink-0" />
                        {job.location}
                      </div>
                      <div className="flex items-center text-gray-600 text-sm md:text-base">
                        <Clock className="h-4 w-4 mr-1 flex-shrink-0" />
                        {job.type}
                      </div>
                      <div className="flex items-center text-green-600 font-semibold text-sm md:text-base">
                        <DollarSign className="h-4 w-4 mr-1 flex-shrink-0" />
                        {job.salary}
                      </div>
                    </div>
                    <p className="text-gray-700 text-sm md:text-base">{job.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-4 mt-6 md:mt-8">
                <Button
                  variant="outline"
                  onClick={prevPage}
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
                      onClick={() => setCurrentPage(page)}
                      className="w-10 h-10 flex-shrink-0"
                    >
                      {page}
                    </Button>
                  ))}
                </div>

                <Button
                  variant="outline"
                  onClick={nextPage}
                  disabled={currentPage === totalPages}
                  className="w-full sm:w-auto"
                >
                  Next
                  <ChevronRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            )}
          </div>

          {/* Sidebar with Ads */}
          <div className="lg:col-span-1 order-first lg:order-last">
            <div className="space-y-6">
              {/* Business Services Ad */}
              <Card className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
                <CardContent className="p-0">
                  <img 
                    src="/lovable-uploads/5df24894-f9e6-487b-af0a-38044f25840c.png" 
                    alt="Start Your Business in the USA" 
                    className="w-full h-auto object-cover"
                  />
                </CardContent>
              </Card>

              {/* Website Referral Ad */}
              <Card className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
                <CardContent className="p-0">
                  <img 
                    src="/lovable-uploads/8fb561d9-baff-41b0-97c0-8a25ddb61747.png" 
                    alt="Get $200 Cash for Website Referrals" 
                    className="w-full h-auto object-cover"
                  />
                </CardContent>
              </Card>

              {/* Website Development Ad */}
              <Card className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
                <CardContent className="p-0">
                  <img 
                    src="/lovable-uploads/50868bd1-dc05-4488-9f14-d891e7a5b688.png" 
                    alt="Website Design & Development" 
                    className="w-full h-auto object-cover"
                  />
                </CardContent>
              </Card>

              {/* Contact CTA */}
              <Card className="bg-gradient-to-br from-teal-500 to-blue-600 text-white">
                <CardContent className="p-6 text-center">
                  <h3 className="font-bold text-lg mb-2">Need Help?</h3>
                  <p className="text-sm opacity-90 mb-4">
                    Contact us for job assistance or business services
                  </p>
                  <Button className="bg-white text-teal-600 hover:bg-gray-100 w-full">
                    Contact Us
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Index;
