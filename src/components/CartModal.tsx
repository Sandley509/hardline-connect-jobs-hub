
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { useNavigate } from 'react-router-dom';

interface CartModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCheckout?: () => void;
}

const CartModal = ({ isOpen, onClose, onCheckout }: CartModalProps) => {
  const { items, updateQuantity, removeItem, getTotalPrice } = useCart();
  const navigate = useNavigate();

  const handleCheckout = () => {
    console.log('CartModal: Checkout button clicked, navigating to /checkout');
    onClose();
    navigate('/checkout');
    if (onCheckout) {
      onCheckout();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Shopping Cart</DialogTitle>
        </DialogHeader>
        
        {items.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">Your cart is empty</p>
          </div>
        ) : (
          <div className="space-y-4">
            {items.map(item => (
              <div key={item.id} className="flex items-center space-x-4 border-b pb-4">
                <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded" />
                <div className="flex-1">
                  <h4 className="font-medium">{item.name}</h4>
                  <p className="text-green-600 font-bold">${item.price.toFixed(2)}</p>
                  <p className="text-xs text-gray-500 capitalize">{item.category}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                  >
                    <Minus className="h-3 w-3" />
                  </Button>
                  <span className="w-8 text-center">{item.quantity}</span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  >
                    <Plus className="h-3 w-3" />
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => removeItem(item.id)}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            ))}
            
            <div className="border-t pt-4">
              <div className="flex justify-between items-center text-lg font-bold">
                <span>Total: ${getTotalPrice().toFixed(2)}</span>
              </div>
              <div className="flex space-x-2 mt-4">
                <Button variant="outline" onClick={onClose} className="flex-1">
                  Continue Shopping
                </Button>
                <Button onClick={handleCheckout} className="flex-1 bg-blue-600 hover:bg-blue-700">
                  Proceed to Checkout
                </Button>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default CartModal;
