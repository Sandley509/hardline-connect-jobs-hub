
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { UserPlus, Mail, Lock, User, AlertCircle, CheckCircle } from "lucide-react";

const CreateModeratorForm = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    username: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [debugInfo, setDebugInfo] = useState<string>('');
  const { toast } = useToast();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log('Form submission started');
    setDebugInfo('Starting form submission...');
    
    if (!formData.email || !formData.password || !formData.username) {
      toast({
        title: "Validation Error",
        description: "Please fill in all fields.",
        variant: "destructive",
      });
      return;
    }

    if (formData.password.length < 6) {
      toast({
        title: "Validation Error", 
        description: "Password must be at least 6 characters long.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    setDebugInfo('Validating user session...');

    try {
      // Check if user is authenticated
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError || !user) {
        console.error('Authentication error:', userError);
        setDebugInfo(`Authentication failed: ${userError?.message}`);
        toast({
          title: "Authentication Error",
          description: "You must be logged in to create moderators.",
          variant: "destructive",
        });
        return;
      }

      console.log('User authenticated:', user.id);
      setDebugInfo(`User authenticated: ${user.id}`);

      // Check if user is admin
      const { data: isAdminResult, error: adminError } = await supabase
        .rpc('is_admin', { _user_id: user.id });

      if (adminError) {
        console.error('Admin check error:', adminError);
        setDebugInfo(`Admin check failed: ${adminError.message}`);
        toast({
          title: "Permission Error",
          description: "Unable to verify admin permissions.",
          variant: "destructive",
        });
        return;
      }

      if (!isAdminResult) {
        console.error('User is not admin:', user.id);
        setDebugInfo('User does not have admin permissions');
        toast({
          title: "Access Denied",
          description: "Only administrators can create moderators.",
          variant: "destructive",
        });
        return;
      }

      console.log('Admin verification passed');
      setDebugInfo('Admin verification passed, calling edge function...');
      
      // Call the edge function to create moderator
      const { data, error } = await supabase.functions.invoke('create-moderator', {
        body: {
          email: formData.email,
          password: formData.password,
          username: formData.username
        }
      });

      console.log('Edge function response:', { data, error });
      setDebugInfo(`Edge function response: ${JSON.stringify({ data, error })}`);

      if (error) {
        console.error('Edge function error:', error);
        throw error;
      }

      if (!data || !data.success) {
        const errorMessage = data?.error || 'Failed to create moderator';
        console.error('Moderator creation failed:', errorMessage);
        throw new Error(errorMessage);
      }

      console.log('Moderator created successfully:', data);
      setDebugInfo('Moderator created successfully!');

      toast({
        title: "Moderator Created Successfully",
        description: `${formData.username} has been created as a moderator.`,
      });

      // Reset form
      setFormData({ email: '', password: '', username: '' });

    } catch (error: any) {
      console.error('Error creating moderator:', error);
      setDebugInfo(`Error: ${error.message}`);
      
      let errorMessage = "Failed to create moderator account.";
      
      if (error.message?.includes('User already registered') || error.message?.includes('already registered')) {
        errorMessage = "A user with this email address already exists.";
      } else if (error.message?.includes('Invalid email')) {
        errorMessage = "Please enter a valid email address.";
      } else if (error.message?.includes('Access denied')) {
        errorMessage = "You don't have permission to create moderators.";
      } else if (error.message) {
        errorMessage = error.message;
      }

      toast({
        title: "Error Creating Moderator",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="p-6">
      <div className="flex items-center mb-6">
        <UserPlus className="h-6 w-6 text-orange-600 mr-3" />
        <h2 className="text-xl font-semibold text-gray-900">Create New Moderator</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="username" className="flex items-center mb-2">
            <User className="h-4 w-4 mr-2" />
            Username
          </Label>
          <Input
            id="username"
            name="username"
            type="text"
            value={formData.username}
            onChange={handleInputChange}
            placeholder="Enter username"
            disabled={isSubmitting}
            required
          />
        </div>

        <div>
          <Label htmlFor="email" className="flex items-center mb-2">
            <Mail className="h-4 w-4 mr-2" />
            Email Address
          </Label>
          <Input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleInputChange}
            placeholder="moderator@example.com"
            disabled={isSubmitting}
            required
          />
        </div>

        <div>
          <Label htmlFor="password" className="flex items-center mb-2">
            <Lock className="h-4 w-4 mr-2" />
            Password
          </Label>
          <Input
            id="password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleInputChange}
            placeholder="Minimum 6 characters"
            disabled={isSubmitting}
            required
            minLength={6}
          />
        </div>

        <Button 
          type="submit" 
          disabled={isSubmitting}
          className="w-full bg-orange-600 hover:bg-orange-700"
        >
          {isSubmitting ? "Creating Moderator..." : "Create Moderator Account"}
        </Button>
      </form>

      {/* Debug Information */}
      {debugInfo && (
        <div className="mt-4 p-3 bg-gray-100 rounded-lg">
          <div className="flex items-center mb-2">
            <AlertCircle className="h-4 w-4 text-blue-600 mr-2" />
            <span className="text-sm font-medium text-gray-900">Debug Info:</span>
          </div>
          <p className="text-xs text-gray-600 font-mono">{debugInfo}</p>
        </div>
      )}
    </Card>
  );
};

export default CreateModeratorForm;
