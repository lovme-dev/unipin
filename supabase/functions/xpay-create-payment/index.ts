import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// HMAC-SHA256 signature generation
async function generateHmacSignature(secret: string, payload: string): Promise<string> {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(payload));
  return Array.from(new Uint8Array(signature))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const XPAY_SECRET_KEY = Deno.env.get("XPAY_SECRET_KEY");
    const XPAY_ACCOUNT_ID = Deno.env.get("XPAY_ACCOUNT_ID");
    const XPAY_API_SIGNATURE_SECRET = Deno.env.get("XPAY_API_SIGNATURE_SECRET");

    if (!XPAY_SECRET_KEY) throw new Error("XPAY_SECRET_KEY not configured");
    if (!XPAY_ACCOUNT_ID) throw new Error("XPAY_ACCOUNT_ID not configured");
    if (!XPAY_API_SIGNATURE_SECRET) throw new Error("XPAY_API_SIGNATURE_SECRET not configured");

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
    } = body;

    if (!amount || !orderId || !customerEmail) {
      return new Response(
        JSON.stringify({ success: false, error: "Missing required fields" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Build XPay Fusion API payload
    const apiPayload = {
      amount: Math.round(amount), // PKR amount (not cents)
      currency,
      payment_method_types: "card",
      customer: {
        name: customerName || "Customer",
        email: customerEmail,
        phone: customerPhone || "03001234567",
      },
      metadata: {
        order_reference: orderId,
        productType,
        productAmount,
        playerId,
        packageId,
      },
      description: productName || "Free Fire Diamonds",
    };

    // Generate HMAC signature
    const payloadString = JSON.stringify(apiPayload);
    const signature = await generateHmacSignature(XPAY_API_SIGNATURE_SECRET, payloadString);

    console.log("[XPay] Creating payment intent for order:", orderId, "amount:", amount);

    // XPay Fusion API: POST /public/v1/payment/intent
    const response = await fetch("https://xstak-pay.xstak.com/public/v1/payment/intent", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": XPAY_SECRET_KEY,
        "x-account-id": XPAY_ACCOUNT_ID,
        "x-signature": signature,
      },
      body: payloadString,
    });

    const responseText = await response.text();
    console.log("[XPay] API response status:", response.status);
    console.log("[XPay] API response:", responseText.substring(0, 500));

    let data;
    try {
      data = JSON.parse(responseText);
    } catch {
      console.error("[XPay] Non-JSON response:", responseText.substring(0, 500));
      throw new Error(`XPay API returned non-JSON response [${response.status}]`);
    }

    if (!response.ok || !data.success) {
      console.error("[XPay] Create intent failed:", JSON.stringify(data));
      throw new Error(data.message || data.error || JSON.stringify(data));
    }

    const piData = data.data;

    return new Response(
      JSON.stringify({
        success: true,
        clientSecret: piData.pi_client_secret,
        encryptionKey: piData.encryptionKey,
        paymentIntentId: piData._id,
        orderId,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("[XPay] Error:", error.message);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
