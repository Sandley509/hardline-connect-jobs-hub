
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
    const body = await req.text();
    console.log('Webhook received:', { bodyLength: body.length });
    
    let event;
    try {
      event = JSON.parse(body);
    } catch (err) {
      console.error('JSON parse error:', err);
      return new Response("Invalid JSON", { status: 400 });
    }
    
    console.log('Received webhook event:', event.type, event.data?.object?.id);
    
    if (event.type === "checkout.session.completed") {
      const session = event.data.object;
      
      console.log('Processing checkout session:', session.id);
      console.log('Session metadata:', session.metadata);
      console.log('Customer email:', session.customer_email);
      
      // Get session details from Stripe to ensure we have all data
      let fullSession;
      try {
        fullSession = await stripe.checkout.sessions.retrieve(session.id, {
          expand: ['line_items'],
        });
        console.log('Retrieved full session from Stripe:', {
          id: fullSession.id,
          customer_email: fullSession.customer_email,
          amount_total: fullSession.amount_total,
          metadata: fullSession.metadata
        });
      } catch (stripeError) {
        console.error('Error retrieving session from Stripe:', stripeError);
        fullSession = session; // Fallback to webhook data
      }
      
      const items = JSON.parse(fullSession.metadata?.items || '[]');
      const totalAmount = (fullSession.amount_total || 0) / 100; // Convert cents to dollars
      const userInfo = fullSession.metadata?.user_info ? JSON.parse(fullSession.metadata.user_info) : null;
      
      console.log('Parsed session data:', { 
        items: items.length, 
        totalAmount, 
        userInfo: userInfo ? 'present' : 'missing',
        customerEmail: fullSession.customer_email 
      });
      
      // Find user by email
      let matchedUser = null;
      if (fullSession.customer_email) {
        try {
          const { data: authUsers } = await supabase.auth.admin.listUsers();
          matchedUser = authUsers.users.find(u => u.email === fullSession.customer_email);
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
        stripe_session_id: fullSession.id
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
      if (items && items.length > 0) {
        const orderItems = items.map((item: any) => ({
          order_id: order.id,
          product_name: item.name,
          product_type: item.category || 'product',
          price: item.price,
          quantity: item.quantity || 1
        }));

        console.log('Creating order items:', orderItems.length);

        const { error: itemsError } = await supabase
          .from('order_items')
          .insert(orderItems);

        if (itemsError) {
          console.error('Order items error:', itemsError);
        } else {
          console.log('Order items created successfully');
        }
      }

      // Create notification for admin
      const notificationData = {
        title: 'New Order Received',
        message: `Order #${order.id.slice(0, 8)} - $${totalAmount.toFixed(2)} from ${fullSession.customer_email || 'Unknown customer'}`,
        type: 'info'
      };
      
      console.log('Creating admin notification:', notificationData);
      
      const { error: notificationError } = await supabase
        .from('notifications')
        .insert(notificationData);

      if (notificationError) {
        console.error('Notification error:', notificationError);
      } else {
        console.log('Admin notification created successfully');
      }

      console.log('Webhook processing completed successfully for order:', order.id);
    }

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
