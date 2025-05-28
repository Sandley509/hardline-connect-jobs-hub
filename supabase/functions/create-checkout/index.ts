
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { items, userEmail, userInfo } = await req.json();
    
    console.log('Checkout request received:', { items, userEmail, userInfo });
    
    // Check if Stripe secret key is available
    const stripeSecretKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeSecretKey) {
      console.error("STRIPE_SECRET_KEY environment variable is not set");
      throw new Error("Stripe configuration error. Please contact support.");
    }

    console.log('Stripe secret key found, initializing Stripe...');
    
    // Initialize Stripe with the secret key
    const stripe = new Stripe(stripeSecretKey, {
      apiVersion: "2023-10-16",
    });

    // Validate that we have items
    if (!items || !Array.isArray(items) || items.length === 0) {
      throw new Error("No items provided for checkout");
    }

    // Create line items for Stripe
    const lineItems = items.map((item: any) => ({
      price_data: {
        currency: "usd",
        product_data: {
          name: item.name,
          images: item.image ? [item.image] : [],
        },
        unit_amount: Math.round(item.price * 100), // Convert to cents
      },
      quantity: item.quantity,
    }));

    // Calculate total amount
    const totalAmount = items.reduce((total: number, item: any) => 
      total + (item.price * item.quantity), 0
    );

    console.log('Creating Stripe session with:', { lineItems, totalAmount });

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: `${req.headers.get("origin")}/checkout-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.get("origin")}/checkout`,
      customer_email: userEmail,
      metadata: {
        total_amount: totalAmount.toString(),
        items: JSON.stringify(items),
        user_info: userInfo ? JSON.stringify(userInfo) : "",
      },
    });

    console.log('Stripe session created successfully:', session.id);

    return new Response(JSON.stringify({ url: session.url, sessionId: session.id }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("Stripe checkout error:", error);
    
    // Provide more specific error messages
    let errorMessage = "Failed to create checkout session. Please try again.";
    if (error.message?.includes("No such customer")) {
      errorMessage = "Customer validation failed. Please try again.";
    } else if (error.message?.includes("API key")) {
      errorMessage = "Payment system configuration error. Please contact support.";
    } else if (error.message?.includes("Invalid")) {
      errorMessage = "Invalid payment information. Please check your details.";
    }
    
    return new Response(JSON.stringify({ 
      error: error.message,
      details: errorMessage
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
