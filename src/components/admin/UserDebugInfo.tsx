
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";

const UserDebugInfo = () => {
  const { data: debugData } = useQuery({
    queryKey: ['debug-user-data'],
    queryFn: async () => {
      const [profilesRes, adminsRes, authUserRes] = await Promise.all([
        supabase.from('profiles').select('*'),
        supabase.from('admins').select('*'),
        supabase.auth.getUser()
      ]);

      return {
        profiles: profilesRes.data || [],
        admins: adminsRes.data || [],
        currentUser: authUserRes.data.user,
        profilesError: profilesRes.error,
        adminsError: adminsRes.error
      };
    }
  });

  return (
    <Card className="p-4 mt-4 bg-gray-50">
      <h4 className="font-semibold mb-2">Debug Information</h4>
      <div className="text-sm space-y-2">
        <div>
          <strong>Total Profiles:</strong> {debugData?.profiles.length || 0}
        </div>
        <div>
          <strong>Total Admins:</strong> {debugData?.admins.length || 0}
        </div>
        <div>
          <strong>Current User ID:</strong> {debugData?.currentUser?.id || 'None'}
        </div>
        {debugData?.profilesError && (
          <div className="text-red-600">
            <strong>Profiles Error:</strong> {debugData.profilesError.message}
          </div>
        )}
        {debugData?.adminsError && (
          <div className="text-red-600">
            <strong>Admins Error:</strong> {debugData.adminsError.message}
          </div>
        )}
        <details className="mt-2">
          <summary className="cursor-pointer font-medium">Raw Data</summary>
          <pre className="mt-2 p-2 bg-white rounded text-xs overflow-auto max-h-40">
            {JSON.stringify(debugData, null, 2)}
          </pre>
        </details>
      </div>
    </Card>
  );
};

export default UserDebugInfo;
