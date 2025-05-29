
import AdminLayout from "@/components/AdminLayout";
import { Card } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useState, useEffect } from "react";
import { Users, Briefcase, Bell, Shield, Package } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import ActiveUsersList from "@/components/admin/ActiveUsersList";
import ProductManager from "@/components/admin/ProductManager";
import CreateModeratorForm from "@/components/admin/CreateModeratorForm";

const AdminDashboard = () => {
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const { toast } = useToast();
  const { isAdmin } = useAuth();

  const { data: stats } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: async () => {
      // Get non-admin users count by checking user_roles table
      const { data: adminUsers } = await supabase
        .from('user_roles')
        .select('user_id')
        .eq('role', 'admin');

      const adminUserIds = adminUsers?.map(u => u.user_id) || [];

      // Get total users excluding admins
      let usersQuery = supabase.from('profiles').select('id', { count: 'exact' });
      if (adminUserIds.length > 0) {
        usersQuery = usersQuery.not('id', 'in', `(${adminUserIds.join(',')})`);
      }
      const usersResult = await usersQuery;

      const [jobsResult, notificationsResult, ordersResult] = await Promise.all([
        supabase.from('jobs').select('id', { count: 'exact' }),
        supabase.from('notifications').select('id', { count: 'exact' }),
        supabase.from('orders').select('id', { count: 'exact' })
      ]);

      return {
        totalUsers: usersResult.count || 0,
        totalJobs: jobsResult.count || 0,
        totalNotifications: notificationsResult.count || 0,
        totalOrders: ordersResult.count || 0
      };
    }
  });

  // Fetch recent orders
  const { data: orders } = useQuery({
    queryKey: ['recent-orders'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          id,
          total_amount,
          status,
          created_at,
          profiles(username)
        `)
        .order('created_at', { ascending: false })
        .limit(5);

      if (error) throw error;
      return data || [];
    }
  });

  // Real-time order updates
  useEffect(() => {
    const channel = supabase
      .channel('admin-dashboard')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'orders'
        },
        (payload) => {
          console.log('New order notification:', payload);
          toast({
            title: "🎉 New Order!",
            description: `Order #${payload.new.id.slice(0, 8)} - $${payload.new.total_amount}`,
          });
          
          // Add to recent orders
          setRecentOrders(prev => [payload.new, ...prev.slice(0, 4)]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [toast]);

  useEffect(() => {
    if (orders) {
      setRecentOrders(orders);
    }
  }, [orders]);

  const adminStats = [
    {
      title: "Total Customers",
      value: stats?.totalUsers || 0,
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-100"
    },
    {
      title: "Total Orders",
      value: stats?.totalOrders || 0,
      icon: Package,
      color: "text-green-600",
      bgColor: "bg-green-100"
    },
    {
      title: "Active Jobs",
      value: stats?.totalJobs || 0,
      icon: Briefcase,
      color: "text-orange-600",
      bgColor: "bg-orange-100"
    },
    {
      title: "Notifications",
      value: stats?.totalNotifications || 0,
      icon: Bell,
      color: "text-purple-600",
      bgColor: "bg-purple-100"
    }
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-orange-500 to-red-600 rounded-lg p-6 text-white">
          <h1 className="text-2xl font-bold mb-2">
            Admin Dashboard
          </h1>
          <p className="text-orange-100">
            Manage users, orders, jobs, and notifications from this central panel.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {adminStats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={index} className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  </div>
                  <div className={`p-3 rounded-full ${stat.bgColor}`}>
                    <Icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Admin-only Moderator Creation */}
        {isAdmin && (
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
        )}

        {/* Product Management Section */}
        <ProductManager />

        {/* Dashboard Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Recent Orders */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Orders</h3>
            <div className="space-y-3">
              {recentOrders.slice(0, 5).map((order) => (
                <div key={order.id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
                  <div>
                    <span className="text-sm font-medium text-gray-900">
                      #{order.id?.slice(0, 8) || 'Unknown'}
                    </span>
                    <p className="text-xs text-gray-500">
                      {order.profiles?.username || 'Unknown Customer'}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-medium text-green-600">
                      ${order.total_amount}
                    </span>
                    <p className="text-xs text-gray-400">
                      {order.created_at ? new Date(order.created_at).toLocaleDateString() : 'Unknown'}
                    </p>
                  </div>
                </div>
              ))}
              {recentOrders.length === 0 && (
                <p className="text-sm text-gray-500 text-center py-4">No recent orders</p>
              )}
            </div>
          </Card>

          {/* Active Users */}
          <ActiveUsersList />

          {/* System Status */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">System Status</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Database</span>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  Online
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Authentication</span>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  Active
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Real-time Updates</span>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  Working
                </span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
