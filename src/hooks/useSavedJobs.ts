import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

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

export const useSavedJobs = () => {
  const { user, session } = useAuth();
  const { toast } = useToast();
  const [savedJobIds, setSavedJobIds] = useState<Set<string>>(new Set());
  const [savedJobs, setSavedJobs] = useState<JobLink[]>([]);
  const [loading, setLoading] = useState(false);

  // Load saved jobs on mount and when user changes
  useEffect(() => {
    if (user && session) {
      loadSavedJobs();
    } else {
      // Load from localStorage if not authenticated
      loadSavedJobsFromLocalStorage();
    }
  }, [user, session]);

  const loadSavedJobs = async () => {
    if (!user || !session) return;

    try {
      setLoading(true);
      // First, we need to create the saved_jobs table if it doesn't exist
      // For now, we'll use localStorage as a fallback
      loadSavedJobsFromLocalStorage();
    } catch (error) {
      console.error('Error loading saved jobs:', error);
      loadSavedJobsFromLocalStorage();
    } finally {
      setLoading(false);
    }
  };

  const loadSavedJobsFromLocalStorage = () => {
    try {
      const saved = localStorage.getItem('savedJobs');
      if (saved) {
        const parsedJobs = JSON.parse(saved);
        setSavedJobs(parsedJobs);
        setSavedJobIds(new Set(parsedJobs.map((job: JobLink) => job.id)));
      }
    } catch (error) {
      console.error('Error loading saved jobs from localStorage:', error);
    }
  };

  const saveJob = (job: JobLink) => {
    try {
      const newSavedJobs = [...savedJobs, job];
      setSavedJobs(newSavedJobs);
      setSavedJobIds(new Set([...savedJobIds, job.id]));
      
      // Save to localStorage
      localStorage.setItem('savedJobs', JSON.stringify(newSavedJobs));
      
      toast({
        title: "Job Saved",
        description: `${job.title} at ${job.company} has been saved to your favorites.`,
      });
    } catch (error) {
      console.error('Error saving job:', error);
      toast({
        title: "Error",
        description: "Failed to save job. Please try again.",
        variant: "destructive"
      });
    }
  };

  const unsaveJob = (job: JobLink | string) => {
    try {
      const jobId = typeof job === 'string' ? job : job.id;
      const newSavedJobs = savedJobs.filter(savedJob => savedJob.id !== jobId);
      setSavedJobs(newSavedJobs);
      setSavedJobIds(new Set(Array.from(savedJobIds).filter(id => id !== jobId)));
      
      // Update localStorage
      localStorage.setItem('savedJobs', JSON.stringify(newSavedJobs));
      
      toast({
        title: "Job Removed",
        description: "Job has been removed from your saved jobs.",
      });
    } catch (error) {
      console.error('Error removing saved job:', error);
      toast({
        title: "Error",
        description: "Failed to remove job. Please try again.",
        variant: "destructive"
      });
    }
  };

  const isJobSaved = (jobId: string) => {
    return savedJobIds.has(jobId);
  };

  const clearAllSavedJobs = () => {
    setSavedJobs([]);
    setSavedJobIds(new Set());
    localStorage.removeItem('savedJobs');
    
    toast({
      title: "Saved Jobs Cleared",
      description: "All saved jobs have been removed.",
    });
  };

  return {
    savedJobs,
    savedJobIds,
    loading,
    saveJob,
    unsaveJob,
    isJobSaved,
    clearAllSavedJobs,
    savedJobsCount: savedJobs.length
  };
};