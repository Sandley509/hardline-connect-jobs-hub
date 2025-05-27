
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
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Find Your Perfect Work From Home Job
          </h1>
          <p className="text-xl md:text-2xl mb-8">
            Connect with remote opportunities in customer service, sales, and interpretation
          </p>
          <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
            Browse Opportunities
          </Button>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl font-bold text-gray-800">
                Available Remote Positions
              </h2>
              <p className="text-gray-600">
                Page {currentPage} of {totalPages} ({jobLinks.length} total jobs)
              </p>
            </div>

            {/* Job Listings */}
            <div className="space-y-6">
              {currentJobs.map((job) => (
                <Card key={job.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-xl text-blue-600 mb-2">
                          {job.title}
                        </CardTitle>
                        <CardDescription className="text-lg font-semibold text-gray-700">
                          {job.company}
                        </CardDescription>
                      </div>
                      <Button asChild>
                        <a href={job.url} target="_blank" rel="noopener noreferrer">
                          Apply Now <ExternalLink className="ml-2 h-4 w-4" />
                        </a>
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-4 mb-4">
                      <div className="flex items-center text-gray-600">
                        <MapPin className="h-4 w-4 mr-1" />
                        {job.location}
                      </div>
                      <div className="flex items-center text-gray-600">
                        <Clock className="h-4 w-4 mr-1" />
                        {job.type}
                      </div>
                      <div className="flex items-center text-green-600 font-semibold">
                        <DollarSign className="h-4 w-4 mr-1" />
                        {job.salary}
                      </div>
                    </div>
                    <p className="text-gray-700">{job.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center space-x-4 mt-8">
                <Button
                  variant="outline"
                  onClick={prevPage}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="h-4 w-4 mr-2" />
                  Previous
                </Button>
                
                <div className="flex space-x-2">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <Button
                      key={page}
                      variant={currentPage === page ? "default" : "outline"}
                      onClick={() => setCurrentPage(page)}
                      className="w-10"
                    >
                      {page}
                    </Button>
                  ))}
                </div>

                <Button
                  variant="outline"
                  onClick={nextPage}
                  disabled={currentPage === totalPages}
                >
                  Next
                  <ChevronRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            )}
          </div>

          {/* Sidebar with Ads */}
          <div className="lg:col-span-1">
            <div className="space-y-6">
              {/* Ad Space 1 */}
              <Card className="bg-gradient-to-br from-green-400 to-blue-500 text-white">
                <CardContent className="p-6 text-center">
                  <h3 className="font-bold text-lg mb-2">Ad Space Available</h3>
                  <p className="text-sm opacity-90">
                    Promote your business here
                  </p>
                  <Button className="mt-4 bg-white text-green-600 hover:bg-gray-100">
                    Contact Us
                  </Button>
                </CardContent>
              </Card>

              {/* Ad Space 2 */}
              <Card className="bg-gradient-to-br from-purple-400 to-pink-500 text-white">
                <CardContent className="p-6 text-center">
                  <h3 className="font-bold text-lg mb-2">Featured Service</h3>
                  <p className="text-sm opacity-90">
                    Professional interpretation services
                  </p>
                  <Button className="mt-4 bg-white text-purple-600 hover:bg-gray-100">
                    Learn More
                  </Button>
                </CardContent>
              </Card>

              {/* Ad Space 3 */}
              <Card className="bg-gradient-to-br from-orange-400 to-red-500 text-white">
                <CardContent className="p-6 text-center">
                  <h3 className="font-bold text-lg mb-2">Premium Ad</h3>
                  <p className="text-sm opacity-90">
                    Reserve this spot for your ad
                  </p>
                  <Button className="mt-4 bg-white text-orange-600 hover:bg-gray-100">
                    Get Started
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
