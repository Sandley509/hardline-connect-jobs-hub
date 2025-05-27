
import React from 'react';
import { ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/contexts/CartContext';

interface CartIconProps {
  onClick: () => void;
}

const CartIcon = ({ onClick }: CartIconProps) => {
  const { getTotalItems } = useCart();
  const totalItems = getTotalItems();

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={onClick}
      className="relative"
    >
      <ShoppingCart className="h-4 w-4" />
      {totalItems > 0 && (
        <span className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
          {totalItems}
        </span>
      )}
    </Button>
  );
};

export default CartIcon;
