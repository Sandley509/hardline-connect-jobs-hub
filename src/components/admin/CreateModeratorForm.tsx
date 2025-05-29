
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { UserPlus, Mail, Lock, User } from "lucide-react";

const CreateModeratorForm = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    username: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
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

    try {
      // Create the user account
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: formData.email,
        password: formData.password,
        user_metadata: {
          username: formData.username
        },
        email_confirm: true // Auto-confirm email for admin-created accounts
      });

      if (authError) {
        console.error('Auth error:', authError);
        throw authError;
      }

      if (!authData.user) {
        throw new Error('User creation failed - no user data returned');
      }

      // Assign moderator role
      const { error: roleError } = await supabase
        .from('user_roles')
        .insert({
          user_id: authData.user.id,
          role: 'moderator'
        });

      if (roleError) {
        console.error('Role assignment error:', roleError);
        // Try to clean up the created user if role assignment fails
        await supabase.auth.admin.deleteUser(authData.user.id);
        throw roleError;
      }

      toast({
        title: "Moderator Created Successfully",
        description: `${formData.username} has been created as a moderator.`,
      });

      // Reset form
      setFormData({ email: '', password: '', username: '' });

    } catch (error: any) {
      console.error('Error creating moderator:', error);
      
      let errorMessage = "Failed to create moderator account.";
      
      if (error.message?.includes('User already registered')) {
        errorMessage = "A user with this email address already exists.";
      } else if (error.message?.includes('Invalid email')) {
        errorMessage = "Please enter a valid email address.";
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
    </Card>
  );
};

export default CreateModeratorForm;
