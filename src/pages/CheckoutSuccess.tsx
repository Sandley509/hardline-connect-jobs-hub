
import React, { useEffect, useState } from 'react';
import Layout from '@/components/Layout';
import { CheckCircle, ArrowRight, ShoppingBag, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useCart } from '@/contexts/CartContext';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

const CheckoutSuccess = () => {
  const navigate = useNavigate();
  const { clearCart } = useCart();
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const [isVerifying, setIsVerifying] = useState(true);
  const [orderDetails, setOrderDetails] = useState<any>(null);
  
  const sessionId = searchParams.get('session_id');

  useEffect(() => {
    const verifyPayment = async () => {
      if (!sessionId || !user) {
        setIsVerifying(false);
        return;
      }

      try {
        console.log('Verifying payment for session:', sessionId);
        
        // Wait a moment for webhook to process
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Check if order was created by looking for it in our database
        const { data: order, error } = await supabase
          .from('orders')
          .select(`
            id,
            total_amount,
            status,
            created_at,
            order_items(
              id,
              product_name,
              product_type,
              price,
              quantity
            )
          `)
          .eq('stripe_session_id', sessionId)
          .eq('user_id', user.id)
          .single();

        if (error) {
          console.error('Error fetching order:', error);
          // If no order found, trigger webhook manually
          await supabase.functions.invoke('stripe-webhook', {
            body: {
              type: 'checkout.session.completed',
              data: {
                object: {
                  id: sessionId,
                  customer_email: user.email,
                  metadata: {
                    total_amount: '0',
                    items: '[]'
                  }
                }
              }
            }
          });
        } else {
          setOrderDetails(order);
          console.log('Order found:', order);
        }

        // Clear cart after successful payment verification
        clearCart();
        setIsVerifying(false);
      } catch (error) {
        console.error('Payment verification error:', error);
        setIsVerifying(false);
      }
    };

    verifyPayment();
  }, [sessionId, clearCart, user]);

  if (isVerifying) {
    return (
      <Layout>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-24 w-24 rounded-full bg-blue-100 mb-8">
              <Loader2 className="h-12 w-12 text-blue-600 animate-spin" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Processing Your Order...
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Please wait while we confirm your payment and create your order.
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
          
          {orderDetails && (
            <div className="bg-gray-50 rounded-lg p-6 mb-8 text-left">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Details</h2>
              <div className="space-y-2">
                <p><strong>Order ID:</strong> #{orderDetails.id.slice(0, 8)}</p>
                <p><strong>Total:</strong> ${orderDetails.total_amount.toFixed(2)}</p>
                <p><strong>Status:</strong> {orderDetails.status}</p>
                <p><strong>Date:</strong> {new Date(orderDetails.created_at).toLocaleDateString()}</p>
              </div>
              
              {orderDetails.order_items && orderDetails.order_items.length > 0 && (
                <div className="mt-4">
                  <h3 className="font-medium text-gray-900 mb-2">Items:</h3>
                  <div className="space-y-1">
                    {orderDetails.order_items.map((item: any) => (
                      <div key={item.id} className="flex justify-between text-sm">
                        <span>{item.product_name} x{item.quantity}</span>
                        <span>${(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
          
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
