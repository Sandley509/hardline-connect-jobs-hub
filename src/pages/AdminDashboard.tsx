
import AdminLayout from "@/components/AdminLayout";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import OrderStatistics from "@/components/admin/OrderStatistics";
import ActiveUsersList from "@/components/admin/ActiveUsersList";
import { Shield, Users, AlertCircle } from "lucide-react";

const AdminDashboard = () => {
  const { isAdmin } = useAuth();

  // Fetch orders data for statistics
  const { data: orders } = useQuery({
    queryKey: ['admin-dashboard-orders'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching orders:', error);
        throw error;
      }
      return data || [];
    }
  });

  // Test admin permissions
  const { data: adminTest, error: adminError } = useQuery({
    queryKey: ['admin-test'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return { isAdmin: false, error: 'Not authenticated' };

      const { data: result, error } = await supabase.rpc('is_admin', { _user_id: user.id });
      return { isAdmin: result, error: error?.message };
    },
    enabled: !!isAdmin
  });

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-primary to-primary/80 rounded-lg p-6 text-primary-foreground">
          <div className="flex items-center space-x-3">
            <Shield className="h-8 w-8" />
            <div>
              <h1 className="text-2xl font-bold">Admin Dashboard</h1>
              <p className="opacity-90">
                Manage your platform with full administrative control
              </p>
            </div>
          </div>
          
          {/* Debug Info for Admin */}
          {isAdmin && adminTest && (
            <div className="mt-4 p-3 bg-black bg-opacity-20 rounded-lg">
              <div className="flex items-center mb-2">
                <AlertCircle className="h-4 w-4 mr-2" />
                <span className="text-sm font-medium">Admin Status Check:</span>
              </div>
              <p className="text-xs font-mono">
                Admin Permission: {adminTest.isAdmin ? '✅ Confirmed' : '❌ Failed'} 
                {adminTest.error && ` (${adminTest.error})`}
              </p>
            </div>
          )}
        </div>

        {/* Statistics and Active Users */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <OrderStatistics orders={orders || []} />
          <ActiveUsersList />
        </div>

        {/* Admin Information */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold text-foreground mb-4">
            Administrator Capabilities
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h3 className="font-medium text-foreground">Content Management</h3>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Manage services and products</li>
                <li>• Create and edit blog posts</li>
                <li>• Handle job postings</li>
                <li>• Process customer orders</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h3 className="font-medium text-foreground">Administrative Control</h3>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Full user management access</li>
                <li>• System-wide notifications</li>
                <li>• Complete platform oversight</li>
                <li>• Database administration</li>
              </ul>
            </div>
          </div>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
