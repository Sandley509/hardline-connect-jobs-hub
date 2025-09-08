
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useAdmins = (isAdmin: boolean) => {
  return useQuery({
    queryKey: ['admins'],
    queryFn: async () => {
      console.log('Fetching admins list...');
      
      // Get admins list
      const { data: adminsData, error: adminsError } = await supabase
        .from('admins')
        .select('user_id, created_at');

      if (adminsError) {
        console.error('Error fetching admins:', adminsError);
        throw adminsError;
      }

      if (!adminsData || adminsData.length === 0) {
        return [];
      }

      // Get profile information for admin users
      const userIds = adminsData.map(admin => admin.user_id);
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('id, username')
        .in('id', userIds);

      if (profilesError) {
        console.error('Error fetching profiles:', profilesError);
        throw profilesError;
      }

      // Combine the data
      const combinedData = adminsData.map(admin => {
        const profile = profilesData?.find(p => p.id === admin.user_id);
        return {
          user_id: admin.user_id,
          created_at: admin.created_at,
          profiles: profile ? { username: profile.username } : { username: 'Unknown User' }
        };
      });

      console.log('Admins fetched:', combinedData);
      return combinedData;
    },
    enabled: isAdmin
  });
};
