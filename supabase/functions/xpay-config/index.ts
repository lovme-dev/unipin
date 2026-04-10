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
    const publishableKey = Deno.env.get("XPAY_PUBLISHABLE_KEY");
    const accountId = Deno.env.get("XPAY_ACCOUNT_ID");
    const hmacSecret = Deno.env.get("XPAY_HMAC_SECRET");

    if (!publishableKey || !accountId) {
      throw new Error("XPay configuration not found");
    }

    return new Response(
      JSON.stringify({
        publishableKey,
        accountId,
        hmacSecret: hmacSecret || "",
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
