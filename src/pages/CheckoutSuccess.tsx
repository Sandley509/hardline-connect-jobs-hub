
import React, { useEffect } from 'react';
import Layout from '@/components/Layout';
import { CheckCircle, ArrowRight, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useCart } from '@/contexts/CartContext';

const CheckoutSuccess = () => {
  const navigate = useNavigate();
  const { clearCart } = useCart();

  useEffect(() => {
    // Clear cart when reaching success page
    clearCart();
  }, [clearCart]);

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-24 w-24 rounded-full bg-green-100 mb-8">
            <CheckCircle className="h-12 w-12 text-green-600" />
          </div>
          
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Order Confirmed!
          </h1>
          
          <p className="text-xl text-gray-600 mb-8">
            Thank you for your purchase. Your order has been successfully processed.
          </p>
          
          <div className="bg-gray-50 rounded-lg p-6 mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">What's Next?</h2>
            <p className="text-gray-600 mb-4">
              You will receive a confirmation email shortly with your order details and tracking information.
            </p>
            <p className="text-gray-600">
              For any questions about your order, please contact our support team.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={() => navigate('/shop')}
              className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700"
            >
              <ShoppingBag className="h-5 w-5 mr-2" />
              Continue Shopping
            </Button>
            <Button
              variant="outline"
              onClick={() => navigate('/contact')}
              className="inline-flex items-center px-6 py-3"
            >
              Contact Support
              <ArrowRight className="h-5 w-5 ml-2" />
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CheckoutSuccess;
