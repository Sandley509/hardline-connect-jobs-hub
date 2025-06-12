
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const AdminSetup = () => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const addAdminUser = async () => {
    setLoading(true);
    try {
      // Add the specific user as admin
      const { data, error } = await supabase
        .from('admins')
        .insert([
          { user_id: '4a962edc-1c6a-4c63-ae6a-b0a431dd2a9a' } // Your user ID from the auth logs
        ])
        .select();

      if (error) {
        console.error('Error adding admin:', error);
        toast({
          title: "Error",
          description: "Failed to add admin user",
          variant: "destructive"
        });
      } else {
        console.log('Successfully added admin:', data);
        toast({
          title: "Success",
          description: "Admin user added successfully! Please refresh the page.",
        });
      }
    } catch (error) {
      console.error('Error in addAdminUser:', error);
      toast({
        title: "Error",
        description: "Failed to add admin user",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="p-6 max-w-md mx-auto mt-10">
      <h2 className="text-xl font-semibold mb-4">Admin Setup</h2>
      <p className="text-gray-600 mb-4">
        Click the button below to add estaliensandley14@gmail.com as an admin user.
      </p>
      <Button 
        onClick={addAdminUser} 
        disabled={loading}
        className="w-full"
      >
        {loading ? "Adding Admin..." : "Add Admin User"}
      </Button>
    </Card>
  );
};

export default AdminSetup;
