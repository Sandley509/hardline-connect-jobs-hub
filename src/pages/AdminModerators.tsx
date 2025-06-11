
import AdminLayout from "@/components/AdminLayout";
import { useAuth } from "@/contexts/AuthContext";
import { useAdmins } from "@/hooks/useAdmins";
import AccessDenied from "@/components/admin/AccessDenied";
import AdminOverviewCard from "@/components/admin/AdminOverviewCard";
import SystemInfoCard from "@/components/admin/SystemInfoCard";
import AdminsList from "@/components/admin/AdminsList";
import AdminPermissionsInfo from "@/components/admin/AdminPermissionsInfo";

const AdminModerators = () => {
  const { isAdmin } = useAuth();
  const { data: admins, isLoading: loadingAdmins } = useAdmins(isAdmin);

  if (!isAdmin) {
    return (
      <AdminLayout>
        <AccessDenied />
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">
            Administrator Management
          </h1>
        </div>

        {/* Admin Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <AdminOverviewCard 
            adminCount={admins?.length || 0} 
            isLoading={loadingAdmins} 
          />
          <SystemInfoCard />
        </div>

        {/* Admins List */}
        <AdminsList admins={admins} isLoading={loadingAdmins} />

        {/* Admin Permissions Info */}
        <AdminPermissionsInfo />
      </div>
    </AdminLayout>
  );
};

export default AdminModerators;
