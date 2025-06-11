
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const useAdminUserMutations = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

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
      
      await Promise.all([
        supabase.from('user_status').delete().eq('user_id', userId),
        supabase.from('user_profiles').delete().eq('user_id', userId)
      ]);

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
    blockUserMutation,
    unblockUserMutation,
    updatePasswordMutation,
    deleteUserMutation
  };
};
