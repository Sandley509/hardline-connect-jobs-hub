
import AdminLayout from "@/components/AdminLayout";
import CreateModeratorForm from "@/components/admin/CreateModeratorForm";

const AdminModerators = () => {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Moderator Management</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <CreateModeratorForm />
          
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
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminModerators;
