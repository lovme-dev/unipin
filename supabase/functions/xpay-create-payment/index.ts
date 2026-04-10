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
    const XPAY_PUBLISHABLE_KEY = Deno.env.get("XPAY_PUBLISHABLE_KEY");
    const XPAY_SECRET_KEY = Deno.env.get("XPAY_SECRET_KEY");
    const XPAY_ACCOUNT_ID = Deno.env.get("XPAY_ACCOUNT_ID");

    if (!XPAY_PUBLISHABLE_KEY || !XPAY_SECRET_KEY) {
      throw new Error("XPay API keys not configured");
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

    // Basic auth: base64(publishableKey:secretKey)
    const basicAuth = btoa(`${XPAY_PUBLISHABLE_KEY}:${XPAY_SECRET_KEY}`);

    // XPay API: https://api.xpaycheckout.com/payments/create-intent
    const response = await fetch("https://api.xpaycheckout.com/payments/create-intent", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Basic ${basicAuth}`,
      },
      body: JSON.stringify({
        amount: Math.round(amount * 100), // lowest currency unit (paisa)
        currency,
        customerDetails: {
          name: customerName || "Customer",
          email: customerEmail,
          contactNumber: customerPhone || "+920000000000",
        },
        callbackUrl: successUrl,
        cancelUrl: cancelUrl,
        receiptId: orderId,
        description: productName || "Free Fire Diamonds",
        paymentMethods: ["CARD"],
        metadata: {
          productType,
          productAmount,
          playerId,
          packageId,
          orderId,
        },
      }),
    });

    const responseText = await response.text();
    console.log("[XPay] API response status:", response.status);
    console.log("[XPay] API response:", responseText);

    let data;
    try {
      data = JSON.parse(responseText);
    } catch {
      console.error("[XPay] Non-JSON response:", responseText.substring(0, 500));
      throw new Error(`XPay API returned non-JSON response [${response.status}]`);
    }

    if (!response.ok) {
      console.error("[XPay] Create intent failed:", data);
      throw new Error(data.message || data.error || `XPay API error [${response.status}]`);
    }

    // Response has xIntentId and fwdUrl
    return new Response(
      JSON.stringify({
        success: true,
        xIntentId: data.xIntentId,
        fwdUrl: data.fwdUrl,
        clientSecret: data.xIntentId, // SDK uses xIntentId as client secret
        encryptionKey: data.encryptionKey || "",
        paymentIntentId: data.xIntentId,
        orderId,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("[XPay] Error:", error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
