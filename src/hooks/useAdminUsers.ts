
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
      console.log('Fetching users for admin...');
      
      // Get all profiles first
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (profilesError) {
        console.error('Error fetching profiles:', profilesError);
        throw profilesError;
      }

      console.log('Total profiles found:', profiles?.length || 0);

      if (!profiles || profiles.length === 0) {
        return [];
      }

      // Get additional data
      const [userStatusResponse, userProfilesResponse, ordersResponse, userRolesResponse] = await Promise.all([
        supabase.from('user_status').select('*'),
        supabase.from('user_profiles').select('*'),
        supabase.from('orders').select('user_id, total_amount'),
        supabase.from('user_roles').select('user_id, role')
      ]);

      const userStatuses = userStatusResponse.data || [];
      const userProfiles = userProfilesResponse.data || [];
      const allOrders = ordersResponse.data || [];
      const userRoles = userRolesResponse.data || [];

      // Process users and filter out admins
      const processedUsers: UserProfile[] = profiles
        .map((profile) => {
          const status = userStatuses.find(s => s.user_id === profile.id);
          const userProfile = userProfiles.find(up => up.user_id === profile.id);
          const userOrders = allOrders.filter(order => order.user_id === profile.id);
          const roles = userRoles.filter(role => role.user_id === profile.id);
          
          const isAdmin = roles.some(role => role.role === 'admin');
          const orderCount = userOrders.length;
          const totalSpent = userOrders.reduce((sum, order) => {
            const amount = parseFloat(order.total_amount?.toString() || '0');
            return sum + (isNaN(amount) ? 0 : amount);
          }, 0);

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
            total_spent: totalSpent,
            is_admin: isAdmin
          };
        })
        .filter(user => !user.is_admin); // Filter out admin users

      console.log('Processed non-admin users:', processedUsers.length);
      return processedUsers;
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
      console.log('Updating password for user:', userId);
      
      // Use Supabase Admin API to update user password
      const { error } = await supabase.auth.admin.updateUserById(userId, {
        password: newPassword
      });

      if (error) throw error;
    },
    onSuccess: () => {
      toast({
        title: "Password updated successfully",
        description: "The user's password has been updated.",
      });
    },
    onError: (error) => {
      console.error('Error updating password:', error);
      toast({
        title: "Error updating password",
        description: "There was an error updating the user's password. Please try again.",
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
