import { NextResponse } from "next/server";
import { getAppBaseUrl, getStripe } from "@/lib/stripe";

export const runtime = "nodejs";

interface CheckoutRequestBody {
  lookupKey?: string;
  priceId?: string;
  quantity?: number;
  mode?: "subscription" | "payment";
  metadata?: Record<string, string>;
  successUrl?: string;
  cancelUrl?: string;
}

export async function POST(req: Request) {
  let body: CheckoutRequestBody;
  try {
    body = (await req.json()) as CheckoutRequestBody;
  } catch {
    return NextResponse.json({ error: "Invalid JSON payload." }, { status: 400 });
  }

  const {
    lookupKey,
    priceId,
    quantity = 1,
    mode = "subscription",
    metadata,
    successUrl,
    cancelUrl,
  } = body ?? {};
  if (!lookupKey && !priceId) {
    return NextResponse.json(
      { error: "Missing price reference (lookup key or price id)." },
      { status: 400 }
    );
  }

  try {
    const stripe = getStripe();
    let resolvedPriceId = priceId ?? "";

    if (!resolvedPriceId && lookupKey) {
      const prices = await stripe.prices.list({
        lookup_keys: [lookupKey],
        limit: 1,
      });

      resolvedPriceId = prices.data[0]?.id ?? "";

      if (!resolvedPriceId) {
        return NextResponse.json(
          { error: "Price not found for lookup key." },
          { status: 404 }
        );
      }
    }

    const origin = getAppBaseUrl(req.headers.get("origin") ?? undefined);
    const toAbsolute = (url: string) => (url.startsWith("http") ? url : `${origin}${url}`);

    const success = successUrl
      ? toAbsolute(successUrl)
      : `${origin}/web/abonnements?success=true&session_id={CHECKOUT_SESSION_ID}`;
    const cancel = cancelUrl
      ? toAbsolute(cancelUrl)
      : `${origin}/web/abonnements?canceled=true`;

    const session = await stripe.checkout.sessions.create({
      billing_address_collection: "auto",
      line_items: [{ price: resolvedPriceId, quantity }],
      mode,
      metadata,
      success_url: success,
      cancel_url: cancel,
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
