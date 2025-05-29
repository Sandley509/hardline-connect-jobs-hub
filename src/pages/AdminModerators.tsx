
import AdminLayout from "@/components/AdminLayout";
import { useAuth } from "@/contexts/AuthContext";
import { Card } from "@/components/ui/card";

const AdminModerators = () => {
  const { isAdmin, isModerator } = useAuth();

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">
            {isAdmin ? 'Moderator Management' : 'Moderator Information'}
          </h1>
        </div>

        {isAdmin ? (
          <>
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-blue-900 mb-3">Admin Notice</h3>
              <p className="text-gray-700 mb-4">
                Moderator creation has been moved to the Admin Dashboard for better security and control.
              </p>
              <p className="text-sm text-gray-600">
                You can create new moderators directly from the main Admin Dashboard page.
              </p>
            </Card>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-blue-900 mb-3">Moderator Permissions</h3>
              <ul className="text-sm text-blue-800 space-y-2">
                <li>• Manage orders and customer communications</li>
                <li>• Add and edit services & products</li>
                <li>• Manage job postings</li>
                <li>• Create and manage blog posts</li>
                <li>• Cannot access user management or system settings</li>
              </ul>
            </div>
          </>
        ) : isModerator ? (
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-orange-900 mb-3">Your Moderator Permissions</h3>
            <ul className="text-sm text-gray-700 space-y-2">
              <li>• Manage orders and customer communications</li>
              <li>• Add and edit services & products</li>
              <li>• Manage job postings</li>
              <li>• Create and manage blog posts</li>
              <li>• Cannot access user management or system settings</li>
            </ul>
            <p className="mt-4 text-sm text-gray-600">
              Only administrators can create new moderator accounts.
            </p>
          </Card>
        ) : (
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-red-900 mb-3">Access Denied</h3>
            <p className="text-gray-700">
              You don't have permission to access this page. This page is only available to administrators and moderators.
            </p>
          </Card>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminModerators;
