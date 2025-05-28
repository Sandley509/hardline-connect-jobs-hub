
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
    
    // Handle empty body (health checks)
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
      console.log('Event data object:', event.data?.object?.id);
    } catch (err) {
      console.error('JSON parse error:', err);
      return new Response("Invalid JSON", { status: 400 });
    }

    // Only process checkout.session.completed events
    if (event.type !== "checkout.session.completed") {
      console.log('Event type not handled:', event.type);
      return new Response(JSON.stringify({ received: true }), {
        headers: { "Content-Type": "application/json" },
        status: 200,
      });
    }

    const session = event.data.object;
    const sessionId = session.id;
    
    console.log('Processing checkout session completed:', sessionId);
    console.log('Payment status:', session.payment_status);
    console.log('Customer email:', session.customer_email);
    console.log('Amount total:', session.amount_total);

    // Only process if payment was successful
    if (session.payment_status !== 'paid') {
      console.log('Payment not completed, skipping order creation');
      return new Response(JSON.stringify({ received: true, skipped: true }), {
        headers: { "Content-Type": "application/json" },
        status: 200,
      });
    }

    const totalAmount = (session.amount_total || 0) / 100; // Convert from cents
    const customerEmail = session.customer_email || 'guest@example.com';

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

    // Check if order already exists
    const { data: existingOrder } = await supabase
      .from('orders')
      .select('id')
      .eq('stripe_session_id', sessionId)
      .single();

    if (existingOrder) {
      console.log('Order already exists for session:', sessionId);
      return new Response(JSON.stringify({ 
        received: true, 
        order_id: existingOrder.id,
        already_exists: true 
      }), {
        headers: { "Content-Type": "application/json" },
        status: 200,
      });
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

    // Create order items from metadata or line items
    let orderItems = [];
    try {
      // Try to get line items from Stripe session
      const fullSession = await stripe.checkout.sessions.retrieve(sessionId, {
        expand: ['line_items'],
      });

      if (fullSession.line_items?.data?.length > 0) {
        orderItems = fullSession.line_items.data.map(item => ({
          order_id: order.id,
          product_name: item.description || 'Shop Purchase',
          product_type: 'product',
          price: (item.amount_total || 0) / 100,
          quantity: item.quantity || 1
        }));
      } else {
        // Fallback: create a single item for the total amount
        orderItems = [{
          order_id: order.id,
          product_name: 'Shop Purchase',
          product_type: 'product',
          price: totalAmount,
          quantity: 1
        }];
      }
    } catch (stripeError) {
      console.error('Error retrieving line items:', stripeError);
      // Fallback: create a single item
      orderItems = [{
        order_id: order.id,
        product_name: 'Shop Purchase',
        product_type: 'product',
        price: totalAmount,
        quantity: 1
      }];
    }

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

  } catch (error) {
    console.error("Webhook error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { "Content-Type": "application/json" },
      status: 400,
    });
  }
});
