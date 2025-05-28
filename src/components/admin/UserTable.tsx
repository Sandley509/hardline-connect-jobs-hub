
import UserTableRow from './UserTableRow';

interface UserProfile {
  id: string;
  username: string;
  email: string;
  created_at: string;
  is_blocked?: boolean;
  blocked_reason?: string;
  order_count?: number;
  total_spent?: number;
}

interface UserTableProps {
  users: UserProfile[];
  onBlockUser: (userId: string) => void;
  onUnblockUser: (userId: string) => void;
  onUpdatePassword: (userId: string, username: string) => void;
  onDeleteUser: (userId: string, username: string) => void;
  isBlocking: boolean;
  isUnblocking: boolean;
  isUpdatingPassword: boolean;
  isDeleting: boolean;
}

const UserTable = ({
  users,
  onBlockUser,
  onUnblockUser,
  onUpdatePassword,
  onDeleteUser,
  isBlocking,
  isUnblocking,
  isUpdatingPassword,
  isDeleting
}: UserTableProps) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-200">
            <th className="text-left py-3 px-4 font-medium text-gray-900">User</th>
            <th className="text-left py-3 px-4 font-medium text-gray-900">Email</th>
            <th className="text-left py-3 px-4 font-medium text-gray-900">Orders</th>
            <th className="text-left py-3 px-4 font-medium text-gray-900">Total Spent</th>
            <th className="text-left py-3 px-4 font-medium text-gray-900">Joined</th>
            <th className="text-left py-3 px-4 font-medium text-gray-900">Status</th>
            <th className="text-left py-3 px-4 font-medium text-gray-900">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <UserTableRow
              key={user.id}
              user={user}
              onBlockUser={onBlockUser}
              onUnblockUser={onUnblockUser}
              onUpdatePassword={onUpdatePassword}
              onDeleteUser={onDeleteUser}
              isBlocking={isBlocking}
              isUnblocking={isUnblocking}
              isUpdatingPassword={isUpdatingPassword}
              isDeleting={isDeleting}
            />
          ))}
        </tbody>
      </table>

      {users.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500">No non-admin users found. Users will appear here once they sign up and create profiles.</p>
        </div>
      )}
    </div>
  );
};

export default UserTable;
