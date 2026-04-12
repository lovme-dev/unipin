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
    const apiSignatureSecret = Deno.env.get("XPAY_API_SIGNATURE_SECRET");

    if (!publishableKey || !accountId || !apiSignatureSecret) {
      throw new Error("XPay configuration not found");
    }

    return new Response(
      JSON.stringify({
        publishableKey,
        accountId,
        hmacSecret: apiSignatureSecret,
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
