import { NextResponse } from "next/server";
import { getAppBaseUrl, getStripe } from "@/lib/stripe";

export const runtime = "nodejs";

interface CheckoutRequestBody {
  lookupKey?: string;
  quantity?: number;
  mode?: "subscription" | "payment";
}

export async function POST(req: Request) {
  let body: CheckoutRequestBody;
  try {
    body = (await req.json()) as CheckoutRequestBody;
  } catch {
    return NextResponse.json({ error: "Invalid JSON payload." }, { status: 400 });
  }

  const { lookupKey, quantity = 1, mode = "subscription" } = body ?? {};
  if (!lookupKey) {
    return NextResponse.json({ error: "Missing lookup key." }, { status: 400 });
  }

  try {
    const stripe = getStripe();
    const prices = await stripe.prices.list({
      lookup_keys: [lookupKey],
      expand: ["data.product"],
      limit: 1,
    });

    const price = prices.data[0];
    if (!price) {
      return NextResponse.json({ error: "Price not found for lookup key." }, { status: 404 });
    }

    const origin = getAppBaseUrl(req.headers.get("origin") ?? undefined);

    const session = await stripe.checkout.sessions.create({
      billing_address_collection: "auto",
      line_items: [{ price: price.id, quantity }],
      mode,
      success_url: `${origin}/web/abonnements?success=true&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/web/abonnements?canceled=true`,
    });

    if (!session.url) {
      return NextResponse.json({ error: "Failed to obtain Stripe Checkout URL." }, { status: 500 });
    }

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Stripe checkout session error", error);
    return NextResponse.json({ error: "Unable to create checkout session." }, { status: 500 });
  }
}
