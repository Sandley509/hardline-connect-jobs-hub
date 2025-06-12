
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useAdmins = (isAdmin: boolean) => {
  return useQuery({
    queryKey: ['admins'],
    queryFn: async () => {
      console.log('Fetching admins list...');
      
      // Get users with admin role from admins table
      const { data, error } = await supabase
        .from('admins')
        .select(`
          user_id,
          created_at,
          profiles!user_id(username)
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
};
