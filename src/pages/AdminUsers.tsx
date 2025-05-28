
import AdminLayout from "@/components/AdminLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Search } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import UserTable from "@/components/admin/UserTable";
import { useAdminUsers } from "@/hooks/useAdminUsers";

const AdminUsers = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const queryClient = useQueryClient();
  
  const {
    users,
    isLoading,
    error,
    blockUserMutation,
    unblockUserMutation,
    deleteUserMutation
  } = useAdminUsers();

  const filteredUsers = users?.filter(user =>
    user.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleBlockUser = (userId: string) => {
    const reason = prompt("Enter reason for blocking this user:");
    if (reason) {
      blockUserMutation.mutate({ userId, reason });
    }
  };

  const handleDeleteUser = (userId: string, username: string) => {
    const confirmed = confirm(`Are you sure you want to delete user "${username}"? This action cannot be undone.`);
    if (confirmed) {
      deleteUserMutation.mutate(userId);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-64"
              />
            </div>
          </div>
        </div>

        <Card className="p-6">
          {isLoading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600"></div>
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <p className="text-red-600">Error loading users: {error.message}</p>
              <Button 
                onClick={() => queryClient.invalidateQueries({ queryKey: ['admin-users'] })}
                className="mt-4"
              >
                Retry
              </Button>
            </div>
          ) : (
            <UserTable
              users={filteredUsers || []}
              onBlockUser={handleBlockUser}
              onUnblockUser={(userId) => unblockUserMutation.mutate(userId)}
              onDeleteUser={handleDeleteUser}
              isBlocking={blockUserMutation.isPending}
              isUnblocking={unblockUserMutation.isPending}
              isDeleting={deleteUserMutation.isPending}
            />
          )}
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminUsers;
