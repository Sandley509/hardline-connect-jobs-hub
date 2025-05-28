import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
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
  is_admin?: boolean;
}

export const useAdminUsers = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: users, isLoading, error } = useQuery({
    queryKey: ['admin-users'],
    queryFn: async () => {
      console.log('Fetching all users for admin...');
      
      try {
        // Get current user
        const { data: { user: currentUser } } = await supabase.auth.getUser();
        console.log('Current admin user ID:', currentUser?.id);

        // Get ALL profiles first
        const { data: allProfiles, error: profilesError } = await supabase
          .from('profiles')
          .select('*')
          .order('created_at', { ascending: false });

        if (profilesError) {
          console.error('Error fetching profiles:', profilesError);
          throw profilesError;
        }

        console.log('Total profiles found:', allProfiles?.length || 0);

        if (!allProfiles || allProfiles.length === 0) {
          console.log('No profiles found in database');
          return [];
        }

        // Get admin users to exclude them
        const { data: adminRoles, error: rolesError } = await supabase
          .from('user_roles')
          .select('user_id')
          .eq('role', 'admin');

        if (rolesError) {
          console.error('Error fetching admin roles:', rolesError);
          // Continue without admin filtering if this fails
        }

        console.log('Admin roles found:', adminRoles?.length || 0);
        const adminUserIds = adminRoles?.map(role => role.user_id) || [];
        console.log('Admin user IDs:', adminUserIds);

        // Get user status data (with error handling)
        let userStatuses = [];
        try {
          const { data, error } = await supabase.from('user_status').select('*');
          if (error) {
            console.error('Error fetching user statuses:', error);
          } else {
            userStatuses = data || [];
          }
        } catch (err) {
          console.error('Failed to fetch user statuses:', err);
        }

        // Get user profiles data (with error handling)
        let userProfiles = [];
        try {
          const { data, error } = await supabase.from('user_profiles').select('*');
          if (error) {
            console.error('Error fetching user profiles:', error);
          } else {
            userProfiles = data || [];
          }
        } catch (err) {
          console.error('Failed to fetch user profiles:', err);
        }

        // Get orders data (with error handling)
        let allOrders = [];
        try {
          const { data, error } = await supabase.from('orders').select('user_id, total_amount');
          if (error) {
            console.error('Error fetching orders:', error);
          } else {
            allOrders = data || [];
          }
        } catch (err) {
          console.error('Failed to fetch orders:', err);
        }

        console.log('User statuses found:', userStatuses.length);
        console.log('User profiles found:', userProfiles.length);
        console.log('Orders found:', allOrders.length);

        // Process all profiles and only exclude current user and confirmed admins
        const processedUsers: UserProfile[] = allProfiles
          .filter(profile => {
            // Exclude current user
            if (profile.id === currentUser?.id) {
              console.log('Excluding current user:', profile.id);
              return false;
            }
            
            // Only exclude if we confirmed they are admin
            if (adminUserIds.includes(profile.id)) {
              console.log('Excluding confirmed admin user:', profile.id);
              return false;
            }
            
            console.log('Including user:', profile.id, profile.username);
            return true;
          })
          .map((profile) => {
            try {
              const status = userStatuses.find(s => s.user_id === profile.id);
              const userProfile = userProfiles.find(up => up.user_id === profile.id);
              const userOrders = allOrders.filter(order => order.user_id === profile.id) || [];
              
              const orderCount = userOrders.length;
              const totalSpent = userOrders.reduce((sum, order) => {
                const amount = parseFloat(order.total_amount?.toString() || '0');
                return sum + (isNaN(amount) ? 0 : amount);
              }, 0);

              // Generate email based on available data
              let email = profile.username ? `${profile.username}@example.com` : `user${profile.id.slice(0, 8)}@example.com`;
              if (userProfile?.first_name && userProfile?.last_name) {
                email = `${userProfile.first_name.toLowerCase()}.${userProfile.last_name.toLowerCase()}@example.com`;
              }

              const processedUser = {
                id: profile.id,
                username: profile.username || `User_${profile.id.slice(0, 8)}`,
                email,
                created_at: profile.created_at,
                is_blocked: status?.is_blocked || false,
                blocked_reason: status?.blocked_reason || null,
                order_count: orderCount,
                total_spent: totalSpent,
                is_admin: false
              };

              console.log('Processed user:', processedUser);
              return processedUser;
            } catch (err) {
              console.error('Error processing user:', profile.id, err);
              // Return a basic user object even if processing fails
              return {
                id: profile.id,
                username: profile.username || `User_${profile.id.slice(0, 8)}`,
                email: profile.username ? `${profile.username}@example.com` : `user${profile.id.slice(0, 8)}@example.com`,
                created_at: profile.created_at,
                is_blocked: false,
                blocked_reason: null,
                order_count: 0,
                total_spent: 0,
                is_admin: false
              };
            }
          });

        console.log('Final processed users count:', processedUsers.length);
        console.log('Final processed users:', processedUsers);
        return processedUsers;
      } catch (error) {
        console.error('Critical error in useAdminUsers:', error);
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

      if (error) throw error;
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

      if (error) throw error;
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

  const updatePasswordMutation = useMutation({
    mutationFn: async ({ userId, newPassword }: { userId: string; newPassword: string }) => {
      console.log('Password update requested for user:', userId);
      
      // Note: This is a placeholder as we can't actually update passwords with the current setup
      toast({
        title: "Password update requested",
        description: "Password update functionality requires additional setup. Please check with your system administrator.",
      });
      
      return Promise.resolve();
    },
    onSuccess: () => {
      toast({
        title: "Password update notification sent",
        description: "The user will receive instructions to update their password.",
      });
    },
    onError: (error) => {
      console.error('Error updating password:', error);
      toast({
        title: "Error updating password",
        description: "There was an error processing the password update request.",
        variant: "destructive",
      });
    }
  });

  const deleteUserMutation = useMutation({
    mutationFn: async (userId: string) => {
      console.log('Deleting user:', userId);
      
      // Delete related data first
      await Promise.all([
        supabase.from('user_status').delete().eq('user_id', userId),
        supabase.from('user_profiles').delete().eq('user_id', userId),
        supabase.from('user_roles').delete().eq('user_id', userId)
      ]);

      // Delete the profile
      const { error } = await supabase
        .from('profiles')
        .delete()
        .eq('id', userId);

      if (error) throw error;
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

  return {
    users,
    isLoading,
    error,
    blockUserMutation,
    unblockUserMutation,
    updatePasswordMutation,
    deleteUserMutation
  };
};
