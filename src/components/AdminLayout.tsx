
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import {
  Shield,
  Users,
  Briefcase,
  Bell,
  Settings,
  LogOut,
  Menu,
  X,
  Home,
  BarChart3,
  Package,
  User,
  FileText,
  Wrench,
  UserPlus
} from "lucide-react";

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { user, logout, isAdmin, isModerator } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Define menu items based on user role
  const getMenuItems = () => {
    const baseItems = [
      { path: '/admin/dashboard', icon: BarChart3, label: 'Dashboard' },
    ];

    // Items available to both moderators and admins
    const moderatorItems = [
      { path: '/admin/orders', icon: Package, label: 'Order Management' },
      { path: '/admin/services', icon: Wrench, label: 'Services & Products' },
      { path: '/admin/jobs', icon: Briefcase, label: 'Job Management' },
      { path: '/admin/blog', icon: FileText, label: 'Blog Management' },
    ];

    // Items only available to admins
    const adminOnlyItems = [
      { path: '/admin/users', icon: User, label: 'User Management' },
      { path: '/admin/moderators', icon: UserPlus, label: 'Moderator Management' },
      { path: '/admin/notifications', icon: Bell, label: 'Notifications' },
    ];

    if (isAdmin) {
      return [...baseItems, ...moderatorItems, ...adminOnlyItems];
    } else if (isModerator) {
      return [...baseItems, ...moderatorItems];
    }

    return baseItems;
  };

  const menuItems = getMenuItems();

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0`}>
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
          <div className="flex items-center space-x-2">
            <Shield className="h-8 w-8 text-orange-600" />
            <span className="font-bold text-gray-900">
              {isAdmin ? 'Admin Panel' : 'Moderator Panel'}
            </span>
          </div>
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="lg:hidden p-2 rounded-md hover:bg-gray-100"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex flex-col h-full">
          <div className="flex-1 px-4 py-6 space-y-1">
            {menuItems.map((item) => {
              const isActive = location.pathname === item.path;
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsSidebarOpen(false)}
                  className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                    isActive
                      ? 'bg-orange-100 text-orange-700 border-r-2 border-orange-500'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                >
                  <Icon className="h-5 w-5 mr-3" />
                  {item.label}
                </Link>
              );
            })}

            <Link
              to="/dashboard"
              onClick={() => setIsSidebarOpen(false)}
              className="flex items-center px-4 py-3 text-sm font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900 rounded-lg transition-colors"
            >
              <Home className="h-5 w-5 mr-3" />
              Back to User Dashboard
            </Link>
          </div>

          {/* Admin/Moderator Info & Logout */}
          <div className="border-t border-gray-200 p-4 space-y-2">
            <div className="flex items-center px-4 py-2">
              <div className="flex-shrink-0">
                <div className="h-8 w-8 bg-orange-600 rounded-full flex items-center justify-center">
                  <Shield className="h-4 w-4 text-white" />
                </div>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-900">{user?.username}</p>
                <p className="text-xs text-orange-600 font-medium">
                  {isAdmin ? 'Administrator' : 'Moderator'}
                </p>
              </div>
            </div>
            <Button
              onClick={handleLogout}
              variant="ghost"
              className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <LogOut className="h-4 w-4 mr-3" />
              Logout
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 lg:ml-0">
        {/* Top Bar */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="flex items-center justify-between h-16 px-6">
            <div className="flex items-center">
              <button
                onClick={() => setIsSidebarOpen(true)}
                className="lg:hidden p-2 rounded-md hover:bg-gray-100"
              >
                <Menu className="h-5 w-5" />
              </button>
              <h1 className="ml-2 text-xl font-semibold text-gray-900 lg:ml-0">
                {isAdmin ? 'Admin Dashboard' : 'Moderator Dashboard'}
              </h1>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>

      {/* Overlay for mobile */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default AdminLayout;
