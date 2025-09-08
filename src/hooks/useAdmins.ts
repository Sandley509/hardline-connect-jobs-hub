
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useAdmins = (isAdmin: boolean) => {
  return useQuery({
    queryKey: ['admins'],
    queryFn: async () => {
      console.log('Fetching admins list...');
      
      // Simple query for admins
      const { data, error } = await supabase
        .from('admins')
        .select('user_id, created_at');

      if (error) {
        console.error('Error fetching admins:', error);
        throw error;
      }

      // Transform data to match expected structure
      const transformedData = (data || []).map(admin => ({
        ...admin,
        profiles: { username: 'Admin' }
      }));

      console.log('Admins fetched:', transformedData);
      return transformedData;
    },
    enabled: isAdmin
  });
};
