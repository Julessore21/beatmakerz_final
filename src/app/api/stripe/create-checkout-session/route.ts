import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

export const dynamic = "force-dynamic";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "sk_placeholder", {
  apiVersion: "2025-09-30.clover",
});

const FRONTEND_URL =
  process.env.NEXT_PUBLIC_APP_URL || "https://beatmakerz.vercel.app";

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as {
      priceId?: string;
      lookupKey?: string;
      mode?: string;
    };

    const { priceId, lookupKey, mode } = body;

    if (!priceId && !lookupKey) {
      return NextResponse.json(
        { error: "priceId ou lookupKey requis." },
        { status: 400 }
      );
    }

    let resolvedPriceId = priceId;
    if (!resolvedPriceId && lookupKey) {
      const prices = await stripe.prices.list({ lookup_keys: [lookupKey], limit: 1 });
      resolvedPriceId = prices.data[0]?.id;
      if (!resolvedPriceId) {
        return NextResponse.json(
          { error: `Aucun prix trouvé pour la clé "${lookupKey}".` },
          { status: 404 }
        );
      }
    }

    const session = await stripe.checkout.sessions.create({
      mode: (mode as Stripe.Checkout.SessionCreateParams.Mode) || "subscription",
      line_items: [{ price: resolvedPriceId!, quantity: 1 }],
      success_url: `${FRONTEND_URL}/web/abonnements?success=true&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${FRONTEND_URL}/web/abonnements?canceled=true`,
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("[stripe/create-checkout-session]", error);
    const message = error instanceof Error ? error.message : "Erreur interne.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
