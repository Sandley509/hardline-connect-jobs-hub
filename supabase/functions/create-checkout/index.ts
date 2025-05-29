
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Create checkout function started');
    
    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
      apiVersion: "2023-10-16",
    });

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      throw new Error("No authorization header");
    }

    const token = authHeader.replace("Bearer ", "");
    const { data: { user }, error: userError } = await supabase.auth.getUser(token);

    if (userError || !user) {
      throw new Error("User not authenticated");
    }

    const { items } = await req.json();
    console.log('Processing checkout for user:', user.email);
    console.log('Items:', items);

    if (!items || items.length === 0) {
      throw new Error("No items provided");
    }

    // Get the origin from headers to build absolute URLs
    const origin = req.headers.get("origin") || "https://your-domain.com";

    // Create line items for Stripe with proper absolute image URLs
    const lineItems = items.map((item: any) => {
      let imageUrl = '';
      if (item.image) {
        // Convert relative URLs to absolute URLs
        if (item.image.startsWith('/')) {
          imageUrl = `${origin}${item.image}`;
        } else if (item.image.startsWith('http')) {
          imageUrl = item.image;
        } else {
          imageUrl = `${origin}/${item.image}`;
        }
      }

      const lineItem: any = {
        price_data: {
          currency: "usd",
          product_data: {
            name: item.name,
          },
          unit_amount: Math.round(item.price * 100), // Convert to cents
        },
        quantity: item.quantity || 1,
      };

      // Only add images array if we have a valid image URL
      if (imageUrl) {
        lineItem.price_data.product_data.images = [imageUrl];
      }

      return lineItem;
    });

    console.log('Line items created:', lineItems);
    
    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      customer_email: user.email,
      line_items: lineItems,
      mode: "payment",
      success_url: `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/shop`,
      metadata: {
        user_id: user.id,
        user_email: user.email,
      },
    });

    console.log('Checkout session created:', session.id);

    return new Response(
      JSON.stringify({ 
        url: session.url,
        session_id: session.id 
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );

  } catch (error) {
    console.error("Error creating checkout session:", error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : "Unknown error" 
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});
