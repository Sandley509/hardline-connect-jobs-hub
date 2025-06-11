
import { Card } from "@/components/ui/card";
import { Shield } from "lucide-react";

interface Admin {
  user_id: string;
  created_at: string;
  profiles?: {
    username: string;
  };
}

interface AdminsListProps {
  admins: Admin[] | undefined;
  isLoading: boolean;
}

const AdminsList = ({ admins, isLoading }: AdminsListProps) => {
  return (
    <Card className="p-6">
      <div className="flex items-center mb-4">
        <Shield className="h-6 w-6 text-orange-600 mr-3" />
        <h2 className="text-xl font-semibold text-gray-900">Current Administrators</h2>
      </div>
      
      {isLoading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600 mx-auto"></div>
          <p className="text-gray-500 mt-2">Loading administrators...</p>
        </div>
      ) : admins && admins.length > 0 ? (
        <div className="space-y-3">
          {admins.map((admin: Admin) => (
            <div key={admin.user_id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center">
                <div className="h-10 w-10 bg-orange-100 rounded-full flex items-center justify-center mr-3">
                  <Shield className="h-5 w-5 text-orange-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">{admin.profiles?.username || 'Unknown User'}</p>
                  <p className="text-sm text-gray-500">
                    Admin since: {new Date(admin.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                Administrator
              </span>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <Shield className="h-12 w-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-500">No administrators found</p>
          <p className="text-sm text-gray-400">Contact system administrator to add admin users</p>
        </div>
      )}
    </Card>
  );
};

export default AdminsList;
