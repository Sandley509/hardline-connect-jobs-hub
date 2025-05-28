
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { User } from "lucide-react";

interface ActiveUser {
  id: string;
  username: string;
  email: string;
  created_at: string;
  is_blocked?: boolean;
}

const ActiveUsersList = () => {
  const { data: activeUsers, isLoading } = useQuery({
    queryKey: ['active-users'],
    queryFn: async () => {
      console.log('Fetching active users...');
      
      // Get all profiles first
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);

      if (profilesError) {
        console.error('Error fetching profiles:', profilesError);
        throw profilesError;
      }

      if (!profiles || profiles.length === 0) {
        return [];
      }

      // Get user status to check if they're blocked
      const { data: userStatuses } = await supabase
        .from('user_status')
        .select('*');

      const { data: userProfiles } = await supabase
        .from('user_profiles')
        .select('*');

      // Process users
      const processedUsers: ActiveUser[] = profiles.map((profile) => {
        const status = userStatuses?.find(s => s.user_id === profile.id);
        const userProfile = userProfiles?.find(up => up.user_id === profile.id);
        
        let email = `${profile.username || 'user'}@example.com`;
        if (userProfile?.first_name && userProfile?.last_name) {
          email = `${userProfile.first_name.toLowerCase()}.${userProfile.last_name.toLowerCase()}@example.com`;
        }

        return {
          id: profile.id,
          username: profile.username || 'Unknown User',
          email,
          created_at: profile.created_at,
          is_blocked: status?.is_blocked || false
        };
      });

      console.log('Active users found:', processedUsers.length);
      return processedUsers;
    }
  });

  if (isLoading) {
    return (
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Active Users</h3>
        <div className="flex justify-center py-4">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-orange-600"></div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Active Users</h3>
      <div className="space-y-3">
        {activeUsers && activeUsers.length > 0 ? (
          activeUsers.map((user) => (
            <div key={user.id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
              <div className="flex items-center">
                <div className="h-8 w-8 bg-orange-600 rounded-full flex items-center justify-center mr-3">
                  <User className="h-4 w-4 text-white" />
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-900">
                    {user.username}
                  </span>
                  <p className="text-xs text-gray-500">
                    {user.email}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                  user.is_blocked 
                    ? 'bg-red-100 text-red-800' 
                    : 'bg-green-100 text-green-800'
                }`}>
                  {user.is_blocked ? 'Blocked' : 'Active'}
                </span>
                <p className="text-xs text-gray-400 mt-1">
                  {new Date(user.created_at).toLocaleDateString()}
                </p>
              </div>
            </div>
          ))
        ) : (
          <p className="text-sm text-gray-500 text-center py-4">No users found</p>
        )}
      </div>
    </Card>
  );
};

export default ActiveUsersList;
