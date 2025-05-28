
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { User } from "lucide-react";

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

interface CustomerDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: Order | null;
}

const CustomerDetailsModal = ({ isOpen, onClose, order }: CustomerDetailsModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <User className="h-5 w-5" />
            <span>Customer Details</span>
          </DialogTitle>
        </DialogHeader>
        {order && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-3">
              <div>
                <label className="text-sm font-medium text-gray-500">Order ID</label>
                <p className="text-gray-900">#{order.order_id.slice(0, 8)}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Username</label>
                <p className="text-gray-900">{order.username}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Email</label>
                <p className="text-gray-900">{order.user_email}</p>
              </div>
              {(order.first_name || order.last_name) && (
                <div>
                  <label className="text-sm font-medium text-gray-500">Full Name</label>
                  <p className="text-gray-900">
                    {[order.first_name, order.last_name].filter(Boolean).join(' ') || 'Not provided'}
                  </p>
                </div>
              )}
              {order.user_phone && (
                <div>
                  <label className="text-sm font-medium text-gray-500">Phone</label>
                  <p className="text-gray-900">{order.user_phone}</p>
                </div>
              )}
              {order.user_address && (
                <div>
                  <label className="text-sm font-medium text-gray-500">Address</label>
                  <p className="text-gray-900">{order.user_address}</p>
                </div>
              )}
              {(order.user_city || order.user_country) && (
                <div>
                  <label className="text-sm font-medium text-gray-500">Location</label>
                  <p className="text-gray-900">
                    {[order.user_city, order.user_country].filter(Boolean).join(', ') || 'Not provided'}
                  </p>
                </div>
              )}
              <div>
                <label className="text-sm font-medium text-gray-500">Order Total</label>
                <p className="text-lg font-bold text-orange-600">${order.total_amount.toFixed(2)}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Order Date</label>
                <p className="text-gray-900">{new Date(order.created_at).toLocaleDateString()}</p>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default CustomerDetailsModal;
