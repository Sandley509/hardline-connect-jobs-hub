import AdminLayout from "@/components/AdminLayout";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useState, useEffect } from "react";
import { Bell } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import ChatModal from "@/components/ChatModal";
import OrderStatistics from "@/components/admin/OrderStatistics";
import OrderList from "@/components/admin/OrderList";
import CustomerDetailsModal from "@/components/admin/CustomerDetailsModal";

interface Order {
  order_id: string;
  user_id: string;
  username: string;
  user_email: string;
  user_phone: string | null;
  user_address: string | null;
  user_city: string | null;
  user_country: string | null;
  first_name: string | null;
  last_name: string | null;
  total_amount: number;
  status: string;
  created_at: string;
  stripe_session_id: string | null;
  items: any[];
}

const AdminOrders = () => {
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showChat, setShowChat] = useState(false);
  const [showCustomerDetails, setShowCustomerDetails] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: orders, isLoading } = useQuery({
    queryKey: ['admin-orders'],
    queryFn: async () => {
      // First get orders with order items
      const { data: ordersData, error: ordersError } = await supabase
        .from('orders')
        .select(`
          id,
          user_id,
          total_amount,
          status,
          created_at,
          stripe_session_id,
          order_items(*)
        `)
        .order('created_at', { ascending: false });

      if (ordersError) throw ordersError;

      // Then get user profiles and user_profiles for each order
      const ordersWithProfiles = await Promise.all(
        (ordersData || []).map(async (order) => {
          // Get basic profile
          const { data: profile } = await supabase
            .from('profiles')
            .select('username')
            .eq('id', order.user_id)
            .single();

          // Get detailed user profile
          const { data: userProfile } = await supabase
            .from('user_profiles')
            .select('first_name, last_name, phone, address, city, country')
            .eq('user_id', order.user_id)
            .single();

          // Get user email from auth metadata (we'll need to get this via a different approach)
          // For now, we'll fetch it using a direct query if possible
          let userEmail = 'N/A';
          try {
            const { data: userData } = await supabase.auth.admin.getUserById(order.user_id);
            userEmail = userData.user?.email || 'N/A';
          } catch (error) {
            console.log('Could not fetch user email:', error);
          }

          return {
            order_id: order.id,
            user_id: order.user_id,
            username: profile?.username || 'Unknown',
            user_email: userEmail,
            user_phone: userProfile?.phone || null,
            user_address: userProfile?.address || null,
            user_city: userProfile?.city || null,
            user_country: userProfile?.country || null,
            first_name: userProfile?.first_name || null,
            last_name: userProfile?.last_name || null,
            total_amount: order.total_amount,
            status: order.status,
            created_at: order.created_at,
            stripe_session_id: order.stripe_session_id,
            items: order.order_items || []
          };
        })
      );

      return ordersWithProfiles;
    }
  });

  // Real-time order updates
  useEffect(() => {
    const channel = supabase
      .channel('admin-orders')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'orders'
        },
        (payload) => {
          console.log('New order received:', payload);
          toast({
            title: "New Order Received!",
            description: `Order #${payload.new.id.slice(0, 8)} - $${payload.new.total_amount}`,
          });
          queryClient.invalidateQueries({ queryKey: ['admin-orders'] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [toast, queryClient]);

  const updateOrderStatus = useMutation({
    mutationFn: async ({ orderId, status }: { orderId: string; status: string }) => {
      const { error } = await supabase
        .from('orders')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', orderId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-orders'] });
      toast({
        title: "Order updated successfully",
        description: "The order status has been updated.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error updating order",
        description: "There was an error updating the order status.",
        variant: "destructive",
      });
    }
  });

  const deleteOrder = useMutation({
    mutationFn: async (orderId: string) => {
      // First delete order items
      const { error: itemsError } = await supabase
        .from('order_items')
        .delete()
        .eq('order_id', orderId);

      if (itemsError) throw itemsError;

      // Then delete the order
      const { error: orderError } = await supabase
        .from('orders')
        .delete()
        .eq('id', orderId);

      if (orderError) throw orderError;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-orders'] });
      toast({
        title: "Order deleted successfully",
        description: "The order has been permanently deleted.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error deleting order",
        description: "There was an error deleting the order.",
        variant: "destructive",
      });
    }
  });

  const handleViewCustomer = (order: Order) => {
    setSelectedOrder(order);
    setShowCustomerDetails(true);
  };

  const handleDeleteOrder = (orderId: string) => {
    deleteOrder.mutate(orderId);
  };

  const handleChatClick = (order: Order) => {
    setSelectedOrder(order);
    setShowChat(true);
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Order Management</h1>
          <div className="flex items-center space-x-2">
            <Bell className="h-5 w-5 text-orange-600" />
            <span className="text-sm text-gray-600">Real-time updates enabled</span>
          </div>
        </div>

        <OrderStatistics orders={orders} />

        <OrderList
          orders={orders}
          isLoading={isLoading}
          updateOrderStatus={updateOrderStatus}
          onViewCustomer={handleViewCustomer}
          onDeleteOrder={handleDeleteOrder}
          onChatClick={handleChatClick}
        />
      </div>

      <CustomerDetailsModal
        isOpen={showCustomerDetails}
        onClose={() => setShowCustomerDetails(false)}
        order={selectedOrder}
      />

      {showChat && selectedOrder && (
        <ChatModal
          order={selectedOrder}
          isOpen={showChat}
          onClose={() => {
            setShowChat(false);
            setSelectedOrder(null);
          }}
        />
      )}
    </AdminLayout>
  );
};

export default AdminOrders;
