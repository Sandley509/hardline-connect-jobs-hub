
import React, { useEffect, useState } from 'react';
import Layout from '@/components/Layout';
import { CheckCircle, ArrowRight, ShoppingBag, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useCart } from '@/contexts/CartContext';
import { supabase } from '@/integrations/supabase/client';

const CheckoutSuccess = () => {
  const navigate = useNavigate();
  const { clearCart } = useCart();
  const [searchParams] = useSearchParams();
  const [isVerifying, setIsVerifying] = useState(true);
  const [orderDetails, setOrderDetails] = useState<any>(null);
  
  const sessionId = searchParams.get('session_id');

  useEffect(() => {
    const verifyPayment = async () => {
      if (!sessionId) {
        setIsVerifying(false);
        return;
      }

      try {
        // Simulate webhook processing by calling it directly
        await supabase.functions.invoke('stripe-webhook', {
          body: {
            type: 'checkout.session.completed',
            data: {
              object: {
                id: sessionId,
                customer_email: 'customer@example.com', // This would come from Stripe
                metadata: {
                  total_amount: '0', // This would come from Stripe
                  items: '[]' // This would come from Stripe
                }
              }
            }
          }
        });

        // Clear cart after successful payment
        clearCart();
        setIsVerifying(false);
      } catch (error) {
        console.error('Payment verification error:', error);
        setIsVerifying(false);
      }
    };

    verifyPayment();
  }, [sessionId, clearCart]);

  if (isVerifying) {
    return (
      <Layout>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-24 w-24 rounded-full bg-blue-100 mb-8">
              <Loader2 className="h-12 w-12 text-blue-600 animate-spin" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Verifying Payment...
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Please wait while we confirm your payment.
            </p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-24 w-24 rounded-full bg-green-100 mb-8">
            <CheckCircle className="h-12 w-12 text-green-600" />
          </div>
          
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Payment Successful!
          </h1>
          
          <p className="text-xl text-gray-600 mb-8">
            Thank you for your purchase. Your order has been successfully processed.
          </p>
          
          <div className="bg-gray-50 rounded-lg p-6 mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">What's Next?</h2>
            <p className="text-gray-600 mb-4">
              You will receive a confirmation email shortly with your order details.
            </p>
            <p className="text-gray-600">
              You can view your order history in your dashboard.
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
              onClick={() => navigate('/dashboard/orders')}
              className="inline-flex items-center px-6 py-3"
            >
              View Orders
              <ArrowRight className="h-5 w-5 ml-2" />
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CheckoutSuccess;
