
import AdminLayout from "@/components/AdminLayout";
import { useAuth } from "@/contexts/AuthContext";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Shield, Users, UserPlus, AlertCircle, CheckCircle } from "lucide-react";
import CreateModeratorForm from "@/components/admin/CreateModeratorForm";

const AdminModerators = () => {
  const { isAdmin, isModerator } = useAuth();

  // Fetch moderators list
  const { data: moderators, isLoading: loadingModerators } = useQuery({
    queryKey: ['moderators'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('user_roles')
        .select(`
          user_id,
          role,
          created_at,
          profiles!inner(username)
        `)
        .eq('role', 'moderator');

      if (error) {
        console.error('Error fetching moderators:', error);
        throw error;
      }

      return data || [];
    },
    enabled: isAdmin
  });

  // Fetch admin roles for comparison
  const { data: admins, isLoading: loadingAdmins } = useQuery({
    queryKey: ['admins'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('user_roles')
        .select(`
          user_id,
          role,
          created_at,
          profiles!inner(username)
        `)
        .eq('role', 'admin');

      if (error) {
        console.error('Error fetching admins:', error);
        throw error;
      }

      return data || [];
    },
    enabled: isAdmin
  });

  if (!isAdmin && !isModerator) {
    return (
      <AdminLayout>
        <Card className="p-6">
          <div className="flex items-center mb-4">
            <AlertCircle className="h-6 w-6 text-red-600 mr-3" />
            <h3 className="text-lg font-semibold text-red-900">Access Denied</h3>
          </div>
          <p className="text-gray-700">
            You don't have permission to access this page. This page is only available to administrators and moderators.
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
            {isAdmin ? 'Moderator Management' : 'Moderator Information'}
          </h1>
        </div>

        {isAdmin ? (
          <>
            {/* Create Moderator Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <CreateModeratorForm />
              
              <Card className="p-6">
                <div className="flex items-center mb-4">
                  <Users className="h-6 w-6 text-blue-600 mr-3" />
                  <h2 className="text-xl font-semibold text-gray-900">Management Overview</h2>
                </div>
                <div className="space-y-4">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-center mb-2">
                      <CheckCircle className="h-5 w-5 text-blue-600 mr-2" />
                      <span className="font-medium text-blue-900">Active Moderators</span>
                    </div>
                    <p className="text-2xl font-bold text-blue-900">
                      {loadingModerators ? '...' : moderators?.length || 0}
                    </p>
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
                </div>
              </Card>
            </div>

            {/* Moderators List */}
            <Card className="p-6">
              <div className="flex items-center mb-4">
                <UserPlus className="h-6 w-6 text-orange-600 mr-3" />
                <h2 className="text-xl font-semibold text-gray-900">Current Moderators</h2>
              </div>
              
              {loadingModerators ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600 mx-auto"></div>
                  <p className="text-gray-500 mt-2">Loading moderators...</p>
                </div>
              ) : moderators && moderators.length > 0 ? (
                <div className="space-y-3">
                  {moderators.map((mod: any) => (
                    <div key={mod.user_id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center">
                        <div className="h-10 w-10 bg-orange-100 rounded-full flex items-center justify-center mr-3">
                          <Shield className="h-5 w-5 text-orange-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{mod.profiles.username}</p>
                          <p className="text-sm text-gray-500">
                            Created: {new Date(mod.created_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                        Moderator
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <UserPlus className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-500">No moderators found</p>
                  <p className="text-sm text-gray-400">Create your first moderator using the form above</p>
                </div>
              )}
            </Card>

            {/* Moderator Permissions Info */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-blue-900 mb-3">Moderator Permissions</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">✅ What Moderators Can Do:</h4>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>• Manage orders and customer communications</li>
                    <li>• Add and edit services & products</li>
                    <li>• Manage job postings</li>
                    <li>• Create and manage blog posts</li>
                    <li>• Access moderator dashboard</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">❌ What Moderators Cannot Do:</h4>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>• Create other moderators or admins</li>
                    <li>• Access user management</li>
                    <li>• Modify system settings</li>
                    <li>• Delete other moderators</li>
                    <li>• Access admin-only features</li>
                  </ul>
                </div>
              </div>
            </Card>
          </>
        ) : isModerator ? (
          <>
            <Card className="p-6">
              <div className="flex items-center mb-4">
                <Shield className="h-6 w-6 text-orange-600 mr-3" />
                <h3 className="text-lg font-semibold text-orange-900">Your Moderator Permissions</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">✅ What You Can Do:</h4>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>• Manage orders and customer communications</li>
                    <li>• Add and edit services & products</li>
                    <li>• Manage job postings</li>
                    <li>• Create and manage blog posts</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">❌ What You Cannot Do:</h4>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>• Create other moderators</li>
                    <li>• Access user management</li>
                    <li>• Modify system settings</li>
                    <li>• Access admin-only features</li>
                  </ul>
                </div>
              </div>
              <div className="mt-4 p-3 bg-orange-50 rounded-lg">
                <p className="text-sm text-orange-800">
                  <strong>Note:</strong> Only administrators can create new moderator accounts.
                </p>
              </div>
            </Card>
          </>
        ) : null}
      </div>
    </AdminLayout>
  );
};

export default AdminModerators;
