// PayFast (GoPay Fast) — Get access token + return signed redirect form
// Docs: ipguat.apps.net.pk (sandbox) / ipg1.apps.net.pk (live)
import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

function generateBasketId(prefix = "UNIPIN") {
  const chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let s = "";
  for (let i = 0; i < 6; i++) s += chars[Math.floor(Math.random() * chars.length)];
  return `${prefix}-${s}`;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const body = await req.json();
    const {
      amount,
      currency = "PKR",
      customer_email = "guest@unipin.pk",
      customer_mobile = "03000000000",
      item_name = "UniPin Top Up",
      item_sku = "UNIPIN-TOPUP",
      success_url,
      failure_url,
      checkout_url,
    } = body ?? {};

    if (!amount || Number(amount) <= 0) {
      return new Response(JSON.stringify({ error: "Invalid amount" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const MERCHANT_ID = Deno.env.get("PAYFAST_MERCHANT_ID") ?? "103";
    const SECURED_KEY =
      Deno.env.get("PAYFAST_SECURED_KEY") ?? "PzPx6ut-SVay7tCUMqG";
    const MODE = (Deno.env.get("PAYFAST_MODE") ?? "sandbox").toLowerCase();

    const tokenBase =
      MODE === "live"
        ? "https://ipg1.apps.net.pk/Ecommerce/api/Transaction/GetAccessToken"
        : "https://ipguat.apps.net.pk/Ecommerce/api/Transaction/GetAccessToken";
    const postBase =
      MODE === "live"
        ? "https://ipg1.apps.net.pk/Ecommerce/api/Transaction/PostTransaction"
        : "https://ipguat.apps.net.pk/Ecommerce/api/Transaction/PostTransaction";

    const basket_id = generateBasketId();
    const txn_amount = Number(amount).toFixed(0);

    const params = new URLSearchParams({
      MERCHANT_ID,
      SECURED_KEY,
      BASKET_ID: basket_id,
      TXNAMT: txn_amount,
      CURRENCY_CODE: currency,
    });

    const tokenRes = await fetch(tokenBase, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: params.toString(),
    });
    const tokenJson = await tokenRes.json().catch(() => ({}));
    const token = tokenJson?.ACCESS_TOKEN;

    if (!token) {
      console.error("PayFast token error", tokenJson);
      return new Response(
        JSON.stringify({ error: "Failed to get access token", details: tokenJson }),
        {
          status: 502,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const orderDate = new Date()
      .toISOString()
      .replace("T", " ")
      .substring(0, 19);

    const formFields: Record<string, string> = {
      CURRENCY_CODE: currency,
      MERCHANT_ID,
      MERCHANT_NAME: "UniPin",
      TOKEN: token,
      BASKET_ID: basket_id,
      TXNAMT: txn_amount,
      ORDER_DATE: orderDate,
      SUCCESS_URL: success_url ?? "https://unipin.pk/payment-success",
      FAILURE_URL: failure_url ?? "https://unipin.pk/payment-failure",
      CHECKOUT_URL: checkout_url ?? "https://unipin.pk/checkout",
      CUSTOMER_EMAIL_ADDRESS: customer_email,
      CUSTOMER_MOBILE_NO: customer_mobile,
      SIGNATURE: "SOMERANDOM-STRING",
      VERSION: "MERCHANTCART-0.1",
      TXNDESC: item_name,
      PROCCODE: "00",
      TRAN_TYPE: "ECOMM_PURCHASE",
      STORE_ID: "",
      RECURRING_TXN: "",
      "ITEMS[0][SKU]": item_sku,
      "ITEMS[0][NAME]": item_name,
      "ITEMS[0][PRICE]": txn_amount,
      "ITEMS[0][QTY]": "1",
    };

    return new Response(
      JSON.stringify({
        success: true,
        action_url: postBase,
        fields: formFields,
        basket_id,
        token,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (e) {
    console.error("payfast-create error", e);
    return new Response(
      JSON.stringify({
        error: e instanceof Error ? e.message : "Unknown error",
      }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
