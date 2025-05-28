
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Package, MessageCircle, Eye, Trash2 } from "lucide-react";
import { UseMutationResult } from "@tanstack/react-query";

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

interface OrderListProps {
  orders: Order[] | undefined;
  isLoading: boolean;
  updateOrderStatus: UseMutationResult<void, Error, { orderId: string; status: string }, unknown>;
  onViewCustomer: (order: Order) => void;
  onDeleteOrder: (orderId: string) => void;
  onChatClick: (order: Order) => void;
}

const OrderList = ({ 
  orders, 
  isLoading, 
  updateOrderStatus, 
  onViewCustomer, 
  onDeleteOrder, 
  onChatClick 
}: OrderListProps) => {
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

  const handleDeleteOrder = (orderId: string) => {
    if (window.confirm('Are you sure you want to delete this order? This action cannot be undone.')) {
      onDeleteOrder(orderId);
    }
  };

  return (
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
                      onClick={() => onChatClick(order)}
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
                    onClick={() => onViewCustomer(order)}
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
  );
};

export default OrderList;
