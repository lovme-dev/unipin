import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const XPAY_SECRET_KEY = Deno.env.get("XPAY_SECRET_KEY");
    const XPAY_ACCOUNT_ID = Deno.env.get("XPAY_ACCOUNT_ID");

    if (!XPAY_SECRET_KEY) {
      throw new Error("XPAY_SECRET_KEY is not configured");
    }
    if (!XPAY_ACCOUNT_ID) {
      throw new Error("XPAY_ACCOUNT_ID is not configured");
    }

    const body = await req.json();
    const {
      amount,
      currency = "PKR",
      orderId,
      customerEmail,
      customerName,
      customerPhone,
      productName,
      productType,
      productAmount,
      playerId,
      packageId,
      successUrl,
      cancelUrl,
    } = body;

    if (!amount || !orderId || !customerEmail) {
      return new Response(
        JSON.stringify({ success: false, error: "Missing required fields" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Create payment intent with XPay API
    const response = await fetch("https://api.xstak.com/api/v1/payment-intent", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${XPAY_SECRET_KEY}`,
        "x-account-id": XPAY_ACCOUNT_ID,
      },
      body: JSON.stringify({
        amount: Math.round(amount * 100), // Convert to smallest unit
        currency,
        order_id: orderId,
        customer: {
          email: customerEmail,
          name: customerName || "Customer",
          phone: customerPhone,
        },
        metadata: {
          productName,
          productType,
          productAmount,
          playerId,
          packageId,
        },
        success_url: successUrl,
        cancel_url: cancelUrl,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("[XPay] Create payment intent failed:", data);
      throw new Error(data.message || `XPay API error [${response.status}]`);
    }

    return new Response(
      JSON.stringify({
        success: true,
        clientSecret: data.client_secret,
        encryptionKey: data.encryption_key,
        paymentIntentId: data.id,
        orderId,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("[XPay] Error:", error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
