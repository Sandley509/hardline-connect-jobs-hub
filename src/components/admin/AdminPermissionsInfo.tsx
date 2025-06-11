
import { Card } from "@/components/ui/card";

const AdminPermissionsInfo = () => {
  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold text-blue-900 mb-3">Administrator Permissions</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <h4 className="font-medium text-gray-900 mb-2">✅ Administrator Capabilities:</h4>
          <ul className="text-sm text-gray-700 space-y-1">
            <li>• Full user management access</li>
            <li>• Manage orders and customer communications</li>
            <li>• Add and edit services & products</li>
            <li>• Manage job postings and blog posts</li>
            <li>• Access all admin features</li>
            <li>• System configuration and settings</li>
          </ul>
        </div>
        <div>
          <h4 className="font-medium text-gray-900 mb-2">ℹ️ System Notes:</h4>
          <ul className="text-sm text-gray-700 space-y-1">
            <li>• Moderator system has been removed</li>
            <li>• Simplified admin-only role structure</li>
            <li>• Better database performance</li>
            <li>• Reduced complexity</li>
            <li>• Contact developer to add new admins</li>
          </ul>
        </div>
      </div>
    </Card>
  );
};

export default AdminPermissionsInfo;
