export const runtime = "nodejs";

export async function POST() {
  try {
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
    const demoMode = process.env.PRISM_DEMO_MODE === "true";

    if (demoMode) {
      return Response.json({ url: `${siteUrl}/analyze?demo=1` });
    }

    const secretKey = process.env.STRIPE_SECRET_KEY;
    if (!secretKey) {
      return Response.json({ error: "Stripe is not configured yet." }, { status: 500 });
    }

    const params = new URLSearchParams();
    params.set("mode", "payment");
    params.set("success_url", `${siteUrl}/analyze?session_id={CHECKOUT_SESSION_ID}`);
    params.set("cancel_url", `${siteUrl}/`);
    params.set("customer_creation", "always");
    params.set("line_items[0][price_data][currency]", "usd");
    params.set("line_items[0][price_data][unit_amount]", "4900");
    params.set("line_items[0][price_data][product_data][name]", "Prism Contractor Quote Analysis");
    params.set("line_items[0][price_data][product_data][description]", "Comparison of up to three contractor proposals");
    params.set("line_items[0][quantity]", "1");

    const stripeResponse = await fetch("https://api.stripe.com/v1/checkout/sessions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${secretKey}`,
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: params
    });

    const session = await stripeResponse.json();

    if (!stripeResponse.ok || !session.url) {
      console.error("Stripe checkout error:", session);
      return Response.json({ error: "Unable to create checkout session." }, { status: 500 });
    }

    return Response.json({ url: session.url });
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Unable to start checkout." }, { status: 500 });
  }
}
