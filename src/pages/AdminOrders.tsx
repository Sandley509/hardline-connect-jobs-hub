
import AdminLayout from "@/components/AdminLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useState, useEffect } from "react";
import { Package, User, MessageCircle, Bell, Trash2, Eye, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import ChatModal from "@/components/ChatModal";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

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

  const hasServices = (items: any[]) => {
    return items.some(item => item.product_type === 'service');
  };

  const handleViewCustomer = (order: Order) => {
    setSelectedOrder(order);
    setShowCustomerDetails(true);
  };

  const handleDeleteOrder = (orderId: string) => {
    if (window.confirm('Are you sure you want to delete this order? This action cannot be undone.')) {
      deleteOrder.mutate(orderId);
    }
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

        {/* Order Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">{orders?.length || 0}</div>
              <div className="text-sm text-gray-600">Total Orders</div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">
                {orders?.filter(o => o.status === 'pending').length || 0}
              </div>
              <div className="text-sm text-gray-600">Pending</div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {orders?.filter(o => o.status === 'processing').length || 0}
              </div>
              <div className="text-sm text-gray-600">Processing</div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {orders?.filter(o => o.status === 'completed').length || 0}
              </div>
              <div className="text-sm text-gray-600">Completed</div>
            </div>
          </Card>
        </div>

        {/* Orders List */}
        <Card className="p-6">
          {isLoading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600"></div>
            </div>
          ) : (
            <div className="space-y-4">
              {orders?.map((order) => (
                <div key={order.order_id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2">
                        <Package className="h-5 w-5 text-gray-400" />
                        <span className="font-semibold text-gray-900">
                          #{order.order_id.slice(0, 8)}
                        </span>
                      </div>
                      <Badge className={getStatusColor(order.status)}>
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </Badge>
                      <span className="text-sm text-gray-600">
                        Customer: {order.username}
                      </span>
                      {order.stripe_session_id && (
                        <Badge variant="outline" className="text-xs">
                          Stripe: {order.stripe_session_id.slice(0, 12)}...
                        </Badge>
                      )}
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-orange-600">
                        ${order.total_amount.toFixed(2)}
                      </div>
                      <div className="text-sm text-gray-600">
                        {new Date(order.created_at).toLocaleDateString()}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2 mb-4">
                    {order.items.map((item: any, index: number) => (
                      <div key={index} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
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
                    ))}
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex space-x-2">
                      <select
                        value={order.status}
                        onChange={(e) => updateOrderStatus.mutate({ 
                          orderId: order.order_id, 
                          status: e.target.value 
                        })}
                        className="border border-gray-300 rounded px-3 py-1 text-sm"
                      >
                        <option value="pending">Pending</option>
                        <option value="processing">Processing</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                      
                      {hasServices(order.items) && (
                        <Button
                          size="sm"
                          onClick={() => {
                            setSelectedOrder(order);
                            setShowChat(true);
                          }}
                        >
                          <MessageCircle className="h-4 w-4 mr-1" />
                          Chat
                        </Button>
                      )}
                    </div>

                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleViewCustomer(order)}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        View Customer
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDeleteOrder(order.order_id)}
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        Delete
                      </Button>
                    </div>
                  </div>
                </div>
              ))}

              {(!orders || orders.length === 0) && (
                <div className="text-center py-8">
                  <Package className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-500">No orders found</p>
                </div>
              )}
            </div>
          )}
        </Card>
      </div>

      {/* Customer Details Modal */}
      <Dialog open={showCustomerDetails} onOpenChange={setShowCustomerDetails}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <User className="h-5 w-5" />
              <span>Customer Details</span>
            </DialogTitle>
          </DialogHeader>
          {selectedOrder && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-3">
                <div>
                  <label className="text-sm font-medium text-gray-500">Order ID</label>
                  <p className="text-gray-900">#{selectedOrder.order_id.slice(0, 8)}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Username</label>
                  <p className="text-gray-900">{selectedOrder.username}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Email</label>
                  <p className="text-gray-900">{selectedOrder.user_email}</p>
                </div>
                {(selectedOrder.first_name || selectedOrder.last_name) && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">Full Name</label>
                    <p className="text-gray-900">
                      {[selectedOrder.first_name, selectedOrder.last_name].filter(Boolean).join(' ') || 'Not provided'}
                    </p>
                  </div>
                )}
                {selectedOrder.user_phone && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">Phone</label>
                    <p className="text-gray-900">{selectedOrder.user_phone}</p>
                  </div>
                )}
                {selectedOrder.user_address && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">Address</label>
                    <p className="text-gray-900">{selectedOrder.user_address}</p>
                  </div>
                )}
                {(selectedOrder.user_city || selectedOrder.user_country) && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">Location</label>
                    <p className="text-gray-900">
                      {[selectedOrder.user_city, selectedOrder.user_country].filter(Boolean).join(', ') || 'Not provided'}
                    </p>
                  </div>
                )}
                <div>
                  <label className="text-sm font-medium text-gray-500">Order Total</label>
                  <p className="text-lg font-bold text-orange-600">${selectedOrder.total_amount.toFixed(2)}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Order Date</label>
                  <p className="text-gray-900">{new Date(selectedOrder.created_at).toLocaleDateString()}</p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Chat Modal */}
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
