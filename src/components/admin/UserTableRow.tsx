
import { Button } from "@/components/ui/button";
import { Ban, CheckCircle, AlertTriangle, Package, Key } from "lucide-react";

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

interface UserTableRowProps {
  user: UserProfile;
  onBlockUser: (userId: string) => void;
  onUnblockUser: (userId: string) => void;
  onUpdatePassword: (userId: string, username: string) => void;
  onDeleteUser: (userId: string, username: string) => void;
  isBlocking: boolean;
  isUnblocking: boolean;
  isUpdatingPassword: boolean;
  isDeleting: boolean;
}

const UserTableRow = ({
  user,
  onBlockUser,
  onUnblockUser,
  onUpdatePassword,
  onDeleteUser,
  isBlocking,
  isUnblocking,
  isUpdatingPassword,
  isDeleting
}: UserTableRowProps) => {
  return (
    <tr className="border-b border-gray-100 hover:bg-gray-50">
      <td className="py-3 px-4">
        <div className="flex items-center">
          <div className="h-8 w-8 bg-orange-600 rounded-full flex items-center justify-center mr-3">
            <span className="text-white text-sm font-medium">
              {user.username?.charAt(0).toUpperCase() || 'U'}
            </span>
          </div>
          <span className="font-medium text-gray-900">{user.username}</span>
        </div>
      </td>
      <td className="py-3 px-4 text-gray-600">{user.email}</td>
      <td className="py-3 px-4">
        <div className="flex items-center">
          <Package className="h-4 w-4 text-gray-400 mr-1" />
          <span className="text-gray-900">{user.order_count}</span>
        </div>
      </td>
      <td className="py-3 px-4">
        <span className="font-medium text-gray-900">
          ${user.total_spent?.toFixed(2) || '0.00'}
        </span>
      </td>
      <td className="py-3 px-4 text-gray-600">
        {new Date(user.created_at).toLocaleDateString()}
      </td>
      <td className="py-3 px-4">
        {user.is_blocked ? (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
            <AlertTriangle className="h-3 w-3 mr-1" />
            Blocked
          </span>
        ) : (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <CheckCircle className="h-3 w-3 mr-1" />
            Active
          </span>
        )}
      </td>
      <td className="py-3 px-4">
        <div className="flex space-x-2 flex-wrap gap-1">
          {user.is_blocked ? (
            <Button
              size="sm"
              variant="outline"
              onClick={() => onUnblockUser(user.id)}
              disabled={isUnblocking}
            >
              <CheckCircle className="h-4 w-4 mr-1" />
              Unblock
            </Button>
          ) : (
            <Button
              size="sm"
              variant="destructive"
              onClick={() => onBlockUser(user.id)}
              disabled={isBlocking}
            >
              <Ban className="h-4 w-4 mr-1" />
              Block
            </Button>
          )}
          <Button
            size="sm"
            variant="outline"
            onClick={() => onUpdatePassword(user.id, user.username)}
            disabled={isUpdatingPassword}
          >
            <Key className="h-4 w-4 mr-1" />
            Password
          </Button>
          <Button
            size="sm"
            variant="destructive"
            onClick={() => onDeleteUser(user.id, user.username)}
            disabled={isDeleting}
          >
            Delete
          </Button>
        </div>
      </td>
    </tr>
  );
};

export default UserTableRow;
