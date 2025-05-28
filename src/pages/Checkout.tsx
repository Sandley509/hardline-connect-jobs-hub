
import React, { useState } from 'react';
import Layout from '@/components/Layout';
import CartModal from '@/components/CartModal';
import CheckoutForm from '@/components/CheckoutForm';
import { useCart } from '@/contexts/CartContext';
import { useNavigate } from 'react-router-dom';

const Checkout = () => {
  const [showCart, setShowCart] = useState(true);
  const { items } = useCart();
  const navigate = useNavigate();

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

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">Checkout</h1>
        
        {showCart ? (
          <CartModal
            isOpen={true}
            onClose={() => navigate('/shop')}
            onCheckout={() => setShowCart(false)}
          />
        ) : (
          <CheckoutForm onBack={() => setShowCart(true)} />
        )}
      </div>
    </Layout>
  );
};

export default Checkout;
