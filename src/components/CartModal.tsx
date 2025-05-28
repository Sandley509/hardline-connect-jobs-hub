
import React from 'react';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { X, Plus, Minus, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/components/ui/use-toast';

interface CartModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCheckout?: () => void;
}

const CartModal = ({ isOpen, onClose, onCheckout }: CartModalProps) => {
  const { items, updateQuantity, removeItem, getTotalPrice } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleCheckout = () => {
    if (!user) {
      toast({
        title: "Login Required",
        description: "Please login or create an account to complete your purchase.",
        variant: "destructive"
      });
      onClose();
      navigate('/login');
      return;
    }

    if (onCheckout) {
      onCheckout();
    } else {
      navigate('/checkout');
    }
  };

  const handleContinueShopping = () => {
    onClose();
    navigate('/shop');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-bold">Shopping Cart</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="overflow-y-auto max-h-96 p-6">
          {items.length === 0 ? (
            <div className="text-center py-8">
              <ShoppingBag className="h-16 w-16 mx-auto text-gray-400 mb-4" />
              <p className="text-gray-500 text-lg">Your cart is empty</p>
              <p className="text-gray-400">Add some items to get started</p>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => (
                <div key={item.id} className="flex items-center space-x-4 bg-gray-50 p-4 rounded-lg">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-16 h-16 object-cover rounded"
                  />
                  <div className="flex-1">
                    <h3 className="font-medium">{item.name}</h3>
                    <p className="text-green-600 font-bold">${item.price.toFixed(2)}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="p-1 hover:bg-gray-200 rounded"
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="w-8 text-center">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="p-1 hover:bg-gray-200 rounded"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="text-red-500 hover:text-red-700 p-1"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {items.length > 0 && (
          <div className="border-t p-6">
            <div className="flex justify-between items-center mb-4">
              <span className="text-lg font-bold">Total:</span>
              <span className="text-xl font-bold text-green-600">
                ${getTotalPrice().toFixed(2)}
              </span>
            </div>
            <div className="flex space-x-4">
              <Button
                variant="outline"
                onClick={handleContinueShopping}
                className="flex-1"
              >
                Continue Shopping
              </Button>
              <Button
                onClick={handleCheckout}
                className="flex-1 bg-green-600 hover:bg-green-700"
              >
                {user ? 'Proceed to Checkout' : 'Login to Checkout'}
              </Button>
            </div>
            {!user && (
              <p className="text-center text-sm text-gray-500 mt-2">
                You need to login to complete your purchase
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CartModal;
