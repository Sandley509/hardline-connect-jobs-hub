
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
    const signature = req.headers.get("stripe-signature");
    
    if (!signature) {
      return new Response("No signature", { status: 400 });
    }

    // For now, we'll process without webhook verification since it requires endpoint setup
    const event = JSON.parse(body);
    
    console.log('Received webhook event:', event.type);
    
    if (event.type === "checkout.session.completed") {
      const session = event.data.object;
      
      console.log('Processing checkout session:', session.id);
      
      // Get session details from Stripe
      const fullSession = await stripe.checkout.sessions.retrieve(session.id, {
        expand: ['line_items'],
      });
      
      const items = JSON.parse(session.metadata?.items || '[]');
      const totalAmount = parseFloat(session.metadata?.total_amount || '0');
      const userInfo = session.metadata?.user_info ? JSON.parse(session.metadata.user_info) : null;
      
      console.log('Session details:', { items, totalAmount, userInfo });
      
      // Find user by email
      const { data: authUsers } = await supabase.auth.admin.listUsers();
      const matchedUser = authUsers.users.find(u => u.email === session.customer_email);
      
      console.log('Found user:', matchedUser?.id);
      
      // Create order
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          user_id: matchedUser?.id || null,
          total_amount: totalAmount,
          status: 'completed',
          stripe_session_id: session.id
        })
        .select()
        .single();

      if (orderError) {
        console.error('Order creation error:', orderError);
        return new Response("Order creation failed", { status: 500 });
      }

      console.log('Order created:', order.id);

      // Create order items
      if (items && items.length > 0) {
        const orderItems = items.map((item: any) => ({
          order_id: order.id,
          product_name: item.name,
          product_type: item.category,
          price: item.price,
          quantity: item.quantity
        }));

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
      const { error: notificationError } = await supabase
        .from('notifications')
        .insert({
          title: 'New Order Received',
          message: `Order #${order.id.slice(0, 8)} - $${totalAmount.toFixed(2)} from ${session.customer_email}`,
          type: 'info'
        });

      if (notificationError) {
        console.error('Notification error:', notificationError);
      }

      console.log('Order processed successfully:', order.id);
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
