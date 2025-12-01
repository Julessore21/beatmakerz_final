import { NextResponse } from "next/server";
import { getAppBaseUrl, getStripe } from "@/lib/stripe";

export const runtime = "nodejs";

type CheckoutMode = "payment" | "subscription";

interface EmbeddedCheckoutRequestBody {
  sessionId?: string;
  priceId?: string;
  lookupKey?: string;
  quantity?: number;
  mode?: CheckoutMode;
  customerEmail?: string;
  metadata?: Record<string, string>;
}

const DEFAULT_MODE: CheckoutMode = "payment";

export async function POST(req: Request) {
  let body: EmbeddedCheckoutRequestBody = {};
  try {
    body = (await req.json()) as EmbeddedCheckoutRequestBody;
  } catch {
    // Ignore JSON parsing errors and treat as empty body.
  }

  const stripe = getStripe();

  // If a session already exists, reuse it (helpful when returning to the checkout).
  if (body.sessionId) {
    try {
      const existingSession = await stripe.checkout.sessions.retrieve(body.sessionId);
      if (existingSession?.client_secret) {
        return NextResponse.json({ clientSecret: existingSession.client_secret });
      }
    } catch (error) {
      console.error("Stripe embedded checkout reuse error", error);
      return NextResponse.json(
        { error: "Unable to retrieve existing checkout session." },
        { status: 400 }
      );
    }
  }

  const { priceId, lookupKey, quantity = 1, mode = DEFAULT_MODE, customerEmail, metadata } = body;

  if (!priceId && !lookupKey) {
    return NextResponse.json(
      { error: "Provide either a priceId or a lookupKey to start checkout." },
      { status: 400 }
    );
  }

  try {
    let resolvedPriceId = priceId ?? "";

    if (!resolvedPriceId && lookupKey) {
      const prices = await stripe.prices.list({
        lookup_keys: [lookupKey],
        expand: ["data.product"],
        limit: 1,
      });
      resolvedPriceId = prices.data[0]?.id ?? "";
    }

    if (!resolvedPriceId) {
      return NextResponse.json(
        { error: "Unable to determine Stripe price from provided lookup key." },
        { status: 400 }
      );
    }

    const origin = getAppBaseUrl(req.headers.get("origin") ?? undefined);

    const session = await stripe.checkout.sessions.create({
      mode,
      ui_mode: "embedded",
      line_items: [
        {
          price: resolvedPriceId,
          quantity,
        },
      ],
      customer_email: customerEmail,
      metadata,
      return_url: `${origin}/return?session_id={CHECKOUT_SESSION_ID}`,
    });

    if (!session.client_secret) {
      return NextResponse.json(
        { error: "Stripe did not return a client secret for embedded checkout." },
        { status: 500 }
      );
    }

    return NextResponse.json({ clientSecret: session.client_secret, sessionId: session.id });
  } catch (error) {
    console.error("Stripe embedded checkout session error", error);
    return NextResponse.json(
      { error: "Unable to create embedded checkout session." },
      { status: 500 }
    );
  }
}
