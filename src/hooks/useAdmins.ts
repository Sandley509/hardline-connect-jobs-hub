
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useAdmins = (isAdmin: boolean) => {
  return useQuery({
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
};
