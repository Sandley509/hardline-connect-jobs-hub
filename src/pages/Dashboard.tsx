import DashboardLayout from "@/components/DashboardLayout";
import AdminRedirect from "@/components/AdminRedirect";
import AdminSetup from "@/components/admin/AdminSetup";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import {
  ShoppingCart,
  Package,
  User,
  Settings,
  TrendingUp,
  DollarSign,
  Calendar,
  Star
} from "lucide-react";

const Dashboard = () => {
  const { user, isAdmin } = useAuth();
  const { items, getTotalPrice, getTotalItems } = useCart();
  const [orderCount, setOrderCount] = useState(0);
  const [totalSpent, setTotalSpent] = useState(0);
  const [memberSince, setMemberSince] = useState<string>("");

  // Show admin setup for your specific email
  const showAdminSetup = user?.email === 'estaliensandley14@gmail.com' && !isAdmin;

  useEffect(() => {
    const fetchUserData = async () => {
      if (!user) return;

      console.log('Fetching dashboard data for user:', user.id);

      // Fetch real order count and total spent
      const { data: orders, error } = await supabase
        .from('orders')
        .select('id, total_amount')
        .eq('user_id', user.id);
      
      if (error) {
        console.error('Error fetching orders for dashboard:', error);
      } else {
        console.log('Dashboard orders fetched:', orders);
        setOrderCount(orders?.length || 0);
        const total = orders?.reduce((sum, order) => sum + Number(order.total_amount), 0) || 0;
        setTotalSpent(total);
      }

      // Get member since date from auth user
      const { data: authData } = await supabase.auth.getUser();
      if (authData.user?.created_at) {
        const createdDate = new Date(authData.user.created_at);
        setMemberSince(createdDate.toLocaleDateString('en-US', { 
          year: 'numeric', 
          month: 'long' 
        }));
      }
    };

    fetchUserData();
  }, [user]);

  if (showAdminSetup) {
    return (
      <DashboardLayout>
        <AdminSetup />
      </DashboardLayout>
    );
  }

  const stats = [
    {
      title: "Cart Items",
      value: getTotalItems(),
      icon: ShoppingCart,
      color: "text-blue-600",
      bgColor: "bg-blue-100"
    },
    {
      title: "Cart Total",
      value: `$${getTotalPrice().toFixed(2)}`,
      icon: DollarSign,
      color: "text-green-600",
      bgColor: "bg-green-100"
    },
    {
      title: "Orders",
      value: orderCount.toString(),
      icon: Package,
      color: "text-orange-600",
      bgColor: "bg-orange-100"
    },
    {
      title: "Total Spent",
      value: `$${totalSpent.toFixed(2)}`,
      icon: Star,
      color: "text-purple-600",
      bgColor: "bg-purple-100"
    }
  ];

  const quickActions = [
    {
      title: "Edit Profile",
      description: "Update your personal information",
      icon: User,
      link: "/dashboard/profile",
      color: "text-blue-600"
    },
    {
      title: "View Orders",
      description: "Check your order history",
      icon: Package,
      link: "/dashboard/orders",
      color: "text-green-600"
    },
    {
      title: "Shop Now",
      description: "Browse our products",
      icon: ShoppingCart,
      link: "/shop",
      color: "text-orange-600"
    },
    {
      title: "Settings",
      description: "Manage your account settings",
      icon: Settings,
      link: "/dashboard/settings",
      color: "text-purple-600"
    }
  ];

  return (
    <>
      <AdminRedirect />
      <DashboardLayout>
        <div className="space-y-6">
          {/* Welcome Section */}
          <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg p-6 text-white">
            <h1 className="text-2xl font-bold mb-2">
              Welcome back, {user?.username}!
            </h1>
            <p className="text-orange-100">
              Manage your account and explore our services from your dashboard.
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, index) => {
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

          {/* Quick Actions */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {quickActions.map((action, index) => {
                const Icon = action.icon;
                return (
                  <Link
                    key={index}
                    to={action.link}
                    className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center mb-3">
                      <Icon className={`h-5 w-5 ${action.color} mr-2`} />
                      <h3 className="font-medium text-gray-900">{action.title}</h3>
                    </div>
                    <p className="text-sm text-gray-600">{action.description}</p>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Current Cart */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Current Cart</h3>
              {items.length > 0 ? (
                <div className="space-y-3">
                  {items.slice(0, 3).map((item) => (
                    <div key={item.id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
                      <div className="flex items-center">
                        <img 
                          src={item.image} 
                          alt={item.name}
                          className="h-10 w-10 object-cover rounded mr-3"
                        />
                        <div>
                          <p className="text-sm font-medium text-gray-900">{item.name}</p>
                          <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                        </div>
                      </div>
                      <p className="text-sm font-medium text-gray-900">
                        ${(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  ))}
                  {items.length > 3 && (
                    <p className="text-sm text-gray-500 text-center pt-2">
                      +{items.length - 3} more items
                    </p>
                  )}
                  <div className="pt-3 border-t border-gray-200">
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-gray-900">Total:</span>
                      <span className="font-bold text-lg text-orange-600">
                        ${getTotalPrice().toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <ShoppingCart className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-500">Your cart is empty</p>
                  <Link 
                    to="/shop" 
                    className="text-orange-600 hover:text-orange-500 text-sm font-medium"
                  >
                    Start shopping
                  </Link>
                </div>
              )}
            </Card>

            {/* Account Info */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Information</h3>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">Username</label>
                  <p className="text-gray-900">{user?.username}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Email</label>
                  <p className="text-gray-900">{user?.email}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Member Since</label>
                  <p className="text-gray-900">{memberSince || 'Loading...'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Total Orders</label>
                  <p className="text-gray-900">{orderCount}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Total Spent</label>
                  <p className="text-gray-900">${totalSpent.toFixed(2)}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Account Status</label>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Active
                  </span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </DashboardLayout>
    </>
  );
};

export default Dashboard;
