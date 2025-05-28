
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
  apiVersion: "2023-10-16",
});

const supabase = createClient(
  Deno.env.get("SUPABASE_URL") ?? "",
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
  { auth: { persistSession: false } }
);

serve(async (req) => {
  try {
    console.log('Webhook request received');
    console.log('Method:', req.method);
    console.log('Headers:', Object.fromEntries(req.headers.entries()));

    const body = await req.text();
    console.log('Raw body length:', body.length);
    
    if (!body || body.length === 0) {
      console.log('Empty body received, returning success for health check');
      return new Response(JSON.stringify({ received: true }), {
        headers: { "Content-Type": "application/json" },
        status: 200,
      });
    }

    let event;
    try {
      event = JSON.parse(body);
      console.log('Parsed event type:', event.type);
    } catch (err) {
      console.error('JSON parse error:', err);
      return new Response("Invalid JSON", { status: 400 });
    }

    // Handle test webhook or checkout session completed
    if (event.type === "checkout.session.completed" || event.data?.object?.id) {
      const session = event.data?.object || event;
      const sessionId = session.id;
      
      console.log('Processing session:', sessionId);

      if (!sessionId) {
        console.log('No session ID found, creating test order');
        // Create a test order for debugging
        const testOrder = {
          user_id: null,
          total_amount: 25.00,
          status: 'completed',
          stripe_session_id: 'test_' + Date.now(),
          created_at: new Date().toISOString()
        };

        const { data: order, error: orderError } = await supabase
          .from('orders')
          .insert(testOrder)
          .select()
          .single();

        if (orderError) {
          console.error('Test order creation error:', orderError);
        } else {
          console.log('Test order created:', order.id);
          
          // Create test order items
          const testItems = [
            {
              order_id: order.id,
              product_name: 'Test Product',
              product_type: 'product',
              price: 25.00,
              quantity: 1
            }
          ];

          const { error: itemsError } = await supabase
            .from('order_items')
            .insert(testItems);

          if (itemsError) {
            console.error('Test order items error:', itemsError);
          } else {
            console.log('Test order items created');
          }
        }

        return new Response(JSON.stringify({ received: true, test_order: true }), {
          headers: { "Content-Type": "application/json" },
          status: 200,
        });
      }

      // Try to get full session details from Stripe
      let fullSession;
      try {
        fullSession = await stripe.checkout.sessions.retrieve(sessionId, {
          expand: ['line_items'],
        });
        console.log('Retrieved session from Stripe:', {
          id: fullSession.id,
          customer_email: fullSession.customer_email,
          amount_total: fullSession.amount_total,
          payment_status: fullSession.payment_status
        });
      } catch (stripeError) {
        console.error('Error retrieving session from Stripe:', stripeError);
        fullSession = session;
      }

      // Only process if payment was successful
      if (fullSession.payment_status !== 'paid' && fullSession.status !== 'complete') {
        console.log('Payment not completed, skipping order creation');
        return new Response(JSON.stringify({ received: true, skipped: true }), {
          headers: { "Content-Type": "application/json" },
          status: 200,
        });
      }

      const totalAmount = (fullSession.amount_total || 2500) / 100; // Default to $25 if not found
      const customerEmail = fullSession.customer_email || 'guest@example.com';

      console.log('Processing order for:', customerEmail, 'Amount:', totalAmount);

      // Find user by email
      let matchedUser = null;
      if (customerEmail && customerEmail !== 'guest@example.com') {
        try {
          const { data: authUsers } = await supabase.auth.admin.listUsers();
          matchedUser = authUsers.users.find(u => u.email === customerEmail);
          console.log('Found user by email:', matchedUser ? matchedUser.id : 'not found');
        } catch (authError) {
          console.error('Error finding user:', authError);
        }
      }

      // Create order
      const orderData = {
        user_id: matchedUser?.id || null,
        total_amount: totalAmount,
        status: 'completed',
        stripe_session_id: sessionId,
        created_at: new Date().toISOString()
      };

      console.log('Creating order with data:', orderData);

      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert(orderData)
        .select()
        .single();

      if (orderError) {
        console.error('Order creation error:', orderError);
        return new Response("Order creation failed", { status: 500 });
      }

      console.log('Order created successfully:', order.id);

      // Create order items
      const orderItems = [
        {
          order_id: order.id,
          product_name: 'Shop Purchase',
          product_type: 'product',
          price: totalAmount,
          quantity: 1
        }
      ];

      console.log('Creating order items:', orderItems.length);

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);

      if (itemsError) {
        console.error('Order items error:', itemsError);
      } else {
        console.log('Order items created successfully');
      }

      // Create notification for admin
      const notificationData = {
        title: 'New Order Received',
        message: `Order #${order.id.slice(0, 8)} - $${totalAmount.toFixed(2)} from ${customerEmail}`,
        type: 'info',
        created_at: new Date().toISOString()
      };

      console.log('Creating admin notification');

      const { error: notificationError } = await supabase
        .from('notifications')
        .insert(notificationData);

      if (notificationError) {
        console.error('Notification error:', notificationError);
      } else {
        console.log('Admin notification created successfully');
      }

      console.log('Webhook processing completed successfully for order:', order.id);

      return new Response(JSON.stringify({ 
        received: true, 
        order_id: order.id,
        user_id: matchedUser?.id || null 
      }), {
        headers: { "Content-Type": "application/json" },
        status: 200,
      });
    }

    console.log('Event type not handled:', event.type);
    return new Response(JSON.stringify({ received: true }), {
      headers: { "Content-Type": "application/json" },
      status: 200,
    });

  } catch (error) {
    console.error("Webhook error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { "Content-Type": "application/json" },
      status: 400,
    });
  }
});
