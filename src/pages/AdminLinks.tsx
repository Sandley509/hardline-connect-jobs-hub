import Layout from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { Trash2, ExternalLink, Plus } from "lucide-react";

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

const AdminLinks = () => {
  const [jobLinks, setJobLinks] = useState<JobLink[]>([]);
  const [newJob, setNewJob] = useState({
    title: '',
    company: '',
    location: '',
    type: '',
    salary: '',
    url: '',
    description: ''
  });
  const { toast } = useToast();

  useEffect(() => {
    // Load job links from localStorage
    const savedLinks = localStorage.getItem('jobLinks');
    if (savedLinks) {
      setJobLinks(JSON.parse(savedLinks));
    }
  }, []);

  const saveJobLinks = (links: JobLink[]) => {
    localStorage.setItem('jobLinks', JSON.stringify(links));
    setJobLinks(links);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewJob(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const addJobLink = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newJob.title || !newJob.company || !newJob.url) {
      toast({
        title: "Error",
        description: "Please fill in at least the title, company, and URL fields.",
        variant: "destructive"
      });
      return;
    }

    const newJobWithId: JobLink = {
      ...newJob,
      id: Date.now(), // Simple ID generation
    };

    const updatedLinks = [...jobLinks, newJobWithId];
    saveJobLinks(updatedLinks);

    // Reset form
    setNewJob({
      title: '',
      company: '',
      location: '',
      type: '',
      salary: '',
      url: '',
      description: ''
    });

    toast({
      title: "Success!",
      description: "Job link has been added successfully.",
    });
  };

  const deleteJobLink = (id: number) => {
    const updatedLinks = jobLinks.filter(job => job.id !== id);
    saveJobLinks(updatedLinks);
    
    toast({
      title: "Deleted",
      description: "Job link has been removed.",
    });
  };

  return (
    <Layout>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Admin Dashboard
          </h1>
          <p className="text-xl md:text-2xl">
            Manage job listings and website content
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Add New Job Form */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Plus className="h-6 w-6 mr-2" />
                  Add New Job Link
                </CardTitle>
                <CardDescription>
                  Fill out the form below to add a new job listing to the website.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={addJobLink} className="space-y-6">
                  <div>
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                      Job Title *
                    </label>
                    <Input
                      id="title"
                      name="title"
                      type="text"
                      required
                      value={newJob.title}
                      onChange={handleInputChange}
                      placeholder="e.g., Customer Service Representative"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-2">
                      Company Name *
                    </label>
                    <Input
                      id="company"
                      name="company"
                      type="text"
                      required
                      value={newJob.company}
                      onChange={handleInputChange}
                      placeholder="e.g., Remote Solutions Inc."
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
                        Location
                      </label>
                      <Input
                        id="location"
                        name="location"
                        type="text"
                        value={newJob.location}
                        onChange={handleInputChange}
                        placeholder="e.g., Remote - USA"
                      />
                    </div>
                    <div>
                      <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-2">
                        Job Type
                      </label>
                      <Input
                        id="type"
                        name="type"
                        type="text"
                        value={newJob.type}
                        onChange={handleInputChange}
                        placeholder="e.g., Full-time, Part-time"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="salary" className="block text-sm font-medium text-gray-700 mb-2">
                      Salary Range
                    </label>
                    <Input
                      id="salary"
                      name="salary"
                      type="text"
                      value={newJob.salary}
                      onChange={handleInputChange}
                      placeholder="e.g., $35,000 - $45,000 or $15-20/hour"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="url" className="block text-sm font-medium text-gray-700 mb-2">
                      Application URL *
                    </label>
                    <Input
                      id="url"
                      name="url"
                      type="url"
                      required
                      value={newJob.url}
                      onChange={handleInputChange}
                      placeholder="https://example.com/apply"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                      Job Description
                    </label>
                    <Textarea
                      id="description"
                      name="description"
                      value={newJob.description}
                      onChange={handleInputChange}
                      placeholder="Brief description of the job responsibilities..."
                      rows={4}
                    />
                  </div>
                  
                  <Button type="submit" className="w-full">
                    Add Job Link
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Existing Job Links */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Current Job Listings ({jobLinks.length})</CardTitle>
                <CardDescription>
                  Manage existing job links on your website.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {jobLinks.length === 0 ? (
                    <p className="text-gray-500 text-center py-8">
                      No job links added yet. Add your first job link using the form.
                    </p>
                  ) : (
                    jobLinks.map((job) => (
                      <div key={job.id} className="border rounded-lg p-4 space-y-2">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <h3 className="font-semibold text-blue-600">{job.title}</h3>
                            <p className="text-gray-700">{job.company}</p>
                            {job.location && (
                              <p className="text-sm text-gray-500">{job.location}</p>
                            )}
                            {job.salary && (
                              <p className="text-sm text-green-600 font-medium">{job.salary}</p>
                            )}
                          </div>
                          <div className="flex space-x-2">
                            <Button
                              size="sm"
                              variant="outline"
                              asChild
                            >
                              <a href={job.url} target="_blank" rel="noopener noreferrer">
                                <ExternalLink className="h-4 w-4" />
                              </a>
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => deleteJobLink(job.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                        {job.description && (
                          <p className="text-sm text-gray-600 mt-2">{job.description}</p>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AdminLinks;
