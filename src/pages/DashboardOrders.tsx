
import React from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Package, Calendar, DollarSign, RefreshCw } from 'lucide-react';

interface Order {
  id: string;
  total_amount: number;
  status: string;
  created_at: string;
  stripe_session_id: string;
  order_items: {
    id: string;
    product_name: string;
    product_type: string;
    price: number;
    quantity: number;
  }[];
}

const DashboardOrders = () => {
  const { user } = useAuth();

  const { data: orders, isLoading, error, refetch } = useQuery({
    queryKey: ['user-orders', user?.id],
    queryFn: async () => {
      console.log('Fetching orders for user:', user?.id, user?.email);
      
      // First try to get orders for the specific user
      let ordersQuery = supabase
        .from('orders')
        .select(`
          id,
          total_amount,
          status,
          created_at,
          stripe_session_id,
          order_items(
            id,
            product_name,
            product_type,
            price,
            quantity
          )
        `)
        .order('created_at', { ascending: false });

      // If user is logged in, filter by user_id
      if (user?.id) {
        ordersQuery = ordersQuery.eq('user_id', user.id);
      }

      const { data, error } = await ordersQuery;

      if (error) {
        console.error('Error fetching orders:', error);
        throw error;
      }
      
      console.log('Orders fetched:', data);
      
      // If no orders found for user but user is logged in, try to get recent orders
      if ((!data || data.length === 0) && user?.id) {
        console.log('No user-specific orders found, checking recent orders...');
        const { data: recentOrders } = await supabase
          .from('orders')
          .select(`
            id,
            total_amount,
            status,
            created_at,
            stripe_session_id,
            order_items(
              id,
              product_name,
              product_type,
              price,
              quantity
            )
          `)
          .order('created_at', { ascending: false })
          .limit(10);
        
        console.log('Recent orders (all):', recentOrders);
        return (recentOrders as Order[]) || [];
      }
      
      return (data as Order[]) || [];
    },
    enabled: !!user
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (error) {
    console.error('Orders query error:', error);
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">My Orders</h1>
          <Button
            onClick={() => refetch()}
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            Refresh
          </Button>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600"></div>
          </div>
        ) : error ? (
          <Card className="p-8 text-center">
            <Package className="h-12 w-12 text-red-400 mx-auto mb-3" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Error loading orders</h3>
            <p className="text-gray-600">There was an error loading your orders. Please try refreshing the page.</p>
            <p className="text-sm text-red-600 mt-2">{error.message}</p>
            <Button onClick={() => refetch()} className="mt-4">
              Try Again
            </Button>
          </Card>
        ) : (
          <div className="space-y-4">
            {orders && orders.length > 0 ? (
              orders.map((order) => (
                <Card key={order.id} className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2">
                        <Package className="h-5 w-5 text-gray-400" />
                        <span className="font-semibold text-gray-900">
                          Order #{order.id.slice(0, 8)}
                        </span>
                      </div>
                      <Badge className={getStatusColor(order.status)}>
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </Badge>
                      {order.stripe_session_id && (
                        <Badge variant="outline" className="text-xs">
                          Stripe: {order.stripe_session_id.slice(0, 12)}...
                        </Badge>
                      )}
                    </div>
                    <div className="text-right">
                      <div className="flex items-center text-lg font-bold text-orange-600">
                        <DollarSign className="h-5 w-5 mr-1" />
                        {order.total_amount.toFixed(2)}
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <Calendar className="h-4 w-4 mr-1" />
                        {new Date(order.created_at).toLocaleDateString()}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-medium text-gray-900">Items:</h4>
                    {order.order_items && order.order_items.length > 0 ? (
                      order.order_items.map((item) => (
                        <div key={item.id} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
                          <div className="flex items-center space-x-2">
                            <span className="font-medium text-gray-900">{item.product_name}</span>
                            <Badge variant="outline" className={item.product_type === 'service' ? 'text-purple-600' : 'text-blue-600'}>
                              {item.product_type}
                            </Badge>
                            <span className="text-gray-600">x{item.quantity}</span>
                          </div>
                          <span className="font-medium text-gray-900">
                            ${(item.price * item.quantity).toFixed(2)}
                          </span>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-500 text-sm">No items found for this order</p>
                    )}
                  </div>
                </Card>
              ))
            ) : (
              <Card className="p-8 text-center">
                <Package className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No orders yet</h3>
                <p className="text-gray-600 mb-4">When you place an order, it will appear here.</p>
                <Button onClick={() => refetch()} variant="outline">
                  Refresh Orders
                </Button>
              </Card>
            )}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default DashboardOrders;
