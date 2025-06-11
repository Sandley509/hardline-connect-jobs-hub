
import AdminLayout from "@/components/AdminLayout";
import { useAuth } from "@/contexts/AuthContext";
import { Card } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Shield, Users, AlertCircle } from "lucide-react";

const AdminModerators = () => {
  const { isAdmin } = useAuth();

  // Fetch admin list
  const { data: admins, isLoading: loadingAdmins } = useQuery({
    queryKey: ['admins'],
    queryFn: async () => {
      console.log('Fetching admins list...');
      const { data, error } = await supabase
        .from('admins')
        .select(`
          user_id,
          created_at,
          profiles!inner(username)
        `);

      if (error) {
        console.error('Error fetching admins:', error);
        throw error;
      }

      console.log('Admins fetched:', data);
      return data || [];
    },
    enabled: isAdmin
  });

  if (!isAdmin) {
    return (
      <AdminLayout>
        <Card className="p-6">
          <div className="flex items-center mb-4">
            <AlertCircle className="h-6 w-6 text-red-600 mr-3" />
            <h3 className="text-lg font-semibold text-red-900">Access Denied</h3>
          </div>
          <p className="text-gray-700">
            You don't have permission to access this page. This page is only available to administrators.
          </p>
        </Card>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">
            Administrator Management
          </h1>
        </div>

        {/* Admin Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="p-6">
            <div className="flex items-center mb-4">
              <Shield className="h-6 w-6 text-green-600 mr-3" />
              <h2 className="text-xl font-semibold text-gray-900">Admin Overview</h2>
            </div>
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center mb-2">
                <Shield className="h-5 w-5 text-green-600 mr-2" />
                <span className="font-medium text-green-900">Active Admins</span>
              </div>
              <p className="text-2xl font-bold text-green-900">
                {loadingAdmins ? '...' : admins?.length || 0}
              </p>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center mb-4">
              <Users className="h-6 w-6 text-blue-600 mr-3" />
              <h2 className="text-xl font-semibold text-gray-900">System Information</h2>
            </div>
            <div className="space-y-4">
              <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                <p className="font-medium mb-1">Simplified Admin System:</p>
                <ul className="text-xs space-y-1">
                  <li>• Role system has been simplified</li>
                  <li>• Only admin roles are supported</li>
                  <li>• Moderator functionality removed</li>
                  <li>• Cleaner database structure</li>
                </ul>
              </div>
            </div>
          </Card>
        </div>

        {/* Admins List */}
        <Card className="p-6">
          <div className="flex items-center mb-4">
            <Shield className="h-6 w-6 text-orange-600 mr-3" />
            <h2 className="text-xl font-semibold text-gray-900">Current Administrators</h2>
          </div>
          
          {loadingAdmins ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600 mx-auto"></div>
              <p className="text-gray-500 mt-2">Loading administrators...</p>
            </div>
          ) : admins && admins.length > 0 ? (
            <div className="space-y-3">
              {admins.map((admin: any) => (
                <div key={admin.user_id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <div className="h-10 w-10 bg-orange-100 rounded-full flex items-center justify-center mr-3">
                      <Shield className="h-5 w-5 text-orange-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{admin.profiles?.username || 'Unknown User'}</p>
                      <p className="text-sm text-gray-500">
                        Admin since: {new Date(admin.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Administrator
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Shield className="h-12 w-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-500">No administrators found</p>
              <p className="text-sm text-gray-400">Contact system administrator to add admin users</p>
            </div>
          )}
        </Card>

        {/* Admin Permissions Info */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-3">Administrator Permissions</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium text-gray-900 mb-2">✅ Administrator Capabilities:</h4>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• Full user management access</li>
                <li>• Manage orders and customer communications</li>
                <li>• Add and edit services & products</li>
                <li>• Manage job postings and blog posts</li>
                <li>• Access all admin features</li>
                <li>• System configuration and settings</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-2">ℹ️ System Notes:</h4>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• Moderator system has been removed</li>
                <li>• Simplified admin-only role structure</li>
                <li>• Better database performance</li>
                <li>• Reduced complexity</li>
                <li>• Contact developer to add new admins</li>
              </ul>
            </div>
          </div>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminModerators;
