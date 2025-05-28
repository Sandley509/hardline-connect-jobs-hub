
import AdminLayout from "@/components/AdminLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import { Search, Ban, CheckCircle, AlertTriangle, Package } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface UserProfile {
  id: string;
  username: string;
  email: string;
  created_at: string;
  is_blocked?: boolean;
  blocked_reason?: string;
  order_count?: number;
  total_spent?: number;
}

const AdminUsers = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: users, isLoading, error } = useQuery({
    queryKey: ['admin-users'],
    queryFn: async () => {
      console.log('Starting to fetch users...');
      
      try {
        // First, get all profiles
        const { data: allProfiles, error: profilesError } = await supabase
          .from('profiles')
          .select('*')
          .order('created_at', { ascending: false });

        if (profilesError) {
          console.error('Error fetching profiles:', profilesError);
          throw profilesError;
        }

        console.log('All profiles fetched:', allProfiles?.length || 0);

        if (!allProfiles || allProfiles.length === 0) {
          console.log('No profiles found in database');
          return [];
        }

        // Get admin user IDs separately
        const { data: adminRoles, error: adminError } = await supabase
          .from('user_roles')
          .select('user_id')
          .eq('role', 'admin');

        if (adminError) {
          console.error('Error fetching admin roles:', adminError);
          // Continue without filtering admins if this fails
        }

        const adminUserIds = adminRoles?.map(role => role.user_id) || [];
        console.log('Admin user IDs:', adminUserIds);

        // Filter out admin users from profiles
        const nonAdminProfiles = allProfiles.filter(profile => 
          !adminUserIds.includes(profile.id)
        );
        
        console.log('Non-admin profiles:', nonAdminProfiles.length);

        if (nonAdminProfiles.length === 0) {
          console.log('No non-admin users found');
          return [];
        }

        // Get additional user data in parallel
        const [userStatusResponse, userProfilesResponse, ordersResponse] = await Promise.all([
          supabase.from('user_status').select('*'),
          supabase.from('user_profiles').select('*'),
          supabase.from('orders').select('user_id, total_amount')
        ]);

        const userStatuses = userStatusResponse.data || [];
        const userProfiles = userProfilesResponse.data || [];
        const allOrders = ordersResponse.data || [];

        console.log('Additional data fetched:', {
          userStatuses: userStatuses.length,
          userProfiles: userProfiles.length,
          orders: allOrders.length
        });

        // Process and combine the data
        const processedUsers = nonAdminProfiles.map((profile) => {
          // Find user status
          const status = userStatuses.find(s => s.user_id === profile.id);
          
          // Find user profile for additional info
          const userProfile = userProfiles.find(up => up.user_id === profile.id);

          // Calculate order statistics
          const userOrders = allOrders.filter(order => order.user_id === profile.id);
          const orderCount = userOrders.length;
          const totalSpent = userOrders.reduce((sum, order) => {
            const amount = parseFloat(order.total_amount?.toString() || '0');
            return sum + (isNaN(amount) ? 0 : amount);
          }, 0);

          // Create email from username or profile info
          let email = `${profile.username || 'user'}@example.com`;
          if (userProfile?.first_name && userProfile?.last_name) {
            email = `${userProfile.first_name.toLowerCase()}.${userProfile.last_name.toLowerCase()}@example.com`;
          }

          return {
            id: profile.id,
            username: profile.username || 'Unknown User',
            email,
            created_at: profile.created_at,
            is_blocked: status?.is_blocked || false,
            blocked_reason: status?.blocked_reason || null,
            order_count: orderCount,
            total_spent: totalSpent
          };
        });

        console.log('Final processed users:', processedUsers.length);
        return processedUsers;

      } catch (error) {
        console.error('Error in user query:', error);
        throw error;
      }
    }
  });

  const blockUserMutation = useMutation({
    mutationFn: async ({ userId, reason }: { userId: string; reason: string }) => {
      console.log('Blocking user:', userId, 'Reason:', reason);
      
      const { data: currentUser } = await supabase.auth.getUser();
      const { error } = await supabase
        .from('user_status')
        .upsert({
          user_id: userId,
          is_blocked: true,
          blocked_reason: reason,
          blocked_at: new Date().toISOString(),
          blocked_by: currentUser.user?.id
        });

      if (error) {
        console.error('Block user error:', error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      toast({
        title: "User blocked successfully",
        description: "The user has been blocked and their access has been removed.",
      });
    },
    onError: (error) => {
      console.error('Error blocking user:', error);
      toast({
        title: "Error blocking user",
        description: "There was an error blocking the user. Please try again.",
        variant: "destructive",
      });
    }
  });

  const unblockUserMutation = useMutation({
    mutationFn: async (userId: string) => {
      console.log('Unblocking user:', userId);
      
      const { error } = await supabase
        .from('user_status')
        .upsert({
          user_id: userId,
          is_blocked: false,
          blocked_reason: null,
          blocked_at: null,
          blocked_by: null
        });

      if (error) {
        console.error('Unblock user error:', error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      toast({
        title: "User unblocked successfully",
        description: "The user can now access the platform again.",
      });
    },
    onError: (error) => {
      console.error('Error unblocking user:', error);
      toast({
        title: "Error unblocking user",
        description: "There was an error unblocking the user. Please try again.",
        variant: "destructive",
      });
    }
  });

  const deleteUserMutation = useMutation({
    mutationFn: async (userId: string) => {
      console.log('Deleting user:', userId);
      
      // Delete related data first to avoid foreign key constraints
      await Promise.all([
        supabase.from('user_status').delete().eq('user_id', userId),
        supabase.from('user_profiles').delete().eq('user_id', userId),
        supabase.from('user_roles').delete().eq('user_id', userId)
      ]);

      // Finally delete the profile
      const { error } = await supabase
        .from('profiles')
        .delete()
        .eq('id', userId);

      if (error) {
        console.error('Delete user error:', error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      toast({
        title: "User deleted successfully",
        description: "The user and all associated data have been removed.",
      });
    },
    onError: (error) => {
      console.error('Error deleting user:', error);
      toast({
        title: "Error deleting user",
        description: "There was an error deleting the user. Please try again.",
        variant: "destructive",
      });
    }
  });

  const filteredUsers = users?.filter(user =>
    user.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleBlockUser = (userId: string) => {
    const reason = prompt("Enter reason for blocking this user:");
    if (reason) {
      blockUserMutation.mutate({ userId, reason });
    }
  };

  const handleDeleteUser = (userId: string, username: string) => {
    const confirmed = confirm(`Are you sure you want to delete user "${username}"? This action cannot be undone.`);
    if (confirmed) {
      deleteUserMutation.mutate(userId);
    }
  };

  // Show error state if there's an error
  if (error) {
    console.error('Query error:', error);
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-64"
              />
            </div>
          </div>
        </div>

        <Card className="p-6">
          {isLoading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600"></div>
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <p className="text-red-600">Error loading users: {error.message}</p>
              <Button 
                onClick={() => queryClient.invalidateQueries({ queryKey: ['admin-users'] })}
                className="mt-4"
              >
                Retry
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-medium text-gray-900">User</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Email</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Orders</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Total Spent</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Joined</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Status</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers?.map((user) => (
                    <tr key={user.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <div className="flex items-center">
                          <div className="h-8 w-8 bg-orange-600 rounded-full flex items-center justify-center mr-3">
                            <span className="text-white text-sm font-medium">
                              {user.username?.charAt(0).toUpperCase() || 'U'}
                            </span>
                          </div>
                          <span className="font-medium text-gray-900">{user.username}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-gray-600">{user.email}</td>
                      <td className="py-3 px-4">
                        <div className="flex items-center">
                          <Package className="h-4 w-4 text-gray-400 mr-1" />
                          <span className="text-gray-900">{user.order_count}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-medium text-gray-900">
                          ${user.total_spent?.toFixed(2) || '0.00'}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-gray-600">
                        {new Date(user.created_at).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4">
                        {user.is_blocked ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                            <AlertTriangle className="h-3 w-3 mr-1" />
                            Blocked
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Active
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex space-x-2">
                          {user.is_blocked ? (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => unblockUserMutation.mutate(user.id)}
                              disabled={unblockUserMutation.isPending}
                            >
                              <CheckCircle className="h-4 w-4 mr-1" />
                              Unblock
                            </Button>
                          ) : (
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleBlockUser(user.id)}
                              disabled={blockUserMutation.isPending}
                            >
                              <Ban className="h-4 w-4 mr-1" />
                              Block
                            </Button>
                          )}
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleDeleteUser(user.id, user.username)}
                            disabled={deleteUserMutation.isPending}
                          >
                            Delete
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {(!filteredUsers || filteredUsers.length === 0) && !isLoading && !error && (
                <div className="text-center py-8">
                  <p className="text-gray-500">No users found. Users will appear here once they sign up and create profiles.</p>
                </div>
              )}
            </div>
          )}
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminUsers;
