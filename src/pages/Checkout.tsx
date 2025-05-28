
import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import CartModal from '@/components/CartModal';
import CheckoutForm from '@/components/CheckoutForm';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

const Checkout = () => {
  const [showCart, setShowCart] = useState(false);
  const [showCheckoutForm, setShowCheckoutForm] = useState(false);
  const { items } = useCart();
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  // Check authentication on mount
  useEffect(() => {
    if (!loading && !user) {
      toast({
        title: "Login Required",
        description: "Please login or create an account to complete your purchase.",
        variant: "destructive"
      });
      navigate('/login');
    }
  }, [user, loading, navigate]);

  // Show loading while checking authentication
  if (loading) {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="flex justify-center items-center">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        </div>
      </Layout>
    );
  }

  // Don't render if user is not authenticated (will redirect)
  if (!user) {
    return null;
  }

  if (items.length === 0) {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-800 mb-4">Your Cart is Empty</h1>
            <p className="text-gray-600 mb-8">Add some items to your cart to proceed with checkout.</p>
            <button
              onClick={() => navigate('/shop')}
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  const handleProceedToPayment = () => {
    setShowCart(false);
    setShowCheckoutForm(true);
  };

  const handleBackToCart = () => {
    setShowCheckoutForm(false);
    setShowCart(true);
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">Checkout</h1>
        
        {!showCheckoutForm ? (
          <CartModal
            isOpen={true}
            onClose={() => navigate('/shop')}
            onCheckout={handleProceedToPayment}
          />
        ) : (
          <CheckoutForm onBack={handleBackToCart} />
        )}
      </div>
    </Layout>
  );
};

export default Checkout;
