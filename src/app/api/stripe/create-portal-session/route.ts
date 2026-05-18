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
    const body = (await request.json()) as { sessionId?: string };
    const { sessionId } = body;

    if (!sessionId) {
      return NextResponse.json(
        { error: "sessionId requis." },
        { status: 400 }
      );
    }

    const checkoutSession = await stripe.checkout.sessions.retrieve(sessionId);
    const customerId = checkoutSession.customer as string;

    if (!customerId) {
      return NextResponse.json(
        { error: "Aucun client Stripe associé à cette session." },
        { status: 400 }
      );
    }

    const portalSession = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: `${FRONTEND_URL}/web/abonnements`,
    });

    return NextResponse.json({ url: portalSession.url });
  } catch (error) {
    console.error("[stripe/create-portal-session]", error);
    const message = error instanceof Error ? error.message : "Erreur interne.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
